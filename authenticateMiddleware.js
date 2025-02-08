const Review = require("./models/review.js");

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing !");
        return res.redirect("/login");
    }
    next();
}


const saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


const isReviewAuthor = async (req, res, next) => {
    let{id, reviewId} = req.params;
    const reviewDetail = await Review.findById(reviewId);
    if (!res.locals.currUser._id.equals(reviewDetail.author._id)) {
        req.flash("error", "you are not the owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports = {isLoggedIn, saveRedirectUrl, isReviewAuthor};