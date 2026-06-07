import User from "../model/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { trycatchmidddleware } from "../middileware/trycatch.js";
import { joiUserSchema } from "../model/ValidationSchema.js";
import Category from "../model/CategorySchema.js";
import { joiCategorySchema } from "../model/ValidationSchema.js";
import SubCategory from "../model/SubCategory.js";
import { joiSubCategorySchema } from "../model/ValidationSchema.js";

import dotenv from "dotenv";
import { joiLoginSchema } from "../model/ValidationSchema.js";
dotenv.config();



export const userRegister = async (req, res, next) => {
  const { value, error } = joiUserSchema.validate(req.body);

  if (error) {
    return next(trycatchmidddleware(400, "Invalid input data"));
  }

  const { Username, email, password } = value;

  try {
    const existingUser = await User.findOne({ Username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      Username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      status: "Success",
      message: "Registration successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};


export const userLogin = async (req, res, next) => {
  const { value, error } = joiLoginSchema.validate(req.body);

  if (error) {
    return next(trycatchmidddleware(400, error.message));
  }

  const { email, password } = value;
  try {
    const validUser = await User.findOne({ email });
    
    if (!validUser) {
      return next(trycatchmidddleware(404, "User not found"));
    }
    if (validUser.isBlocked) {
      return res.status(403).json({
        status: "error",
        message: "User is blocked",
      });
    }
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(trycatchmidddleware(401, "Incorrect password"));
    }
    const token = jwt.sign(
      { id: validUser._id },
      process.env.User_ACCESS_ToKEN_SECRT
    );
    res.status(200).json({ token, user: validUser });
  } catch (error) {
    next(error);
  }
};

export const addCategory = async (req, res, next) => {
  const { value, error } = joiCategorySchema.validate(req.body);

  if (error) {
    return next(
      trycatchmidddleware(400, error.details[0].message)
    );
  }

  const { name } = value;

  try {
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({
        status: "error",
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
    });

    res.status(201).json({
      status: "success",
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      status: "success",
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const addSubCategory = async (req, res, next) => {
  const { value, error } =
    joiSubCategorySchema.validate(req.body);

  if (error) {
    return next(
      trycatchmidddleware(400, error.details[0].message)
    );
  }

  const { name, categoryId } = value;

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return next(
        trycatchmidddleware(404, "Category not found")
      );
    }

    const existingSubCategory =
      await SubCategory.findOne({
        name,
        categoryId,
      });

    if (existingSubCategory) {
      return res.status(400).json({
        status: "error",
        message: "Sub Category already exists",
      });
    }

    const subCategory = await SubCategory.create({
      name,
      categoryId,
    });

    res.status(201).json({
      status: "success",
      message: "Sub Category added successfully",
      subCategory,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllSubCategories = async (
  req,
  res,
  next
) => {
  try {
    console.log("getAllSubCategories called");

    const subCategories =
      await SubCategory.find()
        .populate("categoryId", "name");

    

    res.status(200).json({
      status: "success",
      subCategories,
    });
  } catch (error) {
    console.log(error); 
    next(error);
  }
};