import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../controller/WishlistController.js";

const Wishlistrouter = express.Router()
Wishlistrouter
.post("/add", addToWishlist)

.delete(
  "/remove",
  removeFromWishlist
)

.get(
  "/:userId",
  getWishlist
)

export default Wishlistrouter;