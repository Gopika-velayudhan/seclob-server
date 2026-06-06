import Product from "../model/ProductSchema.js";
import { joiProductSchema } from "../model/ValidationSchema.js";
import { trycatchmidddleware } from "../middileware/trycatch.js";
import { joiUpdateProductSchema } from "../model/ValidationSchema.js";
import SubCategory from "../model/SubCategory.js";
export const addProduct = async (req, res, next) => {
  try {
  

    
    if (req.body.variants) {
      req.body.variants = JSON.parse(req.body.variants);
    }

    

    const { value, error } = joiProductSchema.validate(req.body);

    if (error) {
      return next(
        trycatchmidddleware(400, error.details[0].message)
      );
    }

    const {
      title,
      description,
      category,
      subCategory,
      variants,
      images,
    } = value;

    const existingProduct = await Product.findOne({ title });

    if (existingProduct) {
      return res.status(400).json({
        status: "error",
        message: "Product already exists",
      });
    }

    const product = await Product.create({
      title,
      description,
      category,
      subCategory,
      variants,
      images,
    });

    res.status(201).json({
      status: "success",
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      status: "success",
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};


export const getPproducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const query = {};

    
    if (req.query.subCategory) {
      const subCategoryDoc = await SubCategory.findOne({
        name: {
          $regex: `^${req.query.subCategory}$`,
          $options: "i",
        },
      });

      if (!subCategoryDoc) {
        return res.status(404).json({
          message: "SubCategory not found",
        });
      }

      query.subCategory = subCategoryDoc._id;
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category")
      .populate("subCategory")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(trycatchmidddleware(404, "Product not found"));
    }

    res.status(200).json({
      status: "success",
      product,
    });
  } catch (error) {
    next(error);
  }
};


export const updateProduct = async (req, res, next) => {
  try {
    if (req.body.variants) {
      req.body.variants = JSON.parse(req.body.variants);
    }

    const { value, error } =
      joiUpdateProductSchema.validate(req.body);

    if (error) {
      return next(
        trycatchmidddleware(400, error.details[0].message)
      );
    }

    const product = await Product.findByIdAndUpdate(
  req.params.id,
  value,
  {
    returnDocument: "after",
    runValidators: true,
  }
);

    if (!product) {
      return next(
        trycatchmidddleware(404, "Product not found")
      );
    }

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(trycatchmidddleware(404, "Product not found"));
    }

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    const products = await Product.find({
      title: {
        $regex: keyword,
        $options: "i", // case-insensitive
      },
    });

    res.status(200).json({
      status: "success",
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const filterProductsBySubCategory = async (req, res, next) => {
  try {
    const { subCategory } = req.query;

    console.log("Searching for:", subCategory);

    const subCategoryDoc = await SubCategory.findOne({
      name: { $regex: `^${subCategory}$`, $options: "i" },
    });

    console.log("Found:", subCategoryDoc);

    if (!subCategoryDoc) {
      return res.status(404).json({
        message: "SubCategory not found",
      });
    }

    const products = await Product.find({
      subCategory: subCategoryDoc._id,
    }).populate("subCategory");

    res.status(200).json({
      status: "success",
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};