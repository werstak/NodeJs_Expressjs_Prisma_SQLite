import db from '../utils/db';
// import { PostModel } from '../models/post.model';

/**
 * will be realized through the prism
 * */

export const getAllPostsHandler = async (): Promise<any[]> => {
    return db.post.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });
};


export const getSinglePostHandler = async (id: number): Promise<any | null> => {
    return db.post.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            title: true,
            description: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });
};


export const createPostHandler = async (post: any): Promise<any> => {
    const { title, description, published, userId } = post;

    return db.post.create({
        data: {
            title,
            description,
            published,
            userId
        },
        select: {
            id: true,
            title: true,
            description: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });
};


export const updatePostHandler = async (post: any, id: number
): Promise<any> => {
    const { title, description, published, userId } = post;
    return db.post.update({
        where: {
            id,
        },
        data: {
            title,
            description,
            published,
            userId
        },
        select: {
            id: true,
            title: true,
            description: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });
};


export const deletePostHandler = async (id: number): Promise<void> => {
    await db.post.delete({
        where: {
            id,
        },
    });
};
