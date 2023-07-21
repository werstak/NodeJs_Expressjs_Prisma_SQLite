import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {

  constructor(
    public homeService: HomeService
  ) {
  }


  subData: any;
  data: any;


  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.subData = this.homeService
      .getData()
      .subscribe(resp => {
        this.data = resp;
        console.log(this.data)
      });
  }
}
