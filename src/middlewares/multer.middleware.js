import multer from 'multer'

const storage = multer.diskStorage( {
    destination: function (req, file, cd) {
        cb(null, "./public/temp")
        // all the files recieved from the user, either from form submission or any other any other method, is stored in the "./public/temp foler"
    },
    
    // this key is used for naming the file. Here the file name is the original name of the file sent by the user. "file.originalname" specifies this. 
    // if we want to change the filename then we should give our new or desired name as the second argument to cb function

    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }

    /* If you want to rename the file (e.g., to avoid name collisions), you can modify this to generate a unique name:

    code => cb(null, `${Date.now()}-${file.originalname}`); */

})
// cb = callback

export const upload = multer({
    storage,
})