import express from 'express';
import type { Request, Response } from 'express';
import * as PostHandler from '../controllers/posts.conroller';
import { body, validationResult } from 'express-validator';
import * as fs from 'fs';


export const postsRouter = express.Router();

/** GET: List of all POSTS */
postsRouter.get('/', async (request: Request, response: Response) => {
    try {
        console.log('Root GET - All POSTS')

        const posts = await PostHandler.getAllPostsHandler();
        return response.status(200).json(posts);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

/** GET: A single POST by ID */
postsRouter.get('/:id', async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);

    try {
        console.log('Root GET - single POST')

        const post = await PostHandler.getSinglePostHandler(id);
        if (post) {
            return response.status(200).json(post);
        }
        return response.status(404).json('Post could not be found');
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});


/** POST: Create a Post */
postsRouter.post(
    '/',
    // body("title").isString(),
    // body("description").isString(),
    // body("userId").isInt(),
    // body("published").isBoolean(),
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
        try {
            console.log('Create POST = ', request.body)
            const post = JSON.parse(request.body.post_params);
            let filename = '';
            if (request.file?.filename) {
                filename = `http://localhost:5000/src/uploads/${request.file?.filename}`;
            } else {
                filename = '';
            }
            post.picture = filename;
            const newPost = await PostHandler.createPostHandler(post);
            return response.status(201).json(newPost);
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/** PUT: Update POST */
postsRouter.put(
    '/:id',
    // body('title').isString(),
    // body('description').isString(),
    // body('userId').isInt(),
    // body('published').isBoolean(),
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
        const id: number = parseInt(request.params.id, 10);
        try {
            console.log('Update POST = ', request.body)
            const post = JSON.parse(request.body.post_params);

            const pictureOrUrl = JSON.parse(request.body.pictureOrUrl);
            const previousPictureUrl = JSON.parse(request.body.previousPictureUrl);
            console.log(2222222, 'pictureOrUrl', pictureOrUrl)
            console.log(33333333, 'request.file?.filename', request.file?.filename)

            const removePicture = previousPictureUrl.replace('http://localhost:5000/', '');


            // console.log(111111,'ProfilePicture', request.body.ProfilePicture)

            /**deleted image*/
            // TODO
            /** add file existence check before deleting*/


                // if (previousPictureUrl == '' || previousPictureUrl == null) {
                //     console.log(33333333333)
                //     return;
                // } else {
                //     const removePicture = previousPictureUrl.replace('http://localhost:5000/', '');
                //     console.log('removePicture', removePicture)
                //     fs.unlink(removePicture, err => {
                //         if(err) throw err;
                //         console.log('1111111111111 File deleted successfully');
                //     });
                // }


            let fileUrl = '';

            if (!request.file?.filename) {
                console.log('обновление  удаление')
                if (pictureOrUrl) {
                    console.log('обновление')
                    fileUrl = previousPictureUrl;
                } else {
                    console.log('удаленеи')
                    fileUrl = '';

                    fs.stat(removePicture, (err, stats) => {
                        console.log('stats', stats);//here we got all information of file in stats variable
                        if (err) {
                            return console.error(err);
                        }

                        fs.unlink(removePicture, err => {
                            if (err) return console.log(err);
                            console.log('file deleted successfully');
                        });
                    });
                }
            } else {
                console.log('первая загрузка картинки или ее замена')
                fileUrl = `http://localhost:5000/src/uploads/${request.file?.filename}`;

                console.log('removePicture', removePicture)
                fs.stat(removePicture, (err, stats) => {
                    console.log(stats);//here we got all information of file in stats variable
                    if (err) {
                        return console.error(err);
                    }

                    fs.unlink(removePicture, err => {
                        if (err) return console.log(err);
                        console.log('file deleted successfully');
                    });
                });

                // fs.unlink(removePicture, err => {
                //     if(err) throw err;
                //     console.log('УДАЛЕНИЕ File deleted successfully');
                // });
            }
            post.picture = fileUrl;


            // let fileUrl = '';
            // if (!request.file?.filename) {
            //     // обновление  удалеие
            //     console.log('обновление  удаление')
            //     if (pictureOrUrl) {
            //         // обновление
            //         console.log('обновление')
            //         fileUrl = previousPictureUrl;
            //     } else {
            //         // удаленеи
            //         console.log('удаленеи')
            //         fileUrl = '';
            //     }
            // } else {
            //     // загрузка новой картинки
            //     console.log('первая загрузка картинки или ее замена')
            //     fileUrl = `http://localhost:5000/src/uploads/${request.file?.filename}`;
            // }
            // post.picture = fileUrl;


            const updatedPost = await PostHandler.updatePostHandler(post, id);

            return response.status(201).json(updatedPost);
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**DELETE: Delete an POST based on the ID*/
postsRouter.delete('/:id', async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        await PostHandler.deletePostHandler(id);
        return response.status(204).json('Post was successfully deleted');
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});
