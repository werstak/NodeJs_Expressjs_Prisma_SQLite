import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './components';
import { RouterModule, Routes } from '@angular/router';
import { PostComponent } from './components/post/post.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PostsState } from './store-posts/posts.state';
import { NgxsModule } from '@ngxs/store';
import { DialogPostsComponent } from './dialogs/dialog-posts/dialog-posts.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PostsFilterPanelComponent } from './components/posts-filter-panel/posts-filter-panel.component';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { DialogCategoriesPostComponent } from './dialogs/dialog-categories-post/dialog-categories-post.component';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


const routes: Routes = [
  {
    path: '',
    component: PostsComponent
  }
];

@NgModule({
  declarations: [
    PostComponent,
    PostsComponent,
    DialogPostsComponent,
    PostsFilterPanelComponent,
    DialogCategoriesPostComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([PostsState]),
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatListModule,
    MatProgressSpinnerModule
  ]
})
export class PostsModule {
}
