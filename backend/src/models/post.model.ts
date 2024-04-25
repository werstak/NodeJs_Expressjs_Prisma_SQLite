import { CategoriesModel } from './categories.model';
import { UserModel } from './user.model';
export type PostModel = {
    id: number;
    title: string;
    description: string;
    // content?: string;
    // picture?: string;
    published: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    user: UserModel;
    userId: number;
    categories?: CategoriesModel[];

    content?: string | null; // Update the type of the `content` property
    picture?: string | null;

};
