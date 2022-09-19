module.exports = {
  apps: [
    {
      name: 'Everhoof Tools',
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start',
      interpreter: 'node@14.18.1',
      autorestart: true,
      env: {
        NUXT_PORT: 3660,
        NUXT_HOST: '0.0.0.0',
      },
    },
  ],
};
