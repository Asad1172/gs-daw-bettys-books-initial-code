const { check, validationResult } = require('express-validator');

// Create a new router
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10
router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
}) 


// GET /users/login
router.get('/login', function(req, res) {
    res.render('login.ejs');
});


// GET /users/list
router.get('/ulist', function(req, res, next) {
    let sqlquery = "SELECT firstname, lastname, username, email FROM passwords";
    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render('ulist.ejs', { users: result });
    });
});

// POST /users/loggedin
router.post('/loggedin', function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    let sqlquery = "SELECT * FROM passwords WHERE username = ?";
    db.query(sqlquery, [username], (err, userResult) => {
        if (err) {
            return next(err);
        }
        if (userResult.length === 0) {
            // User not found
            res.send('Invalid username or password.');
        } else {
            const user = userResult[0];
            // Compare the password
            bcrypt.compare(password, user.hashedpassword, function(err, result) {
                if (err) {
                    return next(err);
                }
                if (result === true) {
                    // Passwords match
                    res.send('Login successful!');
                    // Save user session here, when login is successful
                    req.session.userId = req.body.username;

                } else {
                    // Passwords do not match
                    res.send('Invalid username or password.');
                }
            });
        }
    });
});

router.post('/registered', 
    [check('email').isEmail(),
        check('password').isLength({ min: 5})
    ], 
    function (req, res, next) 
{
    const errors = validationResult(req);
        if (!errors.isEmpty()) 
        {
            res.redirect('./register'); 
        }
        else 
        { 

        const plainPassword = req.body.password
        
        let result;
        
        
            
        // saving data in database
        bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
            // Store hashed password in your database.
            if(err)
            {
                console.log("error here: " + err)
            }
        
        let newrecord = 
        [   
            req.sanitize(req.body.firstname),
            req.sanitize(req.body.lastname),
            req.sanitize(req.body.username),
            req.sanitize(req.body.email),
            hashedPassword
        ]

        let sqlquery = "INSERT INTO passwords (firstname, lastname, username, email, hashedpassword) VALUES (?,?,?,?,?)";

        db.query(sqlquery, newrecord, (err, results) =>
            {
                if (err)
                {
                    console.log("ERROR inserting into database:", err);
                    return next(err);
                }
                else
                {
                    result = 'Hello '+ req.sanitize(req.body.firstname) + ' '+ req.sanitize(req.body.lastname) +' you are now registered!  We will send an email to you at ' + req.body.email
            result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                    res.send(result)
                }
            }
            
        )

    })

    }});



    // Export the router object so index.js can access it
    module.exports = router;
