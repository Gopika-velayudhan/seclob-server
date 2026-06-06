import express from "express";
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  filterProductsBySubCategory,
  getPproducts,
} from "../controller/ProductController.js";
import multipleImageUpload from "../imageuplod/Imageupload.js";

const Productrouter = express.Router();
Productrouter.post("/add-product", multipleImageUpload, addProduct)
  .get("/products", getAllProducts)
  .get("/productss", getPproducts)
  .get("/product/:id", getProductById)
  .put("/product/:id", updateProduct)
  .delete("/product/:id", deleteProduct)
  .get("/search", searchProducts)
.get("/filter", filterProductsBySubCategory);

export default Productrouter;
