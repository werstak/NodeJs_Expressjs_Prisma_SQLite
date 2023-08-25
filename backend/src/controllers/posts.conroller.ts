import db from '../utils/db';
// import { PostModel } from '../models/post.model';

/**
 * will be realized through the prism
 * */

export const getAllPostsHandler = async (params: any): Promise<any[]> => {
    const {previousPageIndex, pageIndex, pageSize, length} = params;

    const totalCount = await db.post.count();
    console.log(2222222, 'totalCount POSTS', totalCount)

    let skip;
    if (pageIndex == 0) {
        skip = 0;
        console.log(77777, skip)

    } else if (pageIndex == 1) {
        skip = 1 + (pageIndex - 1) * pageSize;
        console.log(8888, skip)
    } else if (pageIndex > 1) {
        skip = (pageIndex - 1) * pageSize;
        console.log(9999, skip)
    }
    return db.post.findMany({
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
    return db.post.create({
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
