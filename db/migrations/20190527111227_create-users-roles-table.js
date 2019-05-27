exports.up = function(knex, Promise) {
  const createQuery = `CREATE TABLE users_roles(
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER REFERENCES users(id),
    role_name TEXT
  )`;
  return knex.raw(createQuery);
};

exports.down = function(knex, Promise) {
  const dropQuery = `DROP TABLE users_roles`;
  return knex.raw(dropQuery);
};
