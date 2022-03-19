module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    const email = req.cookies.email;
  
    if (token) {
      let user = {
        token: token,
        email: email,
      };
      res.locals.user = user;
      next();
    } else {
      res.locals.user = null;
      next();
    }
  };