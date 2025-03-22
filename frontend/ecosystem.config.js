module.exports = {
  apps: [{
    name: "barker-frontend",
    script: "npm",
    args: "run dev",
    env: {
      PORT: 4000,
      VITE_GOOGLE_CLIENT_ID: "687842546802-kq531epgqsub4ijr1pvm7bmsr44ht8ul.apps.googleusercontent.com"
    },
    watch: true,
    ignore_watch: ["node_modules", "logs"],
    max_memory_restart: "1G",
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    log_file: "./logs/combined.log",
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss Z"
  }]
};