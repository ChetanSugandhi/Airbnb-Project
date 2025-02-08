const Listing = require("../models/listing");

module.exports.indexRoute = (async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

module.exports.newRoute = (req,res) => {
    res.render("listings/new.ejs");
}

module.exports.createRoute = (async (req,res) => {
    const listing = {...req.body.listing};       // Get all data in the form of object...

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = await new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.save();
    req.flash("success", "New Listing Created..!!");
    res.redirect("/listings");
})


module.exports.showRoute = ( async (req,res) => {
    let {id} = req.params;
    const listingData = await Listing.findById(id)
        .populate({
            path : "reviews", 
            populate : {
                path : "author"
            }})
            .populate('owner');
            
    if(!listingData) {
        req.flash("error", "Listing you requested does not exist !!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listingData});
})


module.exports.editRoute = ( async (req,res) => {
    let{id} = req.params;
    const listingIdEdit = await Listing.findById(id);
    if(!listingIdEdit) {
        req.flash("error", "Listing you requested does not exist !!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listingIdEdit});
})


module.exports.updateRoute = ( async (req,res) => {
    let{id} = req.params;

    let updatedData = {...req.body.listing};

    const newUpdatedListing = await Listing.findByIdAndUpdate(id,updatedData);

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        newUpdatedListing.image = {url, filename};
        newUpdatedListing.save();
    }

    req.flash("success", "Listing Updated..!!");
    res.redirect(`/listings/${id}`);
})


module.exports.destroyRoute = ( async (req,res) => {
    let{id} = req.params;

    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing : ", deletedListing);
    req.flash("delete", "Listing Deleted..!!");
    res.redirect("/listings");
})