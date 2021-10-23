import knex from 'knex';

const db = knex({
  client: 'mysql',
  connection: {
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
  },
});

export default db;
