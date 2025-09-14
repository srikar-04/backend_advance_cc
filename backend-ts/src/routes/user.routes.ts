import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validateSchema } from "../middlewares/zodValidator.middleware.js";
import { user } from "../schemas/user.schema.js";

const router = Router()

// req.files in multer is typed according to the function that you are using on the multer upload
// req.files can be of these three different types

// { [fieldname: string]: Express.Multer.File[] } -->> when using upload.fields(...)
// | Express.Multer.File[] -->> when using upload.array(...)
// | undefined

// so typecast them properly wherever you access "req.files"

router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    validateSchema(user, "body"),
    registerUser
)
router.route('/login').post(loginUser)


export default router