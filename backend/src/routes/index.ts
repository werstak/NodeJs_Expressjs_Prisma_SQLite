import express from 'express';

import { authRouter } from './authRouter';
import { rootRouter } from './root.rout'
import { usersRouter } from './users.rout';
import { postsRouter } from './posts.rout';
import { categoriesRouter } from './categories.rout';
import upload from '../middleware/upload';


console.log('index - ROUTS')

export const router = express.Router();

router.use('/auth', upload, authRouter);
router.use('/posts', upload, postsRouter);
router.use('/categories', categoriesRouter);
router.use('/users', upload, usersRouter);
router.use('/', rootRouter);

