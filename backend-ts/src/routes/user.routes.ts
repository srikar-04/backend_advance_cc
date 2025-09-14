import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validateSchema } from "../middlewares/zodValidator.middleware.js";
import { user } from "../schemas/user.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

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
router.route('/logout').post(logoutUser)

router.route('/protected-route').post(authMiddleware, (req, res, next) => {
    res.json({
        id: res.locals.user._id,
        username: res.locals.user.fullName,
        message: 'successfully accessed protected route'
    })
})


export default router