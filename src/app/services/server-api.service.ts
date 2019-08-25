import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import set = Reflect.set;

const httpOptions = {
  headers: new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ServerApiService {
  countUserEndPoint = 'https://whispering-plains-47212.herokuapp.com/getNumOfUsers';
  detailsUserEndPoint = 'https://whispering-plains-47212.herokuapp.com/getUsersDetails';
  countGroupsEndPoint = 'https://whispering-plains-47212.herokuapp.com/getGroups';
  detailsGroupsEndPoint = 'https://whispering-plains-47212.herokuapp.com/getGroupsDetails';
  AdminIdByPhoneNumber = 'https://whispering-plains-47212.herokuapp.com/idByPhoneNumber';
  updateGroupExcelRealServerEndPoint = 'https://cors-anywhere.herokuapp.com/https://buckleapp-as-is.appspot.com/create_group.php';
  headers = new HttpHeaders();
  constructor(private http: HttpClient) {
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Access-Control-Allow-Methods', 'GET, POST');
    this.headers.append('Access-Control-Allow-Origin', '*');
  }


  getClientsInDB() {
    return this.http.get(this.countUserEndPoint, {headers: this.headers});
  }

  getDetailOfClientsInDB() {
    return this.http.get(this.detailsUserEndPoint, {headers: this.headers});
  }

  getCountOfGroupsInDB() {
    return this.http.get(this.countGroupsEndPoint, {headers: this.headers});
  }

  getDetailOfGroupsInDB() {
    return this.http.get(this.detailsGroupsEndPoint, {headers: this.headers});
  }
  adminIdByPhoneNumber(adminPhone) {

    const params = new HttpParams()
      .set('adminPhone', adminPhone)

    return this.http.get(this.AdminIdByPhoneNumber, {headers: this.headers, params: params});
  }
  uploadExcelGroupFileToServer(data) {
    const params = new HttpParams()
      .set('user_id', data.user_id)
      .set('group_id', data.group_id)
      .set('group_name', data.group_name)
      .set('member_mob', data.member_mob);

    return this.http.get(this.updateGroupExcelRealServerEndPoint, {headers: this.headers, params: params}).subscribe(
      success => console.log(success),
      error => console.log(error)
    );
  }
}
