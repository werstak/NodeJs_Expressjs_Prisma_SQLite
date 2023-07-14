import express from 'express';

import { rootRouter } from './root'
import { usersRouter } from './users.rout';
import { postsRouter } from './posts.rout';


console.log('index - ROUTS')

export const router = express.Router();

router.use('/posts', postsRouter);
router.use('/users', usersRouter);
router.use('/', rootRouter);

