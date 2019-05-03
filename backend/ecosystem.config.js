module.exports = {
  apps: [
      {
          name: "API",
          script: "./bin/www",
          env: {
              PORT: 3000,
              NODE_ENV: "development",
              DEBUG: "api:*"
          },
          env_production: {
              PORT: 3000,
              NODE_ENV: "production",
              DEBUG: "api:*"
          }
      }
  ]
};