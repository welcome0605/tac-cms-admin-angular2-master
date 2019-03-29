import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppsModule } from './apps/apps.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EmailTemplateModule } from './email-template/email-template.module';
import { CmsUserManagementModule } from './cms-user/cms-user-management.module';
import { MenuModule } from './menu/menu.module';
import { FitnessModule } from './fitness/fitness.module';
import { VersionManagementModule } from './version/version-management.module';
import { StripPackagesModule } from './strip-packages/strip-packages.module';
import { AdminSettingModule } from './admin-settings/admin-setting.module';
import { SuperAdminSettingModule } from './super-admin-settings/super-admin-setting.module';
import { ContactModule } from './contact/contact.module';
import { TransactionListModule } from './transaction-list/transaction-list.module';
import { ShowHideModuleModule } from './show-hide-container/show-hide-module.module';
import { GoogleAnalyticsModule } from './google-analytics/google-analytics.module'
import { RewardsModule } from './rewards/rewards.module';
import { PushNotificationModule } from './push-notification/push-notification.module';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    CommonModule,
    AppsModule,
    UsersModule,
    EmailTemplateModule,
    CmsUserManagementModule,
    MenuModule,
    FitnessModule,
    DashboardModule,
    VersionManagementModule,
    StripPackagesModule,
    AdminSettingModule,
    SuperAdminSettingModule,
    ContactModule,
    TransactionListModule,
    ShowHideModuleModule,
    PushNotificationModule,
    GoogleAnalyticsModule,
    RewardsModule,
    ColorPickerModule,
  ]
})
export class StructureModule { }
