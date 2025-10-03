const multer = require ('multer');

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, './upload')
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
});

const filefilter = (req,file,cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Invalid File Format ,Only image allowed'))
    }
};

const limits = {
    fileSize: 1024 * 1024 * 1
}

const upload = multer({
    storage,
    filefilter,
    limits
})

module.exports= upload