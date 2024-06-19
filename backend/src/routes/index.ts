import express from 'express';

// Import routers for different routes
import { authRouter } from './auth.rout';
import { rootRouter } from './root.rout';
import { usersRouter } from './users.rout';
import { postsRouter } from './posts.rout';
import { categoriesRouter } from './categories.rout';
import { dashboardRouter } from './dashboard.rout';

// Import middleware
import upload from '../middleware/upload-middleware';
import { isAuthenticatedMiddleware } from '../middleware';


// Create an instance of Express Router
export const router = express.Router();

// Route definitions
router.use('/auth', authRouter);
router.use('/posts', isAuthenticatedMiddleware, upload, postsRouter);
router.use('/categories', isAuthenticatedMiddleware, categoriesRouter);
router.use('/users', isAuthenticatedMiddleware, upload, usersRouter);
router.use('/dashboard', isAuthenticatedMiddleware, dashboardRouter);

// Root route
router.use('/', rootRouter);

// Export the router instance for use in other files
export default router;
