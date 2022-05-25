/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable linebreak-style */
const express = require('express');
const cors = require('cors');
const UserRouter = require('./routes/v1/users');
const ChangePasswordRouter = require('./routes/v1/change-password');
const WinesRouter = require('./routes/v1/wines');
const MyWinesRouter = require('./routes/v1/my-wines');

const { serverPort } = require('./config');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send({ msg: 'Server is runing' });
});

app.use('/users', UserRouter);
app.use('/', ChangePasswordRouter);
app.use('/', WinesRouter);
app.use('/', MyWinesRouter);

app.all('*', (req, res) => {
  res.status(404).send({ err: 'page not found' });
});

app.listen(serverPort, () => {
  console.log(`server is runing on ${serverPort}`);
});
