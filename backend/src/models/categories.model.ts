import { PostModel } from './post.model';

export type CategoriesModel = {
    id: number;
    name: string;
    posts?: PostModel[];
};
