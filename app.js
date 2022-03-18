const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { checkUser } = require('./middleware/authMiddleware')

const indexRouter = require('./routes/index');
const productRouter = require('./routes/product')
const categoryRouter = require('./routes/category')
const authRouter = require('./routes/auth')
const searchRouter = require('./routes/search')
const cartRouter = require('./routes/cart')
const cartRequests = require('./requests/cart')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('*', checkUser )


app.use('/', indexRouter);

app.use('/auth', authRouter)

app.use('/search', searchRouter)

app.use('/category', categoryRouter)

app.use('/product',productRouter)


app.use('/cart', cartRouter)
let productId = "86736845"
let variantId = "883360544250"
let quantity = "2"

// cartRequests.addItem(productId, variantId, quantity, (error, data) => {
//   console.log(data)
// })
// cartRequests.removeItem(productId, variantId,(error,data) => {
//   console.log(data)
// })

// cartRequests.changeItemQuantity(productId,variantId,4, (error,data) => {
//   console.log(data)
// })

// cartRequests.getCart((error, data) => {
//   console.log(data)
// })
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render 404 not found page
  if(err.status === 404){
    return res.render('404')
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
