import db from '../utils/db';

/**
 * will be realized through the prisma
 * */

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


export const createCategoryHandler = async (category: any): Promise<any> => {
    const {name} = category;
    const newCategory = await db.category.create({
        data: {
            name
        },
        select: {
            id: true,
            name: true,
            posts: true
        },
    });
    return {newCategory}
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


export const deleteCategoryHandler = async (id: number): Promise<void> => {
    await db.category.delete({
        where: {
            id,
        },
    });
};
