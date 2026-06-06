
import express from "express";
import {
  userRegister,
  userLogin,
  addCategory,
  addSubCategory
 
} from '../controller/UserController.js';

import verifyToken from "../middileware/UserAuth.js";

const Userrouter = express.Router();

Userrouter
  .post("/userRegister", userRegister)
  
  .post("/login", userLogin)
.post("/category",addCategory)
.post("/subcategory",addSubCategory)
  


export default Userrouter;