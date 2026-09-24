module.exports = {
  apps: [
    {
      name: "willhao.com",
      cwd: "/var/www/willhao.com",
      // Run next directly, not via npm, so cluster reloads hand off without dropping requests
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1",
      exec_mode: "cluster",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
