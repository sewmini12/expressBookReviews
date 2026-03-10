const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
   // Check if the user is logged in (authorization object exists in the session)
    if(req.session.authorization) {
        // Retrieve the token from the authorization object
        let token = req.session.authorization['accessToken'];
        
        // Verify JWT token
        // Note: Make sure the secret key "access" matches the one you use to sign the token in auth_users.js
        jwt.verify(token, "access", (err, user) => {
            if(!err) {
                req.user = user;
                next(); // Token is valid, proceed to the next middleware/route
            } else {
                return res.status(403).json({message: "User not authenticated"});
            }
        });
    } else {
        return res.status(403).json({message: "User not logged in"});
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
