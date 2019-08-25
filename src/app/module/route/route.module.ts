import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from '../../components/login/login.component';
import {AdminPageComponent} from '../../components/admin-page/admin-page.component';
import {UserDetailsComponent} from '../../components/user-details/user-details.component';
import {GroupsDetailsComponent} from '../../components/groups-details/groups-details.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent, pathMatch: 'full'},
  {path: 'adminPage', component: AdminPageComponent, pathMatch: 'full'},
  {path: 'userDetails', component: UserDetailsComponent, pathMatch: 'full'},
  {path: 'groupDetails', component: GroupsDetailsComponent, pathMatch: 'full'},

  {path: '', redirectTo: '/login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RouteModule {}


