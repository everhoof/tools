const { environment } = require('./environment-parse');

module.exports = {
  apps: [
    {
      name: environment.APP_NAME,
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start',
      interpreter: 'node@14.18.1',
      autorestart: true,
      env: {
        NUXT_PORT: environment.APP_PORT,
        NUXT_HOST: '0.0.0.0',
      },
    },
  ],
};
