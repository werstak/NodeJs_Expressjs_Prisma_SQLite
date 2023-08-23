import { PostModel } from '../../../shared/models/post.model';

export class GetPosts {
  static readonly type = '[Posts] Get';
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
