export type User = {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    createdAt?: string
    updatedAt?: string
    role: number
    avatar: string
    posts?: []
};
