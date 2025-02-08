const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require('../models/listing.js');
const {isLoggedIn, isReviewAuthor} = require("../authenticateMiddleware.js");


const reviewController = require("../controllers/review.js");

//review schema backend (server side)
const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
        if(error) {
            throw new ExpressError(400,error);
        }
        else{
            next();
        }
}


// Review
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));



// Delete review 
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, (reviewController.destroyReview));


module.exports = router;