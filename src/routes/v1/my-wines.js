/* eslint-disable linebreak-style */
const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const loggedIn = require('../../middleware/auth');
const validation = require('../../middleware/validation');

const { mysqlConfig, jwtSecret } = require('../../config');
const { selectWine } = require('../../middleware/validationSchemas/autVerification');

const router = express.Router();

router.get('/my-wine', loggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`
      SELECT title, region, year, quantity
      FROM wines, colections
      WHERE  wines.id = wine_id
    `);
    await con.end();

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: 'Server issue occured' });
  }
});

router.post('/my-wine', loggedIn, validation(selectWine), async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const userDetails = jwt.verify(token, jwtSecret);

  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`
      INSERT INTO colections (wine_id, user_id, quantity) VALUES 
        (${mysql.escape(req.body.wine_id)},
        ${mysql.escape(userDetails.accountId)},
        ${mysql.escape(req.body.quantity)})
      `);
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'Server issue occured' });
  }
});

router.post('/edit-quantity', loggedIn, validation(selectWine), async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    // eslint-disable-next-line no-unused-vars
    const [data] = await con.execute(`
      UPDATE colections
      SET quantity = (quantity + ${mysql.escape(req.body.quantity)})
      WHERE wine_id = ${mysql.escape(req.body.wine_id)}
    `);
    await con.end();
    return res.send({ msg: 'Quantity changed' });
  } catch (err) {
    return res.status(500).send({ err: 'Server issue occured' });
  }
});

module.exports = router;
