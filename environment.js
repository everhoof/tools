const dotenv = require('dotenv-flow');

const { files } = require('./environment-parse');

dotenv.load(files);
