const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { checkUser } = require('./middleware/authMiddleware')
const indexRouter = require('./routes/indexRoutes');
const productRouter = require('./routes/productRoutes')
const categoryRouter = require('./routes/categoryRoutes')
const authRouter = require('./routes/authRoutes')
const searchRouter = require('./routes/searchRoutes')
const cartRouter = require('./routes/cartRoutes')
const wishlistRouter = require('./routes/wishlistRoutes')

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

app.use('/wishlist', wishlistRouter)

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
    return res.status(404).render('404')
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
