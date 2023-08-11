import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import * as config from '../../../app-config';
import { PostModel } from '../../shared/models/post.model';

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

  updatePost(id: number, params: PostModel): Observable<any> {
    return this.http.put(config.API_URL + `/posts/` + id, params);
  }

  addPost(params: PostModel): Observable<any> {
    return this.http.post(config.API_URL + `/posts/`, params);
  }

  removePost(id: number): Observable<any> {
    return this.http.delete(config.API_URL + `/posts/` + id);
  }


  // uploadImages(files): Observable<any> {
  //   const uploadData = new FormData();
  //
  //   let i = 0;
  //   for (const file of files) {
  //     uploadData.append("images" + ++i, file);
  //   }
  //
  //   return this.http.post(
  //     config.API_URL + "api/variationgroup/uploadfiles",
  //     uploadData
  //   );
  //   // return of(['fgdgd'])
  // }



}
