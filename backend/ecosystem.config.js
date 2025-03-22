module.exports = {
  apps: [{
    name: "barker-backend",
    script: "./dist/src/app.js",
    instances: 1,
    exec_mode: "cluster",
    watch: true,
    max_memory_restart: "1G",
    env: {
      PORT: 3000,
      DB_URL_ENV: "mongodb://mongodb:27017/barker",
      TOKEN_SECRET: "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",
      TOKEN_EXPIRATION: "1d",
      GOOGLE_CLIENT_ID: "687842546802-kq531epgqsub4ijr1pvm7bmsr44ht8ul.apps.googleusercontent.com",
      GOOGLE_CLIENT_SECRET: "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",
      GEMINI_API_KEY: "AIzaSyDgkSm6Eem7ckBBnNO5iOtCQOY5HRr4vhU"
    },
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    log_file: "./logs/combined.log",
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss Z"
  }]
};