//Express
const express = require('express');
const app = express();

const path = require('path');
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT} `);
});

//Cors
const cors = require('cors');
const whitelist = ['http://localhost:3000', 'http://localhost:8080', 'https://art-crafts-site.herokuapp.com'];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))

//Pug
const pug = require('pug');
app.set('view engine', 'pug');

//CSS Folder
app.use(express.static('public'));

//JS Folder 
app.use(express.static('src'));

//Body Parser 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//Bcrypt
const bcrypt = require('bcryptjs');

//Cookie Parser 
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//Express Validator
const {check, validationResult} = require('express-validator');

//Nodemailer
const nodemailer = require('nodemailer');

// Config File
const data = require('./config');

//My SQL
var mySql = require('mysql');

var mySqlDb = mySql.createConnection(
   data[0]
);
  
mySqlDb.connect(function(err) {
    if (err) {
        console.log(err, 'Failed to connect to database')
    }
    console.log("Connected!");
});

mySqlDb.query(`USE defaultdb`);

//Token
const jwt = require('jsonwebtoken');

//Get Today's Date----------------------
var today = new Date();
var dd = String(today.getDate());
var mm = String(today.getMonth() + 1);
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;

function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate(); 
}

//Get Expiration Dates-----------------------
var near_expiration_date = new Date();
let n_mm = String(near_expiration_date.getMonth() + 1);
let n_dd = parseInt(dd) + 11;
let expiration_date = new Date();
let e_dd = parseInt(dd) + 14;


function expirationDates() {
    if(n_dd > getDaysInMonth(n_mm, yyyy)) {
        n_dd = n_dd - getDaysInMonth(n_mm, yyyy);   
        n_mm = parseInt(n_mm) + 1;
    }
    if(e_dd > getDaysInMonth(mm, yyyy)) {
        e_dd = e_dd - getDaysInMonth(mm, yyyy);   
        mm = parseInt(mm) + 1;
    }
    if(mm > 12) {
        mm = mm - 12;
    }

}

expirationDates();
near_expiration_date = yyyy + '-' + n_mm + '-' + n_dd;
expiration_date = yyyy + '-' + mm + '-' + e_dd;


// Generate User_ID
function makeID(length) {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


//Sign Up-----------------------

let token;

app.post('/sign-up', [
    check('first_name', 'First Name required').notEmpty(),
    check('last_name', 'Last Name required').notEmpty(),
    check('email', 'Email required').notEmpty(),
    check('password', 'Password required').notEmpty(),
    check('first_name', 'First Name must contain letters only').isAlpha(),
    check('last_name', 'Last Name must contain letters only').isAlpha(),
    check('email', 'Not a valid email. "email@example.com"').isEmail(),
    check('password', 'At least one letter must be lowercase').matches(/^(?=.*[a-z])/g),
    check('password', 'At least one letter must be uppercase').matches(/(?=.*[A-Z])/g),
    check('password', 'Must contain at least one number').matches(/(?=.*\d)/g),
    check('password', 'No special characters or whitespace').isAlphanumeric(),
    check('password', 'Must be between 8 and 16 characters long').isLength({min:8, max:16}),

], async (req, res) => {
    
    //Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.json(errors.mapped())
    }else {
        checkEmailExists();
    }

    let randomNumber = Math.floor(Math.random() * 15) + 9;
    let user_ID = makeID(randomNumber);
    token = jwt.sign({'id': user_ID}, data[2].token_password_2, {expiresIn: '2 weeks'});

    function checkEmailExists() {
        mySqlDb.query(`SELECT Email FROM signed_up WHERE Email= '${req.body.email}' UNION SELECT Email FROM verified_users WHERE Email='${req.body.email}'`, (err, result) => {
            if(err) {
                res.status(500).redirect('/error500/internal_server_error');
            }
          
            if(result == false) {
                mySqlDb.query(`INSERT INTO signed_up VALUES('${req.body.first_name}', '${req.body.last_name}', '${req.body.email}', '${hashedPassword}', '${today}', '${near_expiration_date}', '${expiration_date}', '${user_ID}')`, (err, entered) => {
                    if(err) {
                        res.status(500).redirect('/error500/internal_server_error');
                    }else {
                        sendEmail();
                        res.json({
                            errors: 'No Errors Found',
                            user_ID: user_ID
                        })
                    }    
                })
            }else {
                res.json({emailTaken:'Email is already taken'});  
            }
        });
    }

 
   function sendEmail() {
      //Verification Email
        const transporter = nodemailer.createTransport(
           data[1]
        );
 
        const emailOptions = {
            from: {
                name: 'Arts and Crafts Supplies ACS',
                address: 'noreply.artsandcraftssupplies@gmail.com'
            },
            to: req.body.email,
            subject: 'Account Verification',
            html: pug.renderFile(__dirname + '/views/verification_email_template.pug', {
                user_ID: user_ID
            })
        }
    
        transporter.sendMail(emailOptions, (err, sent) => {
            if(err) {
                console.log('Verf Email failed to send:' + err)
            }else {
                console.log('Verification email sent' + sent.response); 
            }
        });

    }
});


//Successfully Verified------------------
app.post('/verified_sucessfully', (req, res) => {
    jwt.verify(token, data[2].token_password_2, (err, decoded) => {
        if(err) {
            res.redirect('/error403/invalid_link');
        }else {
            mySqlDb.query(`INSERT INTO verified_users SELECT first_name, last_name, Email, Password, sign_up_date, User_ID FROM signed_up WHERE User_ID ='${req.body.user_ID}'`, (err, user) => {
                if(err) {
                   throw err;
                }else {
                    mySqlDb.query(`DELETE FROM signed_up WHERE User_ID ='${req.body.user_ID}'`);
                }
            });
        }
    })   
});


  
// //Unverified Emails (Deletion Warning)-----------

function deletionWarning() {
  
  // Near expired unverified accounts, first name, and ID
  mySqlDb.query(`SELECT first_name, Email, User_ID FROM signed_up WHERE near_expiration_date = '${today}'`, (err, result) => {
      if(err) {
          throw err;
      }

      let expiring_users = result.map(value => {
          return {
              Email: value.Email,
              Name: value.first_name,
              User_ID: value.User_ID
          }
      });

  let expires = mm + '-' + e_dd + '-' + yyyy;

  expiring_users.forEach(element => {
      let expiring_email = element.Email;
      let expiring_name = element.Name;
      let expiring_user_ID = element.User_ID;
    
  if(result == false) {
        return;
  }else {

  //Send Verification Reminder Email

  token = jwt.sign({'id': expiring_user_ID}, data[2].token_password_2, {expiresIn: '3 days'});

    const transporter = nodemailer.createTransport(
        data[1]
    );
  
      const emailOptions = {
          from: {
              name: 'Arts and Crafts Supplies ACS',
              address: 'noreply.artsandcraftssupplies@gmail.com'
          },
          to: expiring_email,
          subject: 'Reminder: Verify Your Account',
          html: pug.renderFile(__dirname + '/views/verify_reminder_email.pug', {
              first_name: expiring_name,
              date: expires,
              id: expiring_user_ID
          })
  
      }
  
      transporter.sendMail(emailOptions, (err, sent) => {
        if(err) {
            throw err;
        }
          console.log('Verification Reminder sent' + sent.response);
      });

    }
})
 
  })

}

deletionWarning();


//Delete Unverified Users---------------
function deleteAccount() {
  // Expired unverified accounts, first name, and ID
  mySqlDb.query(`SELECT first_name, Email FROM signed_up WHERE expiration_date= '${today}'`, (err, result) => {
    if(err) {
        throw err;
    }
    let expired_users = result.map(value => {
        return {
            Email: value.Email,
            Name: value.first_name
        }
    });

      expired_users.forEach(element => {
        let expired_emails = element.Email;
        let expired_name = element.Name;

      if(result == false) {
          return;
      } else {
      //Notification Of Deleted Account
      const transporter = nodemailer.createTransport(
        data[1]
      );
  
      const emailOptions = {
          from: {
              name: 'Arts and Crafts Supplies ACS',
              address: 'noreply.artsandcraftssupplies@gmail.com'
          },
          to: expired_emails,
          subject: 'Arts and Crafts Account Deleted',
          html: pug.renderFile(__dirname + '/views/deleted_account_email.pug', {
              first_name: expired_name
          })
      }
  
      transporter.sendMail(emailOptions, (err, sent) => {
        if(err) {
           throw err;
        }else {
            console.log('Deleted account email sent' + sent.response);
        }
    });

       //Delete User
       mySqlDb.query(`DELETE FROM signed_up WHERE expiration_date = '${today}'`);
  }

    });

  });

}

deleteAccount();



//Send Letter (Personalized Kit)-----------------
app.post('/personalized-kit/subscription-payment', [
    check('frequency', 'Value can not be empty').notEmpty(),
    check('category').custom(value => {
        if(value == 'Choose Category') {
            return Promise.reject('Category not selected');
        }
        return true;
    })
], (req, res) => {

    const errors = validationResult(req);
  
    if(!errors.isEmpty()) {
        res.json(errors)
    }else {
         res.json('No errors');
    }
});


// Header Name -----------
app.post('/header', (req, res) => {
    mySqlDb.query(`SELECT first_name FROM verified_users WHERE User_ID= '${req.body.user_ID}'` , (err, user) => {
        if(err) {
            throw err;
        }else {
            const first_name = user.map(value => {
                res.json(value.first_name);
            })
        }
    });
});


// //Log In-------------------------------------------

app.post('/login', [
    check('email', "Email address is required").notEmpty(),
    check('email', 'Not a valid email. "email@example.com"').isEmail(),
    check('password', "Password is required").notEmpty()
], (req, res) => {

    const errors = validationResult(req);
 
    if(!errors.isEmpty()) {
        res.json(errors.mapped())
    }else {
        checkEmailExists();
    }


    function checkEmailExists() {
        mySqlDb.query(`SELECT Email FROM verified_users WHERE Email= '${req.body.email}'` , (err, user) => {
            if(err) {
                throw err;
            }
            if(user == false) {
                res.json({incorrect_email: 'Email is not associated with any account'});
            }else {
                checkPasswordExists() 
            }  
        })
          
    }

    function checkPasswordExists() {
        mySqlDb.query(`SELECT Password FROM verified_users WHERE Email='${req.body.email}'` , (err, result) => {
            if(err) {
                throw err;
            }
            const pass = result.map(value => {
                return value.Password
            })
            bcrypt.compare(req.body.password, pass[0], (err, isMatch) => {
                if(err) {
                   throw err;
                }
                if (!isMatch) {
                    res.json({incorrect_password: 'Incorrect Password'});
                }else {
                    login();
                }
            })
        }); 
    }

    function login() {
        mySqlDb.query(`SELECT first_name, last_name, User_ID FROM verified_users WHERE Email= '${req.body.email}' `, (err, result) => {
            if(err) throw err;
            const user = result.map(value => {
                return {
                    first_name: value.first_name,
                    last_name: value.last_name,
                    user_ID: value.User_ID
                }
            })
    
            const token = jwt.sign({'id': user.user_ID}, data[2].token_password_3, {expiresIn: '6h'});
            jwt.verify(token, data[2].token_password_3, (err, decoded) => {
                res.json({
                    errors:'No Errors Found',
                    token_exp: decoded.exp,
                    first_name: user[0].first_name,
                    last_name: user[0].last_name
                });
            })
        });
    }

});






//Forgot Password-----------------

let password_token;

app.post('/forgot-password', [
    check('email', "Email address is required").notEmpty(),
    check('email', 'Not a valid email. "email@example.com"').isEmail()
],(req, res)=> {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.send(errors.mapped());
    }else {
        checkEmailExists();
    }

    function checkEmailExists() {
        mySqlDb.query(`SELECT Email, User_ID FROM verified_users WHERE Email= '${req.body.email}'`, (err, result)=> {
            if(err) {
                throw err;
            }
            const user = result.map(value => {
                return value.User_ID
            })
            if(result == false) {
                res.json({invalid_email: "No account associated with this email was found"})
            }else {
                password_token = jwt.sign({'User': user[0]}, data[2].token_password, {expiresIn: '1h'});
                res.json({errors: "No Errors Found"})
                sendEmail(user);
            }
        });
    }


    function sendEmail(user) {
        const transporter = nodemailer.createTransport(
            data[1]
        );

        const emailOptions = {
            from: {
                name: 'Arts and Crafts Supplies ACS',
                address: 'noreply.artsandcraftssupplies@gmail.com'
            },
            to: req.body.email,
            subject: 'Reset Password',
            html: pug.renderFile(__dirname + '/views/reset_password_email.pug', {
                user_ID: user[0]
            })
        }
    
        transporter.sendMail(emailOptions, (err, sent) => {
            if(err) throw err
            console.log('Forgot password email sent' + sent.response);
                
        });

    }
      
  });

// Verify Password Token
app.get('/reset-password/:id', (req, res) => {
    const id = req.params.id;
    jwt.verify(password_token, data[2].token_password, (err, decoded) => {
        if(err) {
            res.redirect('/error403/invalid_link');
        }else {
            res.redirect('/reset-password/new-password/' + id);
        }
    });
    
});



// Reset Password ---------------------
app.post('/reset-password/new-password/:id', [
    check('password', "Password field is required").notEmpty(),
    check('confirmed_password', "Confirm Password field is required").notEmpty(),
    check('password', 'At least one letter must be lowercase').matches(/^(?=.*[a-z])/g),
    check('password', 'At least one letter must be uppercase').matches(/(?=.*[A-Z])/g),
    check('password', 'Must contain at least one number').matches(/(?=.*\d)/g),
    check('password', 'No special characters or whitespace').isAlphanumeric(),
    check('password', 'Must be between 8 and 16 characters long').isLength({min:8, max:16}),
    check('confirmed_password', 'At least one letter must be lowercase').matches(/^(?=.*[a-z])/g),
    check('confirmed_password', 'At least one letter must be uppercase').matches(/(?=.*[A-Z])/g),
    check('confirmed_password', 'Must contain at least one number').matches(/(?=.*\d)/g),
    check('confirmed_password', 'No special characters or whitespace').isAlphanumeric(),
    check('confirmed_password', 'Must be between 8 and 16 characters long').isLength({min:8, max:16}),

], async (req, res) => {

     //Hash Password
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.json(errors.mapped())
    }else {
       passwordsMatch();
    }

    function passwordsMatch() {
        if(req.body.password !== req.body.confirmed_password) {
            res.json({no_match: "Passwords do not match"});
        }else {
            changePassword();
        }
    }

    function changePassword() {
        const id = req.params.id;
        mySqlDb.query(`UPDATE verified_users SET Password = '${hashedPassword}' WHERE User_ID = '${id}'`, (err, update_password)=> {
            if(err) {
                throw err;
            }else {
                res.json({message: 'Password Updated'})
            }
        
        });
    }
        
})


// Settings-------------------------------

//Get Email
app.post('/account-settings/retrieve-email', (req, res) => {
    mySqlDb.query(`SELECT Email, Password FROM verified_users WHERE User_ID= '${req.body.user_ID}'` , (err, result) => {
        if(err) {
            throw err;
        }
        
        const user = result.map(value => {
            return {
                email: value.Email,
                password: value.Password
            }
        })
        
        res.json({
            email: user[0].email,
            password: user[0].password
        });
    });
});


//Update Account Information --------------
app.post('/account-settings', [
    check('first_name', "Value can't be empty").notEmpty(),
    check('last_name', "Value can't be empty").notEmpty(),
    check('email', "Value can't be empty").notEmpty(),
    check('first_name', 'Invalid First Name').isAlpha(),
    check('last_name', "Invalid Last Name").isAlpha(),
    check('email', "Not a valid email").isEmail()
], async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.json(errors.mapped())
    }else {
        mySqlDb.query(`UPDATE verified_users SET first_name= '${req.body.first_name}', last_name= '${req.body.last_name}', Email= '${req.body.email}' WHERE User_ID='${req.body.user_ID}'`, (err, updated) => {
            if(err) {
               throw err;
            }else {
                res.json('No errors');
            }
        })

        mySqlDb.query(`UPDATE subscriptions SET first_name= '${req.body.first_name}', last_name= '${req.body.last_name}' WHERE User_ID='${req.body.user_ID}'`, (err, updated) => {
            if(err) {
               throw err;
            }
        });
    }
});

// Account Settings Password Change --------------
app.post('/account-settings-password-change' , [
    check('password', "Password field is required").notEmpty(),
    check('password', 'At least one letter must be lowercase').matches(/^(?=.*[a-z])/g),
    check('password', 'At least one letter must be uppercase').matches(/(?=.*[A-Z])/g),
    check('password', 'Must contain at least one number').matches(/(?=.*\d)/g),
    check('password', 'No special characters or whitespace').isAlphanumeric(),
    check('password', 'Must be between 8 and 16 characters long').isLength({min:8, max:16}),
], async (req, res) => {

    const errors = validationResult(req);
  
    //Hashed Password--------
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    if(!errors.isEmpty()) {
        res.json(errors.mapped());
    }else {
        mySqlDb.query(`UPDATE verified_users SET Password='${hashedPassword}' WHERE User_ID='${req.body.user_ID}'`, (err) => {
            if(err) {
                throw err;
            }else {
                res.json('Password Changed');
            }
        })
    }

})

// Subscription Settings -------------
app.post('/subscription-settings', (req, res) => {
    mySqlDb.query(`SELECT Category, Count, Frequency, Price, dietary_restrictions, fragrance_allergies FROM subscriptions WHERE User_ID= '${req.body.user_ID}'`, (err, result) => {
        if(err) throw err;
     
        if(result == false) {
            res.json('No subscriptions')
        }else {
            const subscriptions = result.map(value => {
                return {
                    count: value.Count,
                    category: value.Category,
                    frequency: value.Frequency,
                    price: value.Price,
                    diet_restrictions: value.dietary_restrictions,
                    fragrance_allergies: value.fragrance_allergies
                }
            });
            res.json(subscriptions);
        }
    });
});



// Payment ---------------------------

const stripe = require('stripe')('sk_test_51HSriIBqMd2Yi5GDZV6Lx61xLh5ruX6b2SNPPatk4VwcIz8CAiEf1XaDODFYHnqbTbskywsQFejlgDCgMn0T4wvR00vXfz8je8');

// Create Customer
app.post('/create-customer', [
    check('name', 'Full Name is required').notEmpty(),
    check('card_number', "Card number is required").notEmpty(),
    check('card_number', "Card Number is not valid").isCreditCard(),
    check('cvc', "CVC is required").notEmpty(),
    check('cvc', "Not a valid CVC").matches(/^[0-9]{3,4}$/),
    check('exp_date', "Card Expiration is required").notEmpty(),
    check('exp_date', "Not a valid expiration date").matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/),
    check('first_shipping_address', "Shipping address is required").notEmpty(),
    check('shipping_city', "Shipping city is required").notEmpty(),
    check('shipping_country', "Shipping country is required").notEmpty(),
    check('shipping_zip', "Shipping zip code is required").notEmpty(),
    check('first_billing_address', "Billing address is required").notEmpty(),
    check('billing_city', "Billing city is required").notEmpty(),
    check('billing_country', "Billing country is required").notEmpty(),
    check('billing_zip', "Billing zip code is required").notEmpty()
], (req, res) => {

    const errors = validationResult(req);
  
    if(!errors.isEmpty()) {
        res.json(errors.mapped());
    }else {  
        if(req.body.shipping_country == 'US' || req.body.billing_country == 'US') {
            validateState();
        }else {
            createCustomer();
        }
    }

    function validateState() {
        if(req.body.shipping_state == '') {
            res.json({shipping_state: 'Select a state'});
        }else if(req.body.billing_state == '') {
            res.json({billing_state: 'Select a state'});
        }else {
            createCustomer();
        }
    }
  

    function createCustomer() {

        // Customer--------------
        mySqlDb.query(`SELECT first_name, last_name, Email FROM verified_users WHERE User_ID='${req.body.user_ID}'`, async (err, result) => {
            if(err) {
                throw err;
            }else {
                res.json('No errors');
            }
            
            const user = result.map(value => {
                return {
                    first_name: value.first_name,
                    last_name: value.last_name,
                    email: value.Email,
                }
            });

            // Token -------------
            const exp_month = req.body.exp_date.slice(0, 2);
            const exp_year = '20' + req.body.exp_date.slice(3, 5);
            const token = await stripe.tokens.create({
                card: {
                  number: req.body.card_number,
                  exp_month,
                  exp_year,
                  cvc: req.body.cvc,
                  address_city: req.body.billing_city,
                  address_country: req.body.billing_country,
                  address_line1: req.body.first_billing_address,
                  address_line2: req.body.second_billing_address,
                  address_state: req.body.billing_state,
                  address_zip: req.body.billing_zip,
                  name: req.body.name
                }
            });
            
            // Cutomer ----------------
            const customer = await stripe.customers.create({
                name: user[0].first_name + ' ' + user[0].last_name,
                email: user[0].email,
                source: token.id,
                description: 'Arts and Crafts Supplies Subscription',
                address: {
                    city: req.body.billing_city,
                    country: req.body.billing_country,
                    line1: req.body.first_billing_address,
                    line2: req.body.second_billing_address,
                    postal_code: req.body.billing_zip,
                    state: req.body.billing_state
                },
                shipping: {
                    address: {
                        city: req.body.shipping_city,
                        country: req.body.shipping_country,
                        line1: req.body.first_shipping_address,
                        line2: req.body.second_shipping_address,
                        postal_code: req.body.shipping_zip,
                        state: req.body.shipping_state
                    },
                    name:req.body.name
                }
            });    

            // Product -------------
            const product = await stripe.products.create({
                name: req.body.category,
            });

            //Price ------------------
            const individual_price = req.body.price * 100;
            const frequency = req.body.frequency.slice(0, 1);
            const price = await stripe.prices.create({
                unit_amount: individual_price,
                currency: 'usd',
                recurring: {
                    interval: 'month',
                    interval_count: frequency
                },
                product: product.id,
              });

            // Subscription---------------
            const subscription = await stripe.subscriptions.create({
                customer: customer.id,
                items: [
                    {
                    price: price.id,
                    }
                ]
            })

            let count;
            mySqlDb.query(`SELECT Category, Count FROM subscriptions WHERE User_ID='${req.body.user_ID}' AND Category= '${req.body.category}'`,(err, result) => {
                if(err) throw err;

                if(result.length == 0) {
                    count = 1;
                }else {
                    result.map(value => {
                        count = value.Count += 1;
                    });
                }
               
                // Add customer + sub ID  to database
                mySqlDb.query(`INSERT INTO subscriptions VALUES('${user[0].first_name}', '${user[0].last_name}', '${count}', '${req.body.category}', '${req.body.price}', '${req.body.diet}', '${req.body.fragrances}', '${req.body.frequency}', '${today}', '${customer.id}', '${subscription.id}', '${token.id}', '${req.body.user_ID}')`, (err, result) => {
                    if(err) {
                        throw err;
                    }
                });
            });
        }) 
    }
});


// Update Subscription Frequency-----------------
app.post('/update-subscription', (req, res) => {
    mySqlDb.query(`SELECT Customer_ID, Subscription_ID FROM subscriptions WHERE User_ID= '${req.body.user_ID}' AND Category= '${req.body.category}' AND Count='${req.body.count}'`, async (err, result) => {
        if(err) throw err;

        const id = result.map(value => {
            return {
                customer: value.Customer_ID,
                subscription: value.Subscription_ID
            }
        });

        // Delete Old Subscription
        const deleted = await stripe.subscriptions.del(`${id[0].subscription}`, async (err) => {
            if(err) {
                throw err;
            }else {
                // Product -------------
                const product = await stripe.products.create({
                    name: req.body.category,
                });

                //Price ------------------
                const new_price = req.body.price * 100;
                const new_frequency = req.body.frequency.slice(0, 1);
                const price = await stripe.prices.create({
                    unit_amount: new_price,
                    currency: 'usd',
                    recurring: {
                        interval: 'month',
                        interval_count: new_frequency
                    },
                    product: product.id,
                });

                // Subscription---------------
                const new_subscription = await stripe.subscriptions.create({
                    customer: `${id[0].customer}`,
                    items: [
                        {
                        price: price.id,
                        }
                    ]
                });

                 // Next Billing Date ----------------
                    const invoice = await stripe.invoices.retrieveUpcoming({
                        customer: `${id[0].customer}`,
                    });

                    // Update Frequency Subscription
                    let date = new Date(invoice.next_payment_attempt * 1000);
                    var d = String(date.getDate());
                    var m = String(date.getMonth() + 1);
                    var y = date.getFullYear();
                    date = m + '/' + d + '/' + y;

                    mySqlDb.query(`UPDATE subscriptions SET Subscription_ID = '${new_subscription.id}', Frequency= '${req.body.frequency}' WHERE User_ID= '${req.body.user_ID}' AND Category= '${req.body.category}' AND Count='${req.body.count}'`, (err) => {
                        if(err) {
                            throw err;
                        }else {
                            res.json({next_billing_date: date});
                        }
                    });
            }
        });
    })
});

// Update Diet Restriction For Baking
app.post('/update-diet-restrictions', (req, res) => {
      mySqlDb.query(`UPDATE subscriptions SET dietary_restrictions= '${req.body.diet}' WHERE User_ID= '${req.body.user_ID}' AND Category= 'Baking'`, (err) => {
        if(err) {
            throw err;
        }
    });
});


// Update Fragrance Allergies For Baking
app.post('/update-fragrance-allergies', (req, res) => {
    mySqlDb.query(`UPDATE subscriptions SET fragrance_allergies= '${req.body.fragrance}' WHERE User_ID= '${req.body.user_ID}' AND Category= 'Candlemaking'`, (err) => {
      if(err) {
          throw err;
      }
  });
})


// Cancel Subscription ----------------
app.post('/cancel-subscription', (req, res) => {

    if(req.body.category.length == 0) {
        res.json({error: 'Select a subscription'});
    }else {
        req.body.category.forEach(category => {
            mySqlDb.query(`SELECT Subscription_ID, Customer_ID FROM subscriptions WHERE User_ID= '${req.body.user_ID}' AND Category= '${category}'`, async (err, result) => {
                if(err) throw err;
                
                const cus_ID = result.map(value => {
                    return value.Customer_ID
                });

            let date_cancelled = new Date();
            const d = String(date_cancelled.getDate());
            const m = date_cancelled.toLocaleString('default', { month: 'long' });
            const y = date_cancelled.getFullYear();
            date_cancelled = m + ' ' + d + ',' + ' ' + y;

            // Delete Customer
            cus_ID.forEach(async value => {
                mySqlDb.query(`DELETE FROM subscriptions WHERE Customer_ID='${value}'`, (err) => {
                    if(err) throw err;
                    res.json({successful_cancel: `Your subscription for ${req.body.category} supplies has been cancelled on ${date_cancelled}.
                                You will no longer recieve these products.`})
                });
                const deleted = await stripe.customers.del(value);
            });
        });

    })
        
    }

});


// Billing History ------------------
app.post('/billing-history', (req, res) => {

    mySqlDb.query(`SELECT Customer_ID, Category FROM subscriptions WHERE User_ID= '${req.body.user_ID}'`, async (err, result) => {
        if(err) throw err;

        const customer_ID = result.map(value => {
            return value.Customer_ID
        });

        let invoice_array = [];
        let invoice_number = [];
        let amount = [];
        let date = [];
        let status = [];

        
        for(let i=0; i < customer_ID.length; i++) {
            const invoices = await stripe.invoices.list({
                customer: customer_ID[i]
            });

            invoice_array.push(invoices.data)
            
        }
            
        for(let i=0; i < invoice_array.length; i++) {
            invoice_number.push(invoice_array[i][0].number)
            amount.push(invoice_array[i][0].amount_paid / 100);
            const milliseconds = invoice_array[i][0].created * 1000;
            const dateObject = new Date(milliseconds);
            const humanDateFormat = dateObject.toLocaleString();
            const invoice_date = humanDateFormat.split(',')[0];
        
            date.push(invoice_date);
            status.push(invoice_array[i][0].status);  
        }

        if(invoice_number.length == invoice_array.length) {
            res.json({
                invoice_number,
                amount,
                date,
                status
            })
        }   
    }) 
});


// Payment Information ------------------
app.post('/payment-settings', (req, res) => {
    mySqlDb.query(`SELECT Token_ID FROM subscriptions WHERE User_ID= '${req.body.user_ID}'`, (err, result) => {
        if(err) throw err;
        const token_ID = result.map(value => {
            return value.Token_ID
        })

        let lastFour = [];
        let billingAddress = [];
        let type = [];
        let exp_month = [];
        let exp_year = [];

        token_ID.forEach(async id => {
            const token = await stripe.tokens.retrieve(`${id}`);
            lastFour.push(token.card.last4);
            billingAddress.push(`${token.card.address_line1},  ${token.card.address_line2}, ${token.card.address_city}, ${token.card.address_country}, ${token.card.address_state}, ${token.card.address_zip}`);
            type.push(token.card.brand);
            exp_month.push(token.card.exp_month);
            exp_year.push(token.card.exp_year);

            if(lastFour.length == token_ID.length) {
                res.json({
                    lastFour,
                    billingAddress,
                    type,
                    exp_month,
                    exp_year
                })
            }
           
        });
    });
});


// Edit Payment Information --------------
app.post('/update-payment', [
    check('name', 'Full Name is required').notEmpty(),
    check('card_number', "Card number is required").notEmpty(),
    check('card_number', "Card Number is not valid").isCreditCard(),
    check('exp_date', "Card Expiration is required").notEmpty(),
    check('exp_date', "Not a valid expiration date").matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/),
    check('cvc', "CVC is required").notEmpty(),
    check('cvc', "Not a valid CVC").matches(/^[0-9]{3,4}$/),
    check('first_billing_address', "Billing address is required").notEmpty(),
    check('billing_city', "Billing city is required").notEmpty(),
    check('billing_zip', "Billing zip code is required").notEmpty(),
    check('billing_country', "Billing country is required").notEmpty(),
], (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.json(errors.mapped());
    }else {        
        if(req.body.billing_country == 'US') {
            validateState();
        }else {
            updatePayment();
        }
    }

    function validateState() {
        if(req.body.billing_state == '') {
            res.json({billing_state: 'Select a state'});
        }else {
            updatePayment();
        }
    }


    function updatePayment() {
        mySqlDb.query(`SELECT Token_ID, Customer_ID FROM subscriptions WHERE User_ID='${req.body.user_ID}' AND Category='${req.body.category}' AND Count= '${req.body.count}'`, async (err, result) => {
            if(err) throw err;
            const id = result.map(value => {
                return {
                    token_ID: value.Token_ID,
                    customer_ID: value.Customer_ID
                }
            });

            const old_token = await stripe.tokens.retrieve(`${id[0].token_ID}`);

            // Delete Previous Payment -----
            const deleted = await stripe.customers.deleteSource(
                `${id[0].customer_ID}`,
                 old_token.card.id
            );

            // Create New Payment Token ------
            const exp_month = req.body.exp_date.slice(0, 2);
            const exp_year = '20' + req.body.exp_date.slice(3, 5);
            const new_token = await stripe.tokens.create({
                card: {
                  number: req.body.card_number,
                  exp_month,
                  exp_year,
                  cvc: req.body.cvc,
                  address_city: req.body.billing_city,
                  address_country: req.body.billing_country,
                  address_line1: req.body.first_billing_address,
                  address_line2: req.body.second_billing_address,
                  address_state: req.body.billing_state,
                  address_zip: req.body.billing_zip,
                  name: req.body.name
                }
            });
            
            // Update Customer Payment (Stripe) -----------
            const customer = await stripe.customers.update(
                `${id[0].customer_ID}`,
                {  
                    source: new_token.id
                }
              );

            
            // Update Customer Payment (Database) -----------
            mySqlDb.query(`UPDATE subscriptions SET Token_ID= '${new_token.id}'`, async (err) => {
                if(err) {
                    throw err
                }else {
                    const token = await stripe.tokens.retrieve(`${new_token.id}`);
                    res.json({
                        last_four: token.card.last4,
                        type: token.card.brand
                    })
                }
            })
        });
    }
})


// Get Shipping Settings ----------
app.post('/shipping-settings', (req, res) => {
    mySqlDb.query(`SELECT Customer_ID FROM subscriptions WHERE User_ID= '${req.body.user_ID}' AND Category= '${req.body.category}' AND Count= '${req.body.count}'`, async (err, result) => {
        if(err) throw err;
        const customer_ID = result.map(value => {
            return value.Customer_ID
        })

        const customer = await stripe.customers.retrieve(`${customer_ID}`);
        res.json({
            shipping_address: `${customer.shipping.address.line1},
                                ${customer.shipping.address.line2},
                                ${customer.shipping.address.city},
                                ${customer.shipping.address.country},
                                ${customer.shipping.address.state},
                                ${customer.shipping.address.postal_code}`
        })
    }) 
});


// Update Shipping Address -------------
app.post('/update-shipping-address', [
    check('first_shipping_address', "Shipping address is required").notEmpty(),
    check('shipping_city', "Shipping city is required").notEmpty(),
    check('shipping_country', "Shipping country is required").notEmpty(),
    check('shipping_zip', "Shipping zip code is required").notEmpty()
], (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.json(errors.mapped());
    }else {        
        if(req.body.shipping_country == 'US') {
            validateState();
        }else {
            updateShippingAddress();
        }
    }

    function validateState() {
        if(req.body.shipping_state == '') {
            res.json({shipping_state: 'Select a state'});
        }else {
            updateShippingAddress();
        }
    }

    function updateShippingAddress() {
        mySqlDb.query(`SELECT Customer_ID, first_name FROM subscriptions WHERE User_ID= '${req.body.user_ID}' AND Category= '${req.body.category}' AND Count= '${req.body.count}'`, async (err, result) => {
            if(err) throw err;
            const user = result.map(value => {
                return {
                    customer_ID: value.Customer_ID,
                    first_name: value.first_name
                }
            })

            const customer = await stripe.customers.update(
                `${user[0].customer_ID}`,
                {
                    shipping: {
                        name: `${user[0].first_name}`,
                        address: {
                        city: req.body.shipping_city,
                        country: req.body.shipping_country,
                        line1: req.body.first_shipping_address,
                        line2: req.body.second_shipping_address,
                        postal_code: req.body.shipping_zip,
                        state: req.body.shipping_state
                        }
                    }
                }
            );

            res.json('Shipping Address Updated');
        })
    }

})