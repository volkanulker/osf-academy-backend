

module.exports.index_get = (req, res, next) => {
    res.status(302).redirect('/home')
}


module.exports.home_get = (req, res, next) => {
      
    res.status(200).render('home', {breadcrumbObjects:null})
}