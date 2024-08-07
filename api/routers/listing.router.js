import express from "express";
import {
  createListing,
  getListings,
  deleteListing,
  updateListing,
  getListignId,
  getAllListings
} from "../controllers/listing.controller.js";
import { verifyAccessToken } from "../../utils/verifyUser.js";

export const listingRoute = express.Router();

listingRoute.post("/createListing", verifyAccessToken, createListing);
listingRoute.get("/:id", verifyAccessToken, getListings);
listingRoute.delete("/deleteListing/:id", verifyAccessToken, deleteListing);
listingRoute.patch("/updateListing/:id", verifyAccessToken, updateListing);
listingRoute.get("/getListing/:id", verifyAccessToken, getListignId);
listingRoute.get("/", verifyAccessToken, getAllListings);