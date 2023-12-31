import { User } from './user.model';
import { CategoriesModel } from './categories.model';

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
    categories?: CategoriesModel[]
};
