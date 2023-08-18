import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as UserHandler from "../controllers/users.conroller";
import upload from '../middleware/upload';
import fs from 'fs';
const path = require('path');

export const usersRouter = express.Router();

/** GET: List of all USERS */
usersRouter.get("/", async (request: Request, response: Response) => {

    console.log('Root GET - All USERS')
    try {
      const users = await UserHandler.getAllUsersHandler();
      return response.status(200).json(users);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  });


/** GET: A single USER by ID */
usersRouter.get("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);

    console.log('Root GET - single USER')
    try {
        const user = await UserHandler.getUserHandler(id);
        if (user) {
            return response.status(200).json(user);
        }
        return response.status(404).json("User could not be found");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});


/** POST: Create a User */
usersRouter.post(
    "/",
    // body("firstName").isString(),
    // body("lastName").isString(),
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        try {
            console.log('request.body - create USER = ', request.body)
            const user = JSON.parse(request.body.user_params);
            // console.log(' USER = ', user)


            // const imagePath = path.join?.(__dirname, '/uploads/');

            // console.log(999999, 'imagePath = ', imagePath);
            let filename = '';

            if (request.file?.filename) {
                filename = `http://localhost:5000/src/uploads/${request.file?.filename}`;
            } else {
                filename = '';
            }

            // const filename = `http://localhost:5000/src/uploads/${request.file?.filename}`;
            // console.log(88888, 'filename = ', filename);

            user.avatar = filename;


            const newUser = await UserHandler.createUserHandler(user);
            return response.status(201).json(newUser);
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


// /** POST: Create a User */
// usersRouter.post(
//     "/",
//     body("firstName").isString(),
//     body("lastName").isString(),
//     async (request: Request, response: Response) => {
//         const errors = validationResult(request);
//         if (!errors.isEmpty()) {
//             return response.status(400).json({ errors: errors.array() });
//         }
//         try {
//             console.log('Root POST - create USER = ', request.body)
//
//             const user = request.body;
//             const newUser = await UserHandler.createUserHandler(user);
//             return response.status(201).json(newUser);
//         } catch (error: any) {
//             return response.status(500).json(error.message);
//         }
//     }
// );


/** PUT: Updating an USER */
usersRouter.put(
    "/:id",
    // body("firstName").isString(),
    // body("lastName").isString(),
    // body("email").isString(),
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        const id: number = parseInt(request.params.id, 10);

        try {

            // console.log('111 Root PUT - Updating USER = ', request)
            // console.log('222 Root PUT - Updating USER = ', request.body)
            // console.log('3333 PUT - Updating USER request = ', request.params)
            // const test = JSON.stringify(request.body.UserParams);
            // console.log('44444 test', test);
            // console.log(77777, JSON.parse(request.body.user_params));

            // const imagePath = path.join?.(__dirname, '/uploads/');
            // console.log(999999, 'imagePath = ', imagePath);
            // const file = request.files;
            // const newFileName = encodeURI(id + "-" + file.name);
            // await file.mv(`${__dirname}/uploads/${newFileName}`);

            // const path = request.file.path.replace(/\\/g, "/");
            // await User.findByIdAndUpdate(id, req.body = {ProfilePicture: "http://localhost:5000/" + path}, { new: true });
            // res.json(updateAnUser);


            // const user = JSON.parse(request.body.user_params);
            // let filename = '';
            // if (request.file?.filename) {
            //     filename = `http://localhost:5000/src/uploads/${request.file?.filename}`;
            // } else {
            //     filename = '';
            // }
            // user.avatar = filename;



            console.log(11111, 'Update USER = ', request.body.user_params)

            // const user = JSON.parse(request.body.user_params);
            // let filename = '';
            // if (request.file?.filename) {
            //     filename = `http://localhost:5000/src/uploads/${request.file?.filename}`;
            // } else {
            //     filename = '';
            // }
            // user.avatar = filename;


            const user = JSON.parse(request.body.user_params);
            const imageOrUrl = JSON.parse(request.body.imageOrUrl);
            const previousImageUrl = JSON.parse(request.body.previousImageUrl);

            // console.log(2222222, 'imageOrUrl', imageOrUrl)
            // console.log(33333333, 'request.file?.filename', request.file?.filename)

            const pathRemoveImage = previousImageUrl.replace('http://localhost:5000/', '');


            /**
             Adding, replacing and deleting photos in the database and folder (uploads)
             */
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






// /** PUT: Updating an USER */
// usersRouter.put(
//     "/:id",
//     // body("firstName").isString(),
//     // body("lastName").isString(),
//     // body("email").isString(),
//     async (request: Request, response: Response) => {
//         const errors = validationResult(request);
//         if (!errors.isEmpty()) {
//             return response.status(400).json({ errors: errors.array() });
//         }
//         const id: number = parseInt(request.params.id, 10);
//
//         try {
//             console.log(11111, 'Update POST = ', request.body.user_params)
//
//             const user = JSON.parse(request.body.user_params);
//             let filename = '';
//             if (request.file?.filename) {
//                 filename = `http://localhost:5000/src/uploads/${request.file?.filename}`;
//             } else {
//                 filename = '';
//             }
//             user.avatar = filename;
//             const updatedUser = await UserHandler.updateUserHandler(user, id);
//             return response.status(200).json(updatedUser);
//         } catch (error: any) {
//             return response.status(500).json(error.message);
//         }
//     }
// );


/**DELETE: Delete an USER based on the ID*/
usersRouter.delete("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
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
        return response.status(204).json("User has been successfully deleted");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});




// /**DELETE: Delete an USER based on the ID*/
// usersRouter.delete("/:id", async (request: Request, response: Response) => {
//     const id: number = parseInt(request.params.id, 10);
//     try {
//         console.log('Root DELETE - POST = ', request.body)
//
//         await UserHandler.deleteUserHandler(id);
//         return response.status(204).json("User has been successfully deleted");
//     } catch (error: any) {
//         return response.status(500).json(error.message);
//     }
// });
