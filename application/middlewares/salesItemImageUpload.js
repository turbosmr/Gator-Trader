const multer = require('multer');
const path = require('path');
const mkdirp = require('mkdirp')

// Multer storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "./public/images/uploads/" + req.user.sid + "/salesItems/"; 
        mkdirp(dir, err => cb(err, dir));
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + '_' + (file.originalname).replace(/ /g, "_");;
        cb(null, fileName);
    }
});

// Multer settings
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        var imageExt = path.extname(file.originalname);
        if (imageExt !== '.png' && imageExt !== '.jpg' && imageExt !== '.jpeg') {
            return cb(new Error('Only images are allowed'));
        }
        cb(null, true);
    }
});

module.exports = upload;