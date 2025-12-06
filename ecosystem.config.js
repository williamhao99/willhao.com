module.exports = {
  apps: [
    {
      name: "willhao.com",
      cwd: "/var/www/willhao.com",
      script: "npm",
      args: "start",
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
