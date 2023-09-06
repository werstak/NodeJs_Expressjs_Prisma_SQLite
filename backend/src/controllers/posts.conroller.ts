import db from '../utils/db';
// import { PostModel } from '../models/post.model';

/**
 * will be realized through the prism
 * */

export const getAllPostsHandler = async (params: any): Promise<any> => {
    const {pageIndex, pageSize} = params;

    const totalCount = await db.post.count();
    const skip = pageIndex * pageSize;

    const posts = await db.post.findMany({
        take: parseInt(pageSize),
        skip: skip,
        select: {
            id: true,
            title: true,
            description: true,
            content: true,
            picture: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    // location: true
                },
            },
        },
    });
     return {posts, totalCount}
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
            content: true,
            picture: true,
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
    const {title, description, content, picture, published, userId} = post;
    const newPost = await db.post.create({
        data: {
            title,
            description,
            content,
            picture,
            published,
            userId
        },
        select: {
            id: true,
            title: true,
            description: true,
            content: true,
            picture: true,
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
    const totalCount = await db.post.count();
    return {totalCount, newPost}
};


export const updatePostHandler = async (post: any, id: number
): Promise<any> => {
    const {title, description, content, picture, published, userId} = post;
    return db.post.update({
        where: {
            id,
        },
        data: {
            title,
            description,
            content,
            picture,
            published,
            userId
        },
        select: {
            id: true,
            title: true,
            description: true,
            content: true,
            picture: true,
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
