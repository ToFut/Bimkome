import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ServerApiService} from '../../services/server-api.service';
import {read, utils} from 'ts-xlsx';
import {async} from 'rxjs/internal/scheduler/async';


interface UserSignInDetail {
  avatarIcon: string;
  name: string;
  phone: string;
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

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  admin: UserSignInDetail = {} as UserSignInDetail;
  numOfClients = 0;
  numOfGroups = 0;
  arrayBuffer: any;
  file: any;
  dataFromExcel = [];
  dataFromExcelAfterTransfer = [];
  groupName: string;
  adminPhone: string;
  dataToserver = {};
  usersDetailsList: UserDBDetail = {} as UserDBDetail;

  constructor(public afAuth: AngularFireAuth, private router: Router, public route: ActivatedRoute, public auth: AuthService,
              public serverService: ServerApiService) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.admin.avatarIcon = user.photoURL;
        this.admin.name = user.displayName;

        this.serverService.getClientsInDB().subscribe(res => {
          this.numOfClients = res[0]['COUNT(*)'];
        });
        this.serverService.getCountOfGroupsInDB().subscribe(res => {
          this.numOfGroups = res[0]['COUNT(*)'];
        });

      }
    });
  }

  ngOnInit() {
  }

  incomingfile(event) {
    this.file = event.target.files[0];
    this.Upload();
  }

  Upload() {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = read(bstr, {type: 'binary'});
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      this.dataFromExcel = utils.sheet_to_json(worksheet, {raw: true
      });
      this.buildStringForEachRow();
      // this.serverService.uploadExcelGroupFileToServer();

    };
    fileReader.readAsArrayBuffer(this.file);
  }

  buildStringForEachRow() {
    this.dataFromExcel.forEach(ele => {
      const buildString = ele.MemberName + '_' + '+' + ele.AdminPhoneAreacode  + ele.MemberPhoneNumber;
      this.groupName = ele.GroupName;
      this.adminPhone = ele.AdminPhoneNumber;
      this.dataFromExcelAfterTransfer.push(buildString);
    });

    this.getIdByPhoneNum();
  }
  getIdByPhoneNum() {
    this.serverService.adminIdByPhoneNumber(this.adminPhone).subscribe(
      success => {
        const adminId = success[0].id;
        this.buildReqForServer(adminId);
      },
      error => console.log(error)
    );
  }

  buildReqForServer(adminId) {
    this.dataToserver = {
      'user_id': adminId,
      'group_id': this.groupName,
      'group_name': this.groupName,
      'member_mob': this.dataFromExcelAfterTransfer.toString(),
    };
    this.serverService.uploadExcelGroupFileToServer(this.dataToserver);
    this.dataToserver = {};
    this.dataFromExcelAfterTransfer = [];
    }
}
