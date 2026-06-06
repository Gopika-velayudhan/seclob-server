import User from "../model/UserSchema.js";
import Product from "../model/ProductSchema.js";
import { trycatchmidddleware } from "../middileware/trycatch.js";

export const addToWishlist = async (req, res, next) => {
  const { userId, productId } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return next(
        trycatchmidddleware(404, "Product not found")
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(
        trycatchmidddleware(404, "User not found")
      );
    }

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        message: "Product already in wishlist",
      });
    }

    user.wishlist.push(productId);

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Product added to wishlist",
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (
  req,
  res,
  next
) => {
  const { userId, productId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return next(
        trycatchmidddleware(404, "User not found")
      );
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Product removed from wishlist",
    });
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findById(
      req.params.userId
    ).populate("wishlist");

    if (!user) {
      return next(
        trycatchmidddleware(404, "User not found")
      );
    }

    res.status(200).json({
      status: "success",
       count: user.wishlist.length,
      wishlist: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};