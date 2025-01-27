module.exports = {
  apps: [
    {
      name: "postapiapp",
      script: "src/server.ts",
      watch: true,
      ignore_watch: ["node_modules"],
      interpreter: "node",
      exec_mode: "cluster",
      instances: "1",
      autorestart: true,
      max_memory_restart: "500M",
      max_restarts: 3
    }
  ]
};
