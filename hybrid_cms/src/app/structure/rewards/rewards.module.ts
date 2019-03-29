import { NgModule }      from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }  from '@angular/common';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthGuard } from './../../auth.guard';

// import { RewardsRoutingModule } from './rewards.routing.module';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatCheckboxModule,MatFormFieldModule, MatSelectModule, MatInputModule } from '@angular/material';

import { SortableModule } from '../../shared/sortable.module';

import { StaffComponent } from './staff/staff.component';
import { AddStaffComponent } from './staff/add-staff.component';
import { EditStaffComponent } from './staff/edit-staff.component';

import { MemberComponent } from './member/member.component';
import { AddMemberComponent } from './member/add-member.component';
import { EditMemberComponent } from './member/edit-member.component';

import { BonusComponent } from './bonus/bonus.component';
import { AddBonusComponent } from './bonus/add-bonus.component';
import { EditBonusComponent } from './bonus/edit-bonus.component';

import { RewardSettingComponent } from './setting/setting.component';

import { RewardsComponent } from './rewards.component';
import { RedemptionComponent } from './redemption/redemption.component';

import { CheckinComponent } from './checkin/checkin.component';
import { EditCheckinComponent } from './checkin/edit-checkin.component';

import { ModifiedTransactionComponent } from './modified-transaction/modified-transaction.component';

import { FilterByPipe } from './../../filterby.pipe';

export const routes: Routes = [
  { path: 'rewards', component: RewardsComponent,
   canActivate: [AuthGuard],
   children: [
     {
       path: 'staff', component: StaffComponent
     },
     {
       path: 'staff/add', component: AddStaffComponent
     },
     {
       path: 'staff/edit/:id', component: EditStaffComponent
     },
     {
       path: 'member', component: MemberComponent
     },
     {
       path: 'member/add', component: AddMemberComponent
     },
     {
       path: 'member/edit/:id', component: EditMemberComponent
     },
     {
       path: 'index', component: BonusComponent, pathMatch: 'full'
     },
     {
       path: 'index/add', component: AddBonusComponent
     },
     {
       path: 'index/edit/:id', component: EditBonusComponent
     },
     {
       path: 'redemption', component: RedemptionComponent
     },
     {
       path: 'checkin', component: CheckinComponent
     },
     {
       path: 'checkin/edit/:id', component: EditCheckinComponent
     },
     {
       path: 'modified-transaction', component: ModifiedTransactionComponent
     }
     ,
     {
       path: 'setting', component: RewardSettingComponent
     }
    ]  
  }
];

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    SortableModule,
    MatTabsModule,
    ColorPickerModule,
    NgbModule,
    // RewardsRoutingModule    
    RouterModule.forChild(routes)
  ],
  exports: [
    MatTabsModule
  ],
  declarations: [
    RewardsComponent,
    StaffComponent,
    AddStaffComponent,
    EditStaffComponent,
    MemberComponent,
    AddMemberComponent,
    EditMemberComponent,
    BonusComponent,
    AddBonusComponent,
    EditBonusComponent,
    RewardSettingComponent,
    RedemptionComponent,
    CheckinComponent,
    EditCheckinComponent,
    ModifiedTransactionComponent,
    FilterByPipe
  ]
})
export class RewardsModule { }
