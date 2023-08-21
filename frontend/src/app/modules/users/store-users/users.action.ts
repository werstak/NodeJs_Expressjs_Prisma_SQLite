import { UserModel } from '../../../shared/models/user.model';

export class AddUser {
  static readonly type = '[Users] Add';

  constructor(public payload: UserModel) {
  }
}

export class GetUsers {
  static readonly type = '[Users] Get';
}

export class UpdateUser {
  static readonly type = '[Users] Update';

  constructor(public id: number, public params: any, public avatar: any, public imageOrUrl: any, public previousImageUrl: any) {
  }
  // constructor(public payload: UserModel, public id: number) {
  // }
}

export class DeleteUser {
  static readonly type = '[Users] Delete';

  constructor(public id: number) {
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
