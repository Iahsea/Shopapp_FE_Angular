import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserResponse } from '../../responses/user/user.response';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userResponse?: UserResponse | null;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    debugger
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    console.log(">>>>> check userResponse", this.userResponse);
  }
}
