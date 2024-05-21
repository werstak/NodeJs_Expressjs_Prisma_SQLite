/**
 * This file contains the Models for the response of the post count query.
 * The response contains the total number of posts, the number of posts by role, user, category, and status.
 */

export class RolePostCount {
  role: number;
  count: number;
}

// Model for counting posts by users
export class UserPostCount {
  id: number;
  firstName: string;
  lastName: string;
  _count: {
    posts: number;
  };
}

// Model for counting posts by category
export class CategoryPostCount {
  id: number;
  name: string;
  _count: {
    posts: number;
  };
}

// Model for counting posts by status
export class StatusPostCount {
  published: boolean;
  count: number;
}

// Main class for response
export class PostsCountsModel {
  totalPosts: number;
  postsByRole: RolePostCount[];
  postsByUser: UserPostCount[];
  postsByCategory: CategoryPostCount[];
  postsByStatus: StatusPostCount[];
}

