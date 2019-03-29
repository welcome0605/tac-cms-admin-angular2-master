import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StaffComponent } from './staff/staff.component';
import { MemberComponent } from './member/member.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'staff',
        pathMatch: 'full'
    },
    {
        path: 'staff',
        component: StaffComponent
    },
    {
        path: 'member',
        component: MemberComponent
    },
    {
        path: 'setting',
        component: MemberComponent
    },
    {
        path: '**',
        redirectTo: 'staff',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class RewardsRoutingModule {}