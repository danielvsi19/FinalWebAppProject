module.exports = {
  apps: [{
    name: "barker-backend",
    script: "./dist/src/app.js",
    instances: 1,
    exec_mode: "cluster",
    watch: true,
    max_memory_restart: "1G",
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    log_file: "./logs/combined.log",
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss Z"
  }]
};