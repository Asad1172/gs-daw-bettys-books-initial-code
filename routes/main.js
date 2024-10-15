// Create a new router
const express = require("express")
const router = express.Router()

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
})

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

router.get('/about',function(req, res, next){
    res.render('about.ejs')
})

// Export the router object so index.js can access it
module.exports = router