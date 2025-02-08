const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema } = require("../schema.js");
const {isLoggedIn} = require("../authenticateMiddleware.js");

const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })



const listingController = require("../controllers/listing.js");


const validateListing = (req,res,next) => {
    const {error} = listingSchema.validate(req.body.listing);
        if(error) {
            throw new ExpressError(400,error);
        }
        else{
            next();
        }
}



// All Listing (index routes, index.ejs)
router.get("/", wrapAsync (listingController.indexRoute));

//New route create (new.ejs)
router.get("/new",isLoggedIn, listingController.newRoute);

// Create Listing 
router.post("/add", isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.createRoute));
// router.post("/add", upload.single("listing[image]"), (req, res) => {
//     res.send(req.file);
// })

// Show route (Particular listing data)
router.get("/:id", wrapAsync (listingController.showRoute));


// Edit route(edit.ejs)
router.get("/:id/edit",isLoggedIn, wrapAsync (listingController.editRoute));


//Update route
router.put("/:id",isLoggedIn,  upload.single("listing[image]"), wrapAsync (listingController.updateRoute));


// Delete route
router.delete("/:id",isLoggedIn, wrapAsync (listingController.destroyRoute));


module.exports = router;