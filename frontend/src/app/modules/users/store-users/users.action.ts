import { UserModel } from '../../../core/models/user.model';

/**
 * Action to get users
 */
export class GetUsers {
  static readonly type = '[Users] Get';

  constructor(public params: any) {}
}

/**
 * Action to add a user
 */
export class AddUser {
  static readonly type = '[Users] Add';

  constructor(public params: UserModel, public avatar: any) {}
}

/**
 * Action to update a user
 */
export class UpdateUser {
  static readonly type = '[Users] Update';

  constructor(
    public id: number,
    public params: any,
    public avatar: any,
    public imageOrUrl: any,
    public previousImageUrl: any
  ) {}
}

/**
 * Action to update a user's password
 */
export class UpdateUserPassword {
  static readonly type = '[Users] UpdatePassword';

  constructor(public id: number, public params: any) {}
}

/**
 * Action to delete a user
 */
export class DeleteUser {
  static readonly type = '[Users] Delete';

  constructor(public id: number, public params: any) {}
}

/**
 * Action to set a selected user
 */
export class SetSelectedUser {
  static readonly type = '[Users] Set';

  constructor(public payload: UserModel) {}
}
