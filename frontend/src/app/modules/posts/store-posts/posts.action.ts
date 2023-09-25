import { PostModel } from '../../../shared/models/post.model';

/**
 POSTS
 */
export class GetPosts {
  static readonly type = '[Posts] Get';

  constructor(public params: any) {
  }

}

export class AddPost {
  static readonly type = '[Posts] Add';

  constructor(public params: PostModel, public avatar: any) {
  }
}

export class UpdatePost {
  static readonly type = '[Posts] Update';

  constructor(public id: number, public params: any, public picture: any, public pictureOrUrl: any, public previousPictureUrl: any) {
  }
}

export class DeletePost {
  static readonly type = '[Posts] Delete';

  constructor(public id: number, public params: any) {
  }
}

export class SetSelectedPost {
  static readonly type = '[Posts] Set';

  constructor(public payload: PostModel) {
  }
}

/**
 USERS list
 */
export class GetListAllUsers {
  static readonly type = '[Users] Get List All Users';

  constructor() {
  }
}

/**
 CATEGORIES of posts
 */
export class GetCategories {
  static readonly type = '[Categories] Get';

  constructor() {
  }
}

export class AddCategory {
  static readonly type = '[Categories] Add';

  constructor(public params: any) {
  }
}

export class UpdateCategory {
  static readonly type = '[Categories] Update';

  constructor(public id: number, public params: any) {
  }
}

export class DeleteCategory {
  static readonly type = '[Categories] Delete';

  constructor(public id: number) {
  }
}

