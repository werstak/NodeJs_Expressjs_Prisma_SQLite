import multer from 'multer';
import moment from 'moment';

const storage = multer.diskStorage({
    destination(reg, file, cb) {
        cb(null, 'src/uploads/')
    },
    filename(reg, file, cd) {
        const date = moment().format('DDMMYYYY-HHmmss')
        console.log('NAME File = ' , date);
        cd(null, `${date}-${file.originalname}`)
    }
})

// const fileFilter = (req: any, file: any, cb: any) => {
//     if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
//         cb(null, true)
//     } else {
//         cb(null, false)
//     }
// }


const fileFilter = (req: any, file: any, cb: any) => {
    if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')){
        cb(null, true);
    } else{
        cb(null, false);
    }
};

const limits = {
    fileSize: 1024 * 1024 * 5
}

let upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});

export default upload.single('ProfilePicture')


// const multer = require('multer');
// const moment = require('moment');
//
// const storage = multer.diskStorage({
//     destination(reg, file, cd) {
//         cd(null, 'uploads/')
//     },
//     filename(reg, file, cd) {
//         const date = moment().format('DDMMYYYY-HHmmss')
//         cd(null, `${date}-${file.originalname}`)
//     }
// })
//
// const fileFilter = (reg, file, cd) => {
//     if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
//         cd(null, true)
//     } else {
//         cd(null, false)
//     }
// }
//
// const limits = {
//     fileSize: 1024 * 1024 * 5
// }
//
// module.exports = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: limits
// })
