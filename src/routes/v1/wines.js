/* eslint-disable linebreak-style */
/* eslint-disable no-empty */
/* eslint-disable linebreak-style */
/* eslint-disable brace-style */
/* eslint-disable keyword-spacing */
/* eslint-disable linebreak-style */
const express = require('express');
const mysql = require('mysql2/promise');
const loggedIn = require('../../middleware/auth');
const { mysqlConfig } = require('../../config');
const { addWine } = require('../../middleware/validationSchemas/autVerification');
const validation = require('../../middleware/validation');

const router = express.Router();
// eslint-disable-next-line no-undef
router.get('/wines', loggedIn, async (req, res) => {
  try{
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`
    SELECT * FROM wines 
    `);
    await con.end();

    const { page, limit } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return res.send(data.slice(startIndex, endIndex));
  } catch (err)
  {
    console.log(err);
    return res.status(500).send({ err: 'Server issue occured. Please try again later' });
  }
});

router.post('/wines', loggedIn, validation(addWine), async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`
      INSERT INTO wines (title, region, year)
      VALUES (
        ${mysql.escape(req.body.title)}, 
        ${mysql.escape(req.body.region)},
        ${mysql.escape(req.body.year)})
    `);
    await con.end();

    if(!data.insertId) {
      return res.status(500).send({ err: 'Please try again' });
    }
    return res.send({ msg: 'Succesfully added a wine' });
  } catch (err) {
    return res.status(500).send({ err: 'Server issue occured. Please try again later' });
  }
});

module.exports = router;
