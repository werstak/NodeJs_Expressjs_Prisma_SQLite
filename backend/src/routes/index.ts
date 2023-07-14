
import express from "express";

import {rootRouter} from "./root"

// import {usersRouter} from "./routes/users"

// const commentsRouter = require('./comments');
// const usersRouter = require('./users');
// const rootRouter = require('./root');

export const router = express.Router();
console.log('index - ROUTS')
// router.use('/comments', commentsRouter);
// router.use('/users', usersRouter);
router.use('/', rootRouter);


// export const authorRouter = express.Router();

// const router = express.Router();




// export default router;

