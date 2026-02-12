module.exports = {
  apps: [
    {
      name: "friendle-bot",
      script: "index.js",
      env: {
        NODE_ENV: "prod",
        DISCORD_TOKEN: process.env.DISCORD_TOKEN,
        DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
      }
    }
  ]
};
