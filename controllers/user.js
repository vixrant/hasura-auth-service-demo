const knex = require('knex');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const database = knex(require('../knexfile'));

// =======
// HELPERS
// =======

const hashPassword = (password) => bcrypt.hash(password, 10);
const checkPassword = (reqPassword, foundUser) => bcrypt.compare(
    reqPassword,
    foundUser.password_digest,
);

const findUser = async (userReq) => {
  const data = await database.raw(
      `SELECT * FROM users WHERE email = ?`,
      [userReq.email],
  );
  return data.rows[0];
};

const getRoles = async (user) => {
  const data = await database.raw(
      `SELECT role_name FROM users_roles WHERE user_id = ?`,
      [user.id]
  );
  return data.rows.map((o) => o.role_name);
};

const createToken = async (user) => {
  const payload = {
    'X-Hasura-default-role': 'user',
  };

  const roles = await getRoles(user);
  if (roles.find((e) => e === 'admin')) {
    payload['X-Hasura-default-role'] = 'admin';
    payload['X-Hasura-admin-secret'] = 'vikrant'; // from Hasura
  }

  payload['X-Hasura-allowed-roles'] = roles;

  return jwt.sign(payload, 'not-so-secret');
};

const createNewUserToken = () => {
  const payload = {
    'X-Hasura-default-role': 'user',
  };

  return jwt.sign(payload, 'not-so-secret');
};

const updateUserToken = async (token, user) => {
  const data = await database.raw(
      `UPDATE users SET token = ? WHERE id = ? RETURNING id, email, token`,
      [token, user.id]
  );
  return data.rows[0];
};

// =======
// EXPORTS
// =======

exports.signIn = async (req, res) => {
  const userReq = req.body;

  const foundUser = await findUser(userReq);
  const match = await checkPassword(userReq.password, foundUser);
  if (!match) {
    return res.status(400).json({
      error: 'User not found.',
    });
  }

  const token = await createToken(foundUser);
  await updateUserToken(token, foundUser);
  foundUser.token = token;

  const cleanUser = _.omit(foundUser, 'password_digest');
  return res.status(200).json(cleanUser);
};

// ============================
// This part isn't required as
// a user with Admin role can
// add users through Graphql
// ============================

const createUser = async (user) => {
  const data = await database.raw(
      `INSERT INTO users (email, password_digest, token, created_at) 
      VALUES (?, ?, ?, ?) 
      RETURNING id, email, created_at, token`,
      [user.email, user.password_digest, user.token, new Date()],
  );
  return data.rows[0];
};

exports.signUp = async (req, res) => {
  const user = req.body;
  user.password_digest = await hashPassword(user.password);
  user.token = createNewUserToken();
  const createdUser = await createUser(user);
  return res.status(201).json({createdUser});
};
