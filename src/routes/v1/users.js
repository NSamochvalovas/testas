/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable linebreak-style */
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { mysqlConfig, jwtSecret } = require('../../config');
const validation = require('../../middleware/validation');
const { reigstrationSchema, loginschema } = require('../../middleware/validationSchemas/autVerification');

const router = express.Router();

router.post('/register', validation(reigstrationSchema), async (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`
      INSERT INTO users (name, email, password)
      VALUES(${mysql.escape(req.body.name)}, ${mysql.escape(req.body.email)}, '${hash}');
    `);
    await con.end();

    if (!data.insertId || data.affectedRows !== 1) {
      console.log(data);
      return res.status(500).send({ err: 'Server issue occurred. Please try again later.' });
    }
    return res.send({ msg: 'Successfully created account' });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: 'Server issue occurred. Please try again later.' });
  }
});

router.post('/login', validation(loginschema), async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`
      SELECT id, email, password
      FROM users
      WHERE email = ${mysql.escape(req.body.email)}
      LIMIT 1
    `);
    await con.end();

    if (data.length === 0) {
      return res.status(400).send({ err: 'User not found' });
    }

    if (!bcrypt.compareSync(req.body.password, data[0].password)) {
      return res.status(400).send({ msg: 'Wrong password' });
    }

    const token = jsonwebtoken.sign({ accountId: data[0].id }, jwtSecret);

    return res.send({
      msg: 'You have logged in',
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: 'We have some server problems' });
  }
});

module.exports = router;
