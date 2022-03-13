// check current user
// we must verify token with jwt.sign() method but we get token
// from an api so simple token check implemented
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
