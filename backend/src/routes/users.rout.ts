import express from 'express';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import * as UserHandler from '../controllers/users.conroller';
import fs from 'fs';
import bcrypt from 'bcrypt';
const path = require('path');

export const usersRouter = express.Router();


/**
 GET: all USERS
 */
usersRouter.get('/', async (request: Request, response: Response) => {

    console.log('Root GET - All USERS')
    const params = (request.query);
    console.log('USERS', 'paginator', params)

    try {
        const users = await UserHandler.getAllUsersHandler(params);
        return response.status(200).json(users);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});


/**
 GET: List of all USERS
 */
usersRouter.get('/list_all_users', async (request: Request, response: Response) => {
    console.log('Root GET - LIST All USERS')
    const req = (request);
    console.log('USERS', req)

    try {
        const users = await UserHandler.getListAllUsersHandler();
        return response.status(200).json(users);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});


/**
 GET: A single USER by ID
 */
usersRouter.get('/:id', async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);

    console.log('Root GET - single USER')
    try {
        const user = await UserHandler.getUserHandler(id);
        if (user) {
            return response.status(200).json(user);
        }
        return response.status(404).json('User could not be found');
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});


/**
 POST: Create User
 */
usersRouter.post(
    '/',
    // body("firstName").isString(),
    // body("lastName").isString(),
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
        try {
            console.log('Root POST - Create USER = ', request.body)

            const user = JSON.parse(request.body.user_params);
            const hashPassword = bcrypt.hashSync(user.password, 7);

            let filename = '';

            if (request.file?.filename) {
                filename = `http://localhost:5000/src/uploads/${request.file?.filename}`;
            } else {
                filename = '';
            }

            user.password = hashPassword;
            user.avatar = filename;

            console.log(111111111, user)
            const newUser = await UserHandler.createUserHandler(user);
            return response.status(201).json(newUser);
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**
 PUT: Updating USER
 */
usersRouter.put(
    '/:id',
    // body("firstName").isString(),
    // body("lastName").isString(),
    // body("email").isString(),
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
        const id: number = parseInt(request.params.id, 10);
        try {
            console.log('Root PUT - Update USER = ', request.body.user_params)

            const user = JSON.parse(request.body.user_params);
            const imageOrUrl = JSON.parse(request.body.imageOrUrl);
            const previousImageUrl = JSON.parse(request.body.previousImageUrl);

            let pathRemoveImage ='';
            if (previousImageUrl !== null) {
                pathRemoveImage = previousImageUrl.replace('http://localhost:5000/', '');
            } else {
                pathRemoveImage ='';
            }
            // const pathRemoveImage = previousImageUrl.replace('http://localhost:5000/', '');

            /** Adding, replacing and deleting photos in the database and folder (uploads) */
            let fileUrl = '';
            if (!request.file?.filename) {
                console.log('updating a user without a image and deleting a image')
                if (imageOrUrl) {
                    fileUrl = previousImageUrl;
                    console.log('update a image path in base')
                } else {
                    fileUrl = '';
                    console.log('deleting a image path in base')
                    fs.stat(pathRemoveImage, (err, stats) => {
                        console.log('search for a deleted file in a folder (uploads)', stats);
                        if (err) {
                            return console.error(err);
                        }
                        fs.unlink(pathRemoveImage, err => {
                            if (err) return console.log(err);
                            console.log('file deleted successfully');
                        });
                    });
                }
            } else {
                console.log('deleting a image path in base')
                fs.stat(pathRemoveImage, (err, stats) => {
                    console.log('search for a deleted file in a folder (uploads)', stats);
                    if (err) {
                        return console.error(err);
                    }
                    fs.unlink(pathRemoveImage, err => {
                        if (err) return console.log(err);
                        console.log('file deleted successfully');
                    });
                });

                console.log('first image upload or replacement')
                fileUrl = `http://localhost:5000/src/uploads/${request.file?.filename}`;

            }

            user.avatar = fileUrl;
            const updatedUser = await UserHandler.updateUserHandler(user, id);
            return response.status(200).json(updatedUser);
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**
 DELETE: Delete an USER based on the ID
 */
usersRouter.delete('/:id', async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        console.log('DELETE', 'request.query', request.query)

        const previousAvatarUrl = String(request.query.avatar);
        const pathRemovePicture = previousAvatarUrl.replace('http://localhost:5000/', '');

        /** deleting photos in the database and folder (uploads)*/
        console.log('deleting a picture path in base')
        fs.stat(pathRemovePicture, (err, stats) => {
            console.log('search for a deleted file in a folder (uploads)', stats);
            if (err) {
                return console.error(err);
            }
            fs.unlink(pathRemovePicture, err => {
                if (err) return console.log(err);
                console.log('file deleted successfully');
            });
        });

        await UserHandler.deleteUserHandler(id);
        return response.status(204).json('User has been successfully deleted');
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});
