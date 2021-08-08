import path from 'path';
import { Request, Response } from 'express';
import Pageres from 'pageres';
import { DateTime } from 'luxon';

async function generate(req: Request, res: Response): Promise<any> {
  res.setHeader('Content-Type', 'application/json');

  const dateTimeString = DateTime.utc().toFormat('yyyy-MM-dd_HH-mm-ss');

  const directory = path.join(__dirname, '..', 'static', 'preview');
  const youtubePreview = `${dateTimeString}`;

  const page = req.body.page;
  const size = req.body.size || '1280x720';
  if (!page) {
    res.status(400);
    res.end(JSON.stringify({ message: '`page` param is required' }));
  }

  try {
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

    res.end(JSON.stringify({ image: path.join('/', 'preview', youtubePreview + '.png') }));
  } catch (e) {
    console.error(e);
    res.status(500);
    res.end(JSON.stringify({ message: 'Unknown error occurred' }));
  }
}

export { generate };
