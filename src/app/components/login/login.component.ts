import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css' , './login.component.less']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  constructor(public afAuth: AngularFireAuth, private router: Router, public route: ActivatedRoute, public auth: AuthService) {
    this.afAuth.authState.subscribe(user => {
      if (user.uid === '26O4GQSyUGdErmTwWTnRkxIYPW33' || user.uid === 'WoaJfWvzOwf1NxWOE9sczjOf9tp2' ) {
        // this.router.navigateByUrl('/homepage');
      }
    });
  }

  ngOnInit() {
  }

}
