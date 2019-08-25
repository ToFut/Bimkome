import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {auth} from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';

import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {AngularFireDatabase} from '@angular/fire/database';


@Injectable()
export class AuthService {

  user: Observable<any>;
  userId: string;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFireDatabase,
              private router: Router) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        this.userId = user.uid;
        if (user) {
          return this.afs.object(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }


  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  emailPasswwordLogin(email , password) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(() => {
        this.router.navigate(['/catalog']);
      }
    ).catch(function (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('Wrong username or password, please try again.');
    });

  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        if( credential.user.uid === '26O4GQSyUGdErmTwWTnRkxIYPW33' || credential.user.uid === 'WoaJfWvzOwf1NxWOE9sczjOf9tp2') {
        this.router.navigate(['/adminPage']);
        } else {
          alert('Admin Panel');
        }
      }).catch(err => {
        alert(err.message);
      });

  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
