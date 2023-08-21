import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../../store/app.state';
import { Select, Store } from '@ngxs/store';
import { UsersState } from '../../store-users/users.state';
// import { SetUsersName } from '../../store-users/users.action';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent  implements OnInit {

  // @Select(AppState.getAppName)
  // public appName$: any;

  // @Select(UsersState.getUsersName)
  // public name$: any;
  //
  // @Select(UsersState.getAppName)
  // public appNameFromUsersState$: any;
  //
  // @Select(UsersState.getAppName)
  // public appNameFromUserState2$: any;
  //
  // constructor(public store: Store) {
  // }

  ngOnInit() {
    // this.store.dispatch([new SetUsersName('LAZY2 9999999')]);
  }

}
