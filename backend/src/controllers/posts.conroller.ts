/**
 * will be realized through the prism
 * */

export type Post = {
    id: number;
    title: string;
    description: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    author: string;
    authorId: number;
};

export const getPostsHandler = async (): Promise<Post[]> => {
    const res = [
        {
            id: 1,
            title: 'Post 1',
            description: 'description description description description description',
            published: true,
            createdAt: '07.07.2023',
            updatedAt: '10.07.2023',
            author: 'Ben',
            authorId: 1
        },
        {
            id: 2,
            title: 'Post 1',
            description: 'description description description description description',
            published: true,
            createdAt: '07.07.2023',
            updatedAt: '10.07.2023',
            author: 'Ben',
            authorId: 1
        },

    ];

    console.log('Controller - POSTS')

    return res
};
