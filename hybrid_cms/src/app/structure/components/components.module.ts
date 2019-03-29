import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';
import { FormsModule }   from '@angular/forms';

import { ComponentsBadgesLabels } from './badges-labels.page';
import { ComponentsBreadcrumbs } from './breadcrumbs.page';
import { ComponentsCalendar } from './calendar.page';
import { ComponentsCarousel } from './carousel.page';
import { ComponentsCollapse } from './collapse.page';
import { ComponentsDatePicker } from './date-picker.page';
import { ComponentsLoadingProgress } from './loading-progress.page';
import { ComponentsMailTemplates } from './mail-templates.page';
import { ComponentsMediaPlayers } from './media-players.page';
import { ComponentsModal } from './modal.page';
import { ComponentsNestable } from './nestable.page';
import { ComponentsNotificationsAlerts } from './notifications-alerts.page';
import { ComponentsPagination } from './pagination.page';
import { ComponentsProgressBars } from './progress-bars.page';
import { ComponentsSlider } from './slider.page';
import { ComponentsSteps } from './steps.page';
import { ComponentsTabs } from './tabs.page';
import { ComponentsTextEditor } from './text-editor.page';
import { ComponentsTooltipsPopovers } from './tooltips-popovers.page';
import { ComponentsNgBootstrap } from './ng-bootstrap.page';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

export const routes: Routes = [
  { path: 'components/badges-labels', component: ComponentsBadgesLabels },
  { path: 'components/breadcrumbs', component: ComponentsBreadcrumbs },
  { path: 'components/calendar', component: ComponentsCalendar },
  { path: 'components/carousel', component: ComponentsCarousel },
  { path: 'components/collapse', component: ComponentsCollapse },
  { path: 'components/date-picker', component: ComponentsDatePicker },
  { path: 'components/loading-progress', component: ComponentsLoadingProgress },
  { path: 'components/mail-templates', component: ComponentsMailTemplates },
  { path: 'components/media-players', component: ComponentsMediaPlayers },
  { path: 'components/modal', component: ComponentsModal },
  { path: 'components/nestable', component: ComponentsNestable },
  { path: 'components/notifications-alerts', component: ComponentsNotificationsAlerts },
  { path: 'components/pagination', component: ComponentsPagination },
  { path: 'components/progress-bars', component: ComponentsProgressBars },
  { path: 'components/slider', component: ComponentsSlider },
  { path: 'components/steps', component: ComponentsSteps },
  { path: 'components/tabs', component: ComponentsTabs },
  { path: 'components/text-editor', component: ComponentsTextEditor },
  { path: 'components/tooltips-popovers', component: ComponentsTooltipsPopovers },
  { path: 'components/ng-bootstrap', component: ComponentsNgBootstrap }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule
  ],
  declarations: [
    ComponentsBadgesLabels,
    ComponentsBreadcrumbs,
    ComponentsCalendar,
    ComponentsCarousel,
    ComponentsCollapse,
    ComponentsDatePicker,
    ComponentsLoadingProgress,
    ComponentsMailTemplates,
    ComponentsMediaPlayers,
    ComponentsModal,
    ComponentsNestable,
    ComponentsNotificationsAlerts,
    ComponentsPagination,
    ComponentsProgressBars,
    ComponentsSlider,
    ComponentsSteps,
    ComponentsTabs,
    ComponentsTextEditor,
    ComponentsTooltipsPopovers,
    ComponentsNgBootstrap
  ]

})

export class ComponentsModule { }
