//Khai báo Packages
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//Khai báo Modules
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loaiphongRouter = require('./routes/LoaiPhong');
var phongRouter = require('./routes/Phong');
var khachhangcanhanRouter = require('./routes/KhachHangCaNhan');
var thuephongRouter = require('./routes/ThuePhong');
var traphongRouter = require('./routes/TraPhong');
var chinhsachRouter = require('./routes/ChinhSach');
var baocaoRouter = require('./routes/BaoCao');
var hoadonRouter = require('./routes/HoaDon');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//Khai báo settings
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Khai báo router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/loaiphong', loaiphongRouter);
app.use('/phong', phongRouter);
app.use('/khcn', khachhangcanhanRouter);
app.use('/thuephong', thuephongRouter);
app.use('/traphong', traphongRouter);
app.use('/chinhsach', chinhsachRouter);
app.use('/baocao', baocaoRouter);
app.use('/hoadon', hoadonRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
