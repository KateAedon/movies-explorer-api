const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorsHandler = require('./middlewares/errorsHandler');

// const allowedCors = [
//   'https://kateaedon.movie.nomoredomains.icu',
//   'https://api.kateaedon.movie.nomoredomains.icu',
//   'http://localhost:3001',
//   'http://localhost:3000',
// ];

const { PORT = 3001 } = process.env;
const app = express();

app
  .use(cookieParser())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(requestLogger); // подключаем логгер запросов
app.use(helmet());
app.use(cors({
  origin: 'https://kateaedon.movie.nomoredomains.icu',
}));

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate

app.use(errorsHandler);

app.listen(PORT);
