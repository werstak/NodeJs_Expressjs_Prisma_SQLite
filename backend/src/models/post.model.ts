import { User } from './user.model';

export type PostModel = {
    id: number;
    title: string;
    description: string;
    content?: string;
    picture?: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    user: User;
    userId: number;
};
