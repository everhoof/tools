const path = require('path');
const { writeFile } = require('fs/promises');
const Pageres = require('pageres');
const { DateTime } = require('luxon');

const { ImagePool } = require('@squoosh/lib');

async function generate(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const dateTimeString = DateTime.utc().toFormat('yyyy-MM-dd_HH-mm-ss');

  const directory = path.join(__dirname, '..', 'static', 'preview');
  const youtubePreview = `${dateTimeString}`;

  const page = req.body.page;
  const size = req.body.size || '1280x720';
  const compress = !!req.body.compress;

  if (!page) {
    res.status(400);
    res.end(JSON.stringify({ message: '`page` param is required' }));
  }

  try {
    if (compress) {
      const screenshots = await new Pageres({
        delay: 1,
        scale: 1,
        crop: true,
        format: 'png',
      })
        .src(page, [size])
        .run();

      const imagePool = new ImagePool(1);
      const image = imagePool.ingestImage(screenshots[0].buffer);
      await image.encode({
        mozjpeg: {
          quality: 94,
          baseline: false,
          arithmetic: false,
          progressive: true,
          optimize_coding: true,
          smoothing: 0,
          color_space: 3,
          quant_table: 3,
          trellis_multipass: true,
          trellis_opt_zero: true,
          trellis_opt_table: true,
          trellis_loops: 15,
          auto_subsample: false,
          chroma_subsample: 2,
          separate_chroma_quality: true,
          chroma_quality: 70,
        },
      });
      await imagePool.close();
      const filepath = path.join(directory, youtubePreview + '.jpg');
      const rawEncodedImage = (await image.encodedWith.mozjpeg).binary;
      await writeFile(filepath, rawEncodedImage);

      res.end(JSON.stringify({
        image: path.join('/', 'preview', youtubePreview + '.jpg'),
      }));
    } else {
      await new Pageres({
        delay: 1,
        scale: 1,
        crop: true,
        format: 'png',
        filename: youtubePreview,
      })
        .src(page, [size])
        .dest(directory)
        .run();

      res.end(JSON.stringify({
        image: path.join('/', 'preview', youtubePreview + '.png'),
      }));
    }
  } catch (e) {
    console.error(e);
    res.status(500);
    res.end(JSON.stringify({ message: 'Unknown error occurred' }));
  }
}

module.exports = { generate };
