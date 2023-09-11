import express from 'express';
import type { Request, Response } from 'express';
import * as CategoryHandler from '../controllers/categories.conroller';
import { body, validationResult } from 'express-validator';
import * as fs from 'fs';

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
// /**
//  POST: Create a CATEGORY
//  */
// categoriesRouter.post(
//     '/',
//     // body("title").isString(),
//     // body("description").isString(),
//     // body("userId").isInt(),
//     // body("published").isBoolean(),
//     async (request: Request, response: Response) => {
//         const errors = validationResult(request);
//         if (!errors.isEmpty()) {
//             return response.status(400).json({errors: errors.array()});
//         }
//         try {
//             console.log('Create POST = ', request.body)
//             const post = JSON.parse(request.body.post_params);
//             let filename = '';
//             if (request.file?.filename) {
//                 filename = `http://localhost:5000/src/uploads/${request.file?.filename}`;
//             } else {
//                 filename = '';
//             }
//             post.picture = filename;
//             const newPost = await CategoryHandler.createPostHandler(post);
//             return response.status(201).json(newPost);
//         } catch (error: any) {
//             return response.status(500).json(error.message);
//         }
//     }
// );
//
//
// /**
//  PUT: Update CATEGORY
//  */
// categoriesRouter.put(
//     '/:id',
//     // body('title').isString(),
//     // body('description').isString(),
//     // body('userId').isInt(),
//     // body('published').isBoolean(),
//     async (request: Request, response: Response) => {
//         const errors = validationResult(request);
//         if (!errors.isEmpty()) {
//             return response.status(400).json({errors: errors.array()});
//         }
//         const id: number = parseInt(request.params.id, 10);
//         try {
//
//             console.log('Update POST = ', request.body.post_params)
//
//             const post = JSON.parse(request.body.post_params);
//             const pictureOrUrl = JSON.parse(request.body.pictureOrUrl);
//             const previousPictureUrl = JSON.parse(request.body.previousPictureUrl);
//
//             let pathRemovePicture ='';
//             if (previousPictureUrl !== null) {
//                 pathRemovePicture = previousPictureUrl.replace('http://localhost:5000/', '');
//             } else {
//                 pathRemovePicture ='';
//             }
//             // const pathRemovePicture = previousPictureUrl.replace('http://localhost:5000/', '');
//
//             /** adding, replacing and deleting photos in the database and folder (uploads) */
//             let fileUrl = '';
//             if (!request.file?.filename) {
//                 console.log('updating a post without a picture and deleting a picture')
//                 if (pictureOrUrl) {
//                     fileUrl = previousPictureUrl;
//                     console.log('update a picture path in base')
//                 } else {
//                     fileUrl = '';
//                     console.log('deleting a picture path in base')
//                     fs.stat(pathRemovePicture, (err, stats) => {
//                         console.log('search for a deleted file in a folder (uploads)', stats);
//                         if (err) {
//                             return console.error(err);
//                         }
//                         fs.unlink(pathRemovePicture, err => {
//                             if (err) return console.log(err);
//                             console.log('file deleted successfully');
//                         });
//                     });
//                 }
//             } else {
//                 console.log('deleting a picture path in base')
//                 fs.stat(pathRemovePicture, (err, stats) => {
//                     console.log('search for a deleted file in a folder (uploads)', stats);
//                     if (err) {
//                         return console.error(err);
//                     }
//                     fs.unlink(pathRemovePicture, err => {
//                         if (err) return console.log(err);
//                         console.log('file deleted successfully');
//                     });
//                 });
//
//                 console.log('first image upload or replacement')
//                 fileUrl = `http://localhost:5000/src/uploads/${request.file?.filename}`;
//
//             }
//
//             post.picture = fileUrl;
//             const updatedPost = await CategoryHandler.updatePostHandler(post, id);
//             return response.status(201).json(updatedPost);
//         } catch (error: any) {
//             return response.status(500).json(error.message);
//         }
//     }
// );
//
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
