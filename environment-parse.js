/**
 * This file exists because of dotenv-flow politics:
 *
 * .env.local file will not be listed for NODE_ENV="test",
 * since normally you expect tests to produce the same results for everyone.
 * https://www.npmjs.com/package/dotenv-flow#listdotenvfilesdirname-options--string
 */

const fs = require('fs');
const path = require('path');

const dotenvFlow = require('dotenv-flow');

function checkFileExistsSync(filepath) {
  let flag = true;
  try {
    fs.accessSync(filepath, fs.constants.F_OK);
  } catch {
    flag = false;
  }
  return flag;
}

let files = [
  path.join(__dirname, '.env'),
  path.join(__dirname, '.env.local'),
];

if (process.env.NODE_ENV) {
  files.push(
    path.join(__dirname, `.env.${process.env.NODE_ENV}`),
    path.join(__dirname, `.env.${process.env.NODE_ENV}.local`),
  );
}

files = files.filter((file) => checkFileExistsSync(file));

module.exports = {
  environment: dotenvFlow.parse(files),
  files,
};
