import express from 'express';
import type { Request, Response } from 'express';
import * as CategoryHandler from '../controllers/categories.conroller';

export const categoriesRouter = express.Router();


/**
 GET: List of all CATEGORIES
 */
categoriesRouter.get('/', async (request: Request, response: Response) => {
        try {
            console.log('Root GET - All CATEGORIES = ', request.body)
            const posts = await CategoryHandler.getAllCategoriesHandler();
            return response.status(200).json(posts);
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**
 POST: Create a CATEGORY
 */
categoriesRouter.post(
    '/',
    async (request: Request, response: Response) => {
        try {
            console.log('Create CATEGORY = ', request.body)
            const newCategory = await CategoryHandler.createCategoryHandler(request.body);
            return response.status(201).json(newCategory);
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);

/**
 PUT: Update CATEGORY
 */
categoriesRouter.put(
    '/:id',
    async (request: Request, response: Response) => {
        const id: number = parseInt(request.params.id, 10);
        try {
            console.log('Update CATEGORY = ', request.body)
            console.log('ID = ', id)
            const updatedPost = await CategoryHandler.updateCategoryHandler(request.body, id);
            return response.status(201).json(updatedPost);
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**
 DELETE: Delete an CATEGORY based on the ID
 */
categoriesRouter.delete('/:id',
    async (request: Request, response: Response) => {
        const id: number = parseInt(request.params.id, 10);
        try {
            console.log('DELETE CATEGORY = ', request.body)

            await CategoryHandler.deleteCategoryHandler(id);
            return response.status(204).json('Category was successfully deleted');
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);
