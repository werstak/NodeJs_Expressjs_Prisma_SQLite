import express from 'express';

import { rootRouter } from './root.rout'
import { usersRouter } from './users.rout';
import { postsRouter } from './posts.rout';
import upload from '../middleware/upload';


console.log('index - ROUTS')

export const router = express.Router();

router.use('/posts', postsRouter);
router.use('/users', upload, usersRouter);
router.use('/', rootRouter);

