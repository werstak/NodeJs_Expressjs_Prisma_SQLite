import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../posts.service';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../../../../store/app.state';
import { PostsState } from '../../store-posts/posts.state';
import { SetPostsName } from '../../store-posts/posts.action';
import { UserModel } from '../../../../shared/models/user.model';
import { PostModel } from '../../../../shared/models/post.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  constructor(
    public postsService: PostsService,
    public store: Store
  ) {
  }


  posts$ = this.postsService.posts$

  subPosts: any;
  private postsArr: PostModel[] = [];



  @Select(AppState.getAppName)
  public appName$: any;

  @Select(PostsState.getLazy1Name)
  public name$: any;


  ngOnInit(): void {
    this.fetchData();
    this.store.dispatch([new SetPostsName('LAZY1')]);

  }

  fetchData() {
    this.subPosts = this.postsService
      .getAllPosts()
      .subscribe(resp => {
        this.postsArr = resp;
        this.postsService.posts$.next(resp);
        console.log(this.postsArr)
      });
  }

  // trackByFn(index, item) {
  //   return item.id; // unique id corresponding to the item
  // }

}

