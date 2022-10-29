const express = require('express');
const cors = require('cors');
const app = express();
const bearerToken = require('express-bearer-token');
const { join } = require('path');
require('dotenv').config({ path: join(__dirname, '../.env') });

const PORT = process.env.CUSTOM_PORT || 8000;

const userRouter = require('./routers/users');
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const categoriesListRouter = require('./routers/categoriesLists');
const cartsRouter = require('./routers/carts');
const addressesRouter = require('./routers/addresses');
const transactionsRouter = require('./routers/transactions');
const stockOpnameRouter = require('./routers/stockOpname')
const rajaOngkirRouter = require('./routers/rajaongkir');





app.use(cors());
app.use(bearerToken());
app.use(express.json());
app.use('/public', express.static('public'));

app.use('/users', userRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/categoriesLists', categoriesListRouter);
app.use('/carts', cartsRouter);
app.use('/addresses', addressesRouter);
app.use('/transactions', transactionsRouter);
app.use('/stockOpname', stockOpnameRouter)
app.use('/rajaongkir', rajaOngkirRouter);

app.use(express.urlencoded({ extended: false }));

app.get('/api', (req, res) => {
  res.send(`Hello, this is my API`);
});

app.use((error, req, res, next) => {
  console.log({ error });

  const errorObj = {
    status: 'Error',
    message: error.message,
    detail: error,
  };

  const httpCode = typeof error.code == 'number' ? error.code : 500;
  res.status(httpCode).send(errorObj);
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
