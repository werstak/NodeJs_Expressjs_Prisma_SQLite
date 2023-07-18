import { User } from './user.model';

export type PostModel = {
    id: number;
    title: string;
    description: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: number;
};
