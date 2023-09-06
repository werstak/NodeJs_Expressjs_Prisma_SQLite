import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostsService } from '../../posts.service';
import { ReplaySubject } from 'rxjs';
import { ROLES } from '../../../../shared/constants/roles';

@Component({
  selector: 'app-posts-filter-panel',
  templateUrl: './posts-filter-panel.component.html',
  styleUrls: ['./posts-filter-panel.component.scss']
})
export class PostsFilterPanelComponent implements OnInit, OnDestroy{

  constructor(
    private fb: FormBuilder,
    public postsService: PostsService
  ) {
  }

  public postFilterForm: FormGroup
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  authorList = ROLES

  ngOnInit() {
    this.buildForm();
    // this.onChanges();
  }

  private buildForm() {
    this.postFilterForm = this.fb.group({
      author: [],
      // firstName: '',
      // lastName: '',
      // email: '',
      // roles: [],
    });
  }


  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }


}
