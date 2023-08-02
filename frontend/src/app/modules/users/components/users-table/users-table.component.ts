import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../../users.service';
import { PostsModel, UserModel } from '../../../../shared/models/user.model';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditUsersComponent } from '../../dialogs/edit-users/edit-users.component';

/**
 * @title Table with sticky header
 */
@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent implements OnInit, OnDestroy {
  reloadPage$ = new Subject<void>();


  constructor(
    public usersService: UsersService,
    public dialog: MatDialog
  ) {
  }


  displayedColumns = ['id', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt', 'role', 'avatar', 'posts', 'actions'];

  // dataSource = ELEMENT_DATA;
  dataSource: UserModel[] = [];

  subUsers: Subscription;


  ngOnInit(): void {

    this.fetchData();

    //
    // this.segmentsService.segmentById(params.id).subscribe(data => {
    //   this.selectedSegment = data;
    //   this.segmentsService.selectedIdSegment(this.selectedSegment._id);
    // });


  }

  fetchData() {
    this.subUsers = this.usersService
      .getAllUsers()
      .subscribe(resp => {
        this.dataSource = resp;
        console.log(this.dataSource)
      });
  }



  addUser() {

  }

  // editUser(_id: any) {
  //
  // }

  editUser(id: UserModel) {
    console.log('edit', id)
    const dialogRef = this.dialog.open(EditUsersComponent, {
      data: {id}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {

        // this.refreshTable();
      }
    });
  }

  deleteUser(_id: any) {

  }

  private refreshTable() {
    // this.reloadPage$.next();
  }



  ngOnDestroy() {
    this.subUsers.unsubscribe();
  }

}


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
