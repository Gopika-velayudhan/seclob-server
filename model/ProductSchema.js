import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  ram: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
});

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    //   required: true,
    },

    category: {
      type: String,
    
    },

    subCategory: {
       type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory",
            required: true,
    },

    variants: [variantSchema],

    images: [
      {
        type: String, 
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;