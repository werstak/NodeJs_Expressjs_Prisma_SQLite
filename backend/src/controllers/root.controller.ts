import db from '../utils/db';
import { PostCountResponse, RolePostCount } from '../models';

/**
 * Retrieves post counts by various criteria.
 * @returns An object containing counts by total, role, user, category, and status.
 */
export const getPostCountsHandler = async (): Promise<PostCountResponse> => {
    // Total number of posts
    const totalPosts = await db.post.count();

    // Number of posts by roles
    const usersWithPosts = await db.user.findMany({
        select: {
            role: true,
            _count: {
                select: { posts: true }
            }
        }
    });

    // Initialize aggregated object
    const postsByRole: Record<number, RolePostCount> = {};

    usersWithPosts.forEach(user => {
        const role = user.role;
        if (!postsByRole[role]) {
            postsByRole[role] = { role, count: 0 };
        }
        postsByRole[role].count += user._count.posts;
    });

    // Convert object to array
    const postsByRoleArray = Object.values(postsByRole);

    // Number of posts by users
    const postsByUser = await db.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            _count: {
                select: { posts: true }
            }
        }
    });

    // Number of posts by categories
    const postsByCategory = await db.category.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: { posts: true }
            }
        }
    });

    // Number of posts by status
    const postsByStatus = await db.post.groupBy({
        by: ['published'],
        _count: {
            _all: true
        }
    });

    return {
        totalPosts,
        postsByRole: postsByRoleArray,
        postsByUser,
        postsByCategory,
        postsByStatus: postsByStatus.map(status => ({
            published: status.published,
            count: status._count._all
        }))
    };
};
