import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-createbusiness',
  imports: [],
  templateUrl: './createbusiness.html',
})
export class CreateBusiness {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
