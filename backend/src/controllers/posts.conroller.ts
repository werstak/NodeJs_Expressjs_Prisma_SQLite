import db from '../utils/db';

// interface Post {
//     id: number;
//     title: string;
//     description: string;
//     content: string;
//     picture: string;
//     published: boolean;
//     userId: number;
//     categories: number[];
// }
//
// interface PostQueryParams {
//     pageIndex: number;
//     pageSize: number;
//     authors: string;
//     categories: string;
// }
//
//
// interface PostResponse {
//     totalCount: number;
//     posts: Post[];
// }

/**
 * Handles retrieval of all posts based on provided query parameters.
 * @param params Query parameters for filtering posts.
 * @returns An object containing an array of posts and the total count of posts.
 */
export const getAllPostsHandler = async (params: any): Promise<any> => {
    const {pageIndex, pageSize, authors, categories} = params;

    const totalCount = await db.post.count();
    const skip = pageIndex * pageSize;
    const parseAuthors = JSON.parse(authors);

    console.log('ROLES = ', parseAuthors)
    let authorsArr;
    if (parseAuthors.length) {
        authorsArr = parseAuthors;
    } else {
        authorsArr = undefined;
    }

    const parseCategories = JSON.parse(categories);
    console.log('CATEGORIES = ', parseCategories)
    let categoriesArr;
    if (parseCategories.length) {
        categoriesArr = parseCategories;
    } else {
        categoriesArr = undefined;
    }


    const posts = await db.post.findMany({
        where: {
            user: {
                id: {in: authorsArr},
            },
            categories: {
                some: {
                    id: {in: categoriesArr}
                }
            }
        },
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
            categories: true,
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

/**
 * Retrieves a single post by its ID.
 * @param id The ID of the post to retrieve.
 * @returns The post object if found, otherwise null.
 */
export const getSinglePostHandler = async (id: number): Promise<any> => {
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
            categories: true,
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

/**
 * Creates a new post.
 * @param post The post data to create.
 * @returns An object containing the total count of posts and the newly created post.
 */
export const createPostHandler = async (post: any): Promise<any> => {
    const {title, description, content, picture, published, userId, categories} = post;

    const newPost = await db.post.create({
        data: {
            title,
            description,
            content,
            picture,
            published,
            userId,
            categories: {
                connect: categories
            }
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
            categories: true,
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

/**
 * Updates an existing post.
 * @param post The updated post data.
 * @param id The ID of the post to update.
 * @returns The updated post object.
 */
export const updatePostHandler = async (post: any, id: number
): Promise<any> => {
    const {title, description, content, picture, published, userId, includedCategories, excludedCategories} = post;
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
            userId,
            categories: {
                connect: includedCategories,
                disconnect: excludedCategories
            }
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
            categories: true,
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

/**
 * Deletes a post by its ID.
 * @param id The ID of the post to delete.
 */
export const deletePostHandler = async (id: number): Promise<void> => {
    await db.post.delete({
        where: {
            id,
        },
    });
};
