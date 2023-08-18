import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import * as config from '../../../app-config';
import { PostModel } from '../../shared/models/post.model';
import { UserModel } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private http: HttpClient,
  ) {
  }

  posts$ = new BehaviorSubject<any>([]);


  getAllPosts(): Observable<any> {
    return this.http.get(config.API_URL + `/posts`)
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

  updatePost(id: number, params: PostModel, picture: any, pictureOrUrl: any, previousPictureUrl: any): Observable<any> {
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


}
