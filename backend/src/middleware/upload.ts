import multer from 'multer';
import moment from 'moment';

const storage = multer.diskStorage({
    destination(reg, file, cb) {
        cb(null, 'src/uploads/')
    },
    filename(reg, file, cb) {
        const date = moment().format('DDMMYYYY-HHmmss')
        console.log('NAME File = ' , date);
        cb(null, `${date}-${file.originalname}`)
    }
})

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

export default upload.single('ProfilePicture');
