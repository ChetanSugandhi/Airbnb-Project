const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = ( async (req, res) => {
    try{
        let{email, username, password} = req.body;
        const newUser = new User({
            email : email,
            username : username
        });
    
        let registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "New User registered, Welcome to Wandurlust !!");
            res.redirect("/listings");
        })
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }

})


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back on Wandurlust !!");
    let redirect = res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
}

module.exports.logout =  (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err); 
        }
        req.flash("success", "You logged out successfully !");
        res.redirect("/listings");
    })
}