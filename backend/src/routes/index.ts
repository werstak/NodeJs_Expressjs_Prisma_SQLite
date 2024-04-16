import express from 'express';

import { authRouter } from './auth.rout';
import { rootRouter } from './root.rout'
import { usersRouter } from './users.rout';
import { postsRouter } from './posts.rout';
import { categoriesRouter } from './categories.rout';
import upload from '../middleware/upload';
import { isAuthenticated } from '../middleware/middlewares';


console.log('index - ROUTS')

export const router = express.Router();

router.use('/auth', upload, authRouter);
router.use('/posts',isAuthenticated, upload, postsRouter);
router.use('/categories', isAuthenticated, categoriesRouter);
router.use('/users', isAuthenticated, upload, usersRouter);
router.use('/', rootRouter);

