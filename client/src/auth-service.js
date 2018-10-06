import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { delay, map, mapTo } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Observable, TimeoutError } from 'rxjs';


export class AuthService {    
  constructor() {
    this.currentUser = null;
    this.currentUser$ =  new BehaviorSubject(this.currentUser); 
  }

  isLoggedIn() {
    return !!this.currentUser;
  }

  isLoggedIn$() {
    const TIMEOUT = 3000;
    return new Observable(observer => {
      observer.next(false)
      const timerId = setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, TIMEOUT);
      return () => clearTimeout(timerId);
    });
  }

  getCurrentUser$() {
    
  }

  login(userName, password) {
    this.currentUser = {
      id: 2,
      userName: userName,
      isAdmin: false
    };
    setTimeout(() => {
      this.currentUser$.next(this.currentUser);
    }, 3000)
  }

  logout() {
    this.currentUser = null;
    this.currentUser$.next(null);
  }
}

export const authService = new AuthService();