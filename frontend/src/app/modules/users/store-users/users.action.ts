import { UserModel } from '../../../shared/models/user.model';

export class AddUser {
  static readonly type = '[Users] Add';
  constructor(public params: UserModel, public avatar: any) {
  }
}

export class GetUsers {
  static readonly type = '[Users] Get';
}

export class UpdateUser {
  static readonly type = '[Users] Update';

  constructor(public id: number, public params: any, public avatar: any, public imageOrUrl: any, public previousImageUrl: any) {
  }
}

export class DeleteUser {
  static readonly type = '[Users] Delete';

  constructor(public id: number, public params: any) {
  }
}



export class SetSelectedUser {
  static readonly type = '[Users] Set';

  constructor(public payload: UserModel) {
  }
}

// export class SetUsersName {
//   static readonly type = '[App] Set Users Name';
//
//   constructor(public name: string) {
//   }
// }


// export class CreateTodo {
//   static readonly type = '[TODO] Create Todo';
//
//   constructor(public payload: string) {}
// }
