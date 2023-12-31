import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { PostModel } from '../../core/models/post.model';
import * as config from '../../../app-config';
import { CategoriesModel } from '../../core/models/categories.model';
import { PostParamsModel } from '../../core/models/post-params.model';

@Injectable({
  providedIn: 'root'
})

export class PostsService {

  constructor(
    private http: HttpClient,
  ) {
  }

  postsFilters$ = new BehaviorSubject<any>({});


  fetchPosts(params: PostParamsModel): Observable<any> {
    return this.http.get(config.API_URL + `/posts`, {
      params: new HttpParams()
        .set('pageIndex', params.pageIndex)
        .set('pageSize', params.pageSize)
        .set('authors', JSON.stringify(params.authors))
        .set('categories', JSON.stringify(params.categories))
    })
      .pipe(
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );
  }

  getPost(id: number): Observable<any> {
    return this.http.get(config.API_URL + `/posts/` + id)
      .pipe(
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );
  }

  updatePost(id: number, params: PostModel, picture: any, pictureOrUrl: boolean, previousPictureUrl: string): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('ProfilePicture', picture);
    uploadData.append('post_params', JSON.stringify(params));
    uploadData.append('pictureOrUrl', JSON.stringify(pictureOrUrl));
    uploadData.append('previousPictureUrl', JSON.stringify(previousPictureUrl));
    return this.http.put(config.API_URL + `/posts/` + id, uploadData);
  }

  addPost(params: PostModel, avatar: any): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('ProfilePicture', avatar);
    uploadData.append('post_params', JSON.stringify(params));
    return this.http.post(config.API_URL + `/posts/`, uploadData);
  }

  removePost(id: number, params: any): Observable<any> {
    return this.http.delete(config.API_URL + `/posts/` + id, {params});
  }

  fetchListAllUsers(): Observable<any> {
    return this.http.get(config.API_URL + `/users/list_all_users`)
      .pipe(
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );
  }

  /**
   CATEGORIES of posts
   */
  fetchListCategories(): Observable<any> {
    return this.http.get(config.API_URL + `/categories`)
      .pipe(
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );
  }

  addCategory(params: CategoriesModel): Observable<any> {
    return this.http.post(config.API_URL + `/categories/`, params);
  }

  updateCategory(id: number, params: CategoriesModel): Observable<any> {
    return this.http.put(config.API_URL + `/categories/` + id, params);
  }

  removeCategory(id: number): Observable<any> {
    return this.http.delete(config.API_URL + `/categories/` + id);
  }

}
