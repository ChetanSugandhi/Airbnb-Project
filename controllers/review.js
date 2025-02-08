const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = ( async (req,res) => {
    let{id} = req.params;
    let oldListing = await Listing.findById(id);

    let newReview = new Review(req.body.review);
    oldListing.reviews.push(newReview);

    newReview.author = req.user;
    await newReview.save();
    await oldListing.save();

    console.log("New review saved..");
    req.flash("success", "Review Created..!!");
    res.redirect(`/listings/${id}`);
});


module.exports.destroyReview = async (req,res) => {
    console.log("Review deleted..");
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, { $pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("delete", "Review deleted..!!");
    res.redirect(`/listings/${id}`);
}