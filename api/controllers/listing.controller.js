import ListingModel from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    console.log("coming here");
    const newListing = await ListingModel.create(req.body);
    return res.status(201).json({
      message: "New Listing Created Successfully",
      newListing: newListing,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getListings = async (req, res, next) => {
  if (req.user.userId === req.params.id) {
    try {
      const getListings = await ListingModel.find({ useRef: req.params.id });
      return res.status(200).json({ listingdata: getListings });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(401).json({ message: "You can only View your own listings" });
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await ListingModel.findById(req.params.id);

  if (!listing) return res.status(404).json({ message: "Listing not found!" });

  if (req.user.userId === listing.useRef) {
    try {
      await ListingModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Listing deleted Successfully!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
