const connectionUrl = 'postgres://brpoqklyhnmnoi:2bf9441139667bce3f40196bc4679ec84c8ecaa16bbc4e30a01f73d6c69c3fc3@ec2-46-137-113-157.eu-west-1.compute.amazonaws.com:5432/da1188co5ra8ef?ssl=true';

module.exports = {
  client: 'pg',
  connection: connectionUrl,
  migrations: {
    directory: __dirname + '/db/migrations',
  },
  ssl: true,
};
