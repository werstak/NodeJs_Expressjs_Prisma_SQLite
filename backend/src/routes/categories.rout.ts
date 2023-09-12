import express from 'express';
import type { Request, Response } from 'express';
import * as CategoryHandler from '../controllers/categories.conroller';
import { body, validationResult } from 'express-validator';
import * as fs from 'fs';
import { updateCategoryHandler } from '../controllers/categories.conroller';

export const categoriesRouter = express.Router();


/**
 GET: List of all CATEGORIES
 */
categoriesRouter.get('/', async (request: Request, response: Response) => {
    try {
        console.log('Root GET - All CATEGORIES')
        // const params = (request.query);
        // console.log('CATEGORIES', 'paginator', params)

        const posts = await CategoryHandler.getAllCategoriesHandler();
        return response.status(200).json(posts);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});



/**
 POST: Create a CATEGORY
 */
categoriesRouter.post(
    '/',
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
        try {
            console.log('Create CATEGORY = ', request.body)
            const newCategory = await CategoryHandler.createCategoryHandler(request.body);
            return response.status(201).json(newCategory);
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);





// /**
//  GET: A single CATEGORY by ID
//  */
// categoriesRouter.get('/:id', async (request: Request, response: Response) => {
//     const id: number = parseInt(request.params.id, 10);
//     try {
//         console.log('Root GET - single POST')
//         const post = await CategoryHandler.getSinglePostHandler(id);
//         if (post) {
//             return response.status(200).json(post);
//         }
//         return response.status(404).json('Post could not be found');
//     } catch (error: any) {
//         return response.status(500).json(error.message);
//     }
// });
//
//

/**
 PUT: Update CATEGORY
 */
categoriesRouter.put(
    '/:id',
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
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

//
// /**
//  DELETE: Delete an CATEGORY based on the ID
//  */
// categoriesRouter.delete('/:id', async (request: Request, response: Response) => {
//     const id: number = parseInt(request.params.id, 10);
//     try {
//         const previousPictureUrl = String(request.query.picture);
//         const pathRemovePicture = previousPictureUrl.replace('http://localhost:5000/', '');
//
//         /** deleting photos in the database and folder (uploads)*/
//         console.log('deleting a picture path in base')
//         fs.stat(pathRemovePicture, (err, stats) => {
//             console.log('search for a deleted file in a folder (uploads)', stats);
//             if (err) {
//                 return console.error(err);
//             }
//             fs.unlink(pathRemovePicture, err => {
//                 if (err) return console.log(err);
//                 console.log('file deleted successfully');
//             });
//         });
//
//         await CategoryHandler.deletePostHandler(id);
//         return response.status(204).json('Post was successfully deleted');
//     } catch (error: any) {
//         return response.status(500).json(error.message);
//     }
// });
