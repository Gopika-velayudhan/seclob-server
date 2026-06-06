import Joi from "joi";

export const joiUserSchema = Joi.object({
  Username: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  

  wishlist: Joi.array().items(Joi.string().hex().length(24)).optional(),
//   isVerified: Joi.boolean().optional().default(false),
});

export const joiLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});



export const joiProductSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),

  description: Joi.string().required().messages({
    "string.empty": "Description is required",
  }),

  category: Joi.string().required().messages({
    "string.empty": "Category is required",
  }),

   subCategory: Joi.string().required().messages({
    "string.empty": "Category is required",
  }),

  variants: Joi.array()
    .items(
      Joi.object({
        ram: Joi.string().required(),

        price: Joi.number().required().min(0),

        quantity: Joi.number().required().min(0),
      })
    )
    .min(1)
    .required(),

  images: Joi.array()
    .items(Joi.string())
    .min(1)
    .required(),
});

export const joiUpdateProductSchema = Joi.object({
  title: Joi.string(),

  description: Joi.string(),

  category: Joi.string(),

  subCategory: Joi.string(),

  variants: Joi.array().items(
    Joi.object({
      ram: Joi.string().required(),
      price: Joi.number().min(0).required(),
      quantity: Joi.number().min(0).required(),
    })
  ),

  images: Joi.array().items(Joi.string()),
});

export const joiCategorySchema = Joi.object({
  name: Joi.string(),
});

export const joiSubCategorySchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Sub Category name is required",
  }),

  categoryId: Joi.string().required().messages({
    "string.empty": "Category is required",
  }),
});

