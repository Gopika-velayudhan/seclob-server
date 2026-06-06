import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import Userrouter from "./route/UserRoute.js";
import Productrouter from "./route/ProductRoute.js";
import Wishlistrouter from "./route/WishlistRoute.js";


dotenv.config();

mongoose
  .connect(process.env.mongo_string)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: process.env.USER_ACCESS_TOKEN_SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// );


app.use("/api/user", Userrouter);
app.use("/api/product",Productrouter)
app.use("/api/wishlist",Wishlistrouter)

const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
