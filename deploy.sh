export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh

pm2 stop ecosystem.config.js && true

find . -maxdepth 1 ! -name node_modules ! -name artifacts.tgz ! -name .env.development ! -name .env.production ! -name .env.development.local ! -name .env.production.local ! -name . ! -name .. -exec rm -rf {} \;
tar -xvf artifacts.tgz
rm artifacts.tgz

nvm exec 14.18.1 npm i -g yarn
nvm exec 14.18.1 yarn --frozen-lockfile --production
pm2 start ecosystem.config.js
