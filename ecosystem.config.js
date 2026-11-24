module.exports = {
  // pm2 reload doesn't re-read this file. After editing, run on the VM:
  // pm2 delete willhao.com && pm2 start ecosystem.config.js && pm2 save
  apps: [
    {
      name: "willhao.com",
      cwd: "/var/www/willhao.com",
      // Run next directly - through npm, reloads drop requests
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
