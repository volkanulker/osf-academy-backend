

module.exports.index_get = (req, res, next) => {
    res.redirect('/home')
}


module.exports.home_get = (req, res, next) => {
      
    res.render('home', {breadcrumbObjects:null})
}