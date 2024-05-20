import db from '../utils/db';

export type Admin = {
    id: number;
    email: string; // Changed to lowercase "string"
    firstName: string;
    lastName: string;
    role: number;
};

export const getRootHandler = async (): Promise<Admin[]> => {
    const res: Admin[] = [{
        id: 1,
        email: 'email@email.com',
        firstName: 'Johnny',
        lastName: 'Depp',
        role: 1,
    }];

    console.log('Controller - ROOT');

    return res;
};



/**
 * Retrieves post counts by various criteria.
 * @returns An object containing counts by total, role, user, category, and status.
 */
export const getPostCountsHandler = async (): Promise<any> => {
    console.log(9999999)

    const totalPosts = await db.post.count();

    // const postsByRole = await db.post.groupBy({
    //     by: ['user.role'],
    //     _count: {
    //         _all: true
    //     }
    // });

    const postsByUser = await db.post.groupBy({
        by: ['userId'],
        _count: {
            _all: true
        }
    });

    // const postsByCategory = await db.post.groupBy({
    //     by: ['categories.id'],
    //     _count: {
    //         _all: true
    //     }
    // });

    const postsByStatus = await db.post.groupBy({
        by: ['published'],
        _count: {
            _all: true
        }
    });

    return {
        totalPosts,
        // postsByRole,
        postsByUser,
        // postsByCategory,
        postsByStatus
    };
}
