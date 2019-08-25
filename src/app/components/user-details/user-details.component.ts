import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ServerApiService} from '../../services/server-api.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  usersDetailsList: any;
  displayedColumns: string[] = ['id' , 'Name', 'Mobile', 'Status', 'Address' , 'Reg_Date', 'Mode' , 'Public', 'Time'];
  dataSource = new MatTableDataSource<UserDBDetail>(this.usersDetailsList);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  constructor(public afAuth: AngularFireAuth, private router: Router, public route: ActivatedRoute, public auth: AuthService,
              public serverService: ServerApiService) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.serverService.getDetailOfClientsInDB().subscribe(res => {
          this.usersDetailsList = res;
          this.dataSource = new MatTableDataSource<UserDBDetail>(this.usersDetailsList);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit() {
  }
}

interface UserDBDetail {
  'id': string;
  'user_fname': string;
  'user_lname': string;
  'user_fullname': string;
  'user_email': string;
  'country_code': string;
  'mobile_no': string;
  'user_mob': string;
  'otp': string;
  'user_img': string;
  'lat': number;
  'lng': number;
  'address': string;
  'time': string;
  'user_status': string;
  'mob_verified': string;
  'email_verified': string;
  'user_reg_date': string;
  'user_mode': string;
  'are_drives_public': number;
}
