import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  constructor(
    public postsService: PostsService
  ) {
  }


  subPosts: any;
  posts: any;


  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.subPosts = this.postsService
      .getAllPosts()
      .subscribe(resp => {
        this.posts = resp;
        console.log(this.posts)
      });
  }
}

