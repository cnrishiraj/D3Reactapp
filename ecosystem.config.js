module.exports = {
    apps: [
      {
        name: 'd3reactapp',
        script: 'serve',
        env: {
          PM2_SERVE_PATH: './build',
          PM2_SERVE_PORT: 3000,
          PM2_SERVE_SPA: 'true',
          PM2_SERVE_HOMEPAGE: '/index.html',
        },
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
      },
    ],
  };