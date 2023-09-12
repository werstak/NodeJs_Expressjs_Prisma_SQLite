import db from '../utils/db';
// import { PostModel } from '../models/post.model';

/**
 * will be realized through the prism
 * */

// export const getAllCategoriesHandler = async (): Promise<any> => {
//
//     const categories = await db.categories.findMany({
//         select: {
//             id: true,
//             name: true,
//             posts: true
//         },
//     });
//      return {categories}
// };


export const getAllCategoriesHandler = async (): Promise<any> => {
    const categories = await db.category.findMany({
        select: {
            id: true,
            name: true,
            // posts: true
        },
    });
    return {categories}
};



//
// export const getSinglePostHandler = async (id: number): Promise<any | null> => {
//     return db.post.findUnique({
//         where: {
//             id,
//         },
//         select: {
//             id: true,
//             title: true,
//             description: true,
//             content: true,
//             picture: true,
//             published: true,
//             createdAt: true,
//             updatedAt: true,
//             userId: true,
//             categories: true,
//             user: {
//                 select: {
//                     id: true,
//                     firstName: true,
//                     lastName: true,
//                 },
//             },
//         },
//     });
// };
//
//


export const createCategoryHandler = async (category: any): Promise<any> => {
    const {name} = category;
    const newPost = await db.category.create({
        data: {
            name
        },
        select: {
            id: true,
            name: true,
            posts: true
        },
    });
    const totalCount = await db.post.count();
    return {totalCount, newPost}
};




export const updateCategoryHandler = async (category: any, id: number
): Promise<any> => {
    const {name, posts} = category;
    return db.category.update({
        where: {
            id,
        },
        data: {
            name,
            posts
        },
        select: {
            id: true,
            name: true,
            posts: true
        },
    });
};

//
//
// export const deletePostHandler = async (id: number): Promise<void> => {
//     await db.post.delete({
//         where: {
//             id,
//         },
//     });
// };
