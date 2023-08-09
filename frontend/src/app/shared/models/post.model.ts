export class PostModel {
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
}

export class User {
  id: number;
  firstName: string;
  lastName: string
}
