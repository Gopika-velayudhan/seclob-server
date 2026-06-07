
import express from "express";
import {
  userRegister,
  userLogin,
  addCategory,
  addSubCategory,
  getCategories,getAllSubCategories
 
} from '../controller/UserController.js';

import verifyToken from "../middileware/UserAuth.js";

const Userrouter = express.Router();

Userrouter
  .post("/userRegister", userRegister)
  
  .post("/login", userLogin)
.post("/category",addCategory)
.post("/subcategory",addSubCategory)
.get("/category",getCategories)
.get("/subcategorys",getAllSubCategories)

  


export default Userrouter;