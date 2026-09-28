module.exports = {
  // Deploys run `pm2 reload willhao.com`, which never re-reads this file: apply edits
  // on the VM as the deploy user with pm2 delete willhao.com, pm2 start ecosystem.config.js, pm2 save
  apps: [
    {
      name: "willhao.com",
      cwd: "/var/www/willhao.com",
      // Run next directly, not via npm, so cluster reloads hand off without dropping requests
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1",
      exec_mode: "cluster",
      instances: 1,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
