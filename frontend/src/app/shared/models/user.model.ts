export class UserModel {
  id: number;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
  role: number;
  avatar: string;
  posts?: PostsModel[]
}


export class PostsModel {
  id: number;
  title: string;
  description: string;
  content?: string;
  picture?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
}
