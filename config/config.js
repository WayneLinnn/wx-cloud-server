require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Linfeng19960110",
    database: "bunblebee",
    host: process.env.DB_HOST || "10.41.111.100",
    dialect: "mysql",
    logging: console.log,
    timezone: "+08:00",
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Linfeng19960110",
    database: "bunblebee",
    host: process.env.DB_HOST || "10.41.111.100",
    dialect: "mysql",
    logging: false,
    timezone: "+08:00",
  },
};
