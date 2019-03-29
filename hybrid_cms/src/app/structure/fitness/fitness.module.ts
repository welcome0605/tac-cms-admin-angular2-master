import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule }  from '@angular/router';
import { AuthGuard }  from './../../auth.guard';
import { SharedService } from './../../shared.service';
import { FitnessChallengeComponent } from './fitness-challenge.component';
import { AddFitnessChallengeComponent } from './add-fitness-challenge.component';
import { EditFitnessChallengeComponent } from './edit-fitness-challenge.component';
import { FitnessChallengeDayComponent } from './fitness-challenge-day.component';
import { AddFitnessChallengeDayComponent } from './add-fitness-challenge-day.component';
import { EditFitnessChallengeDayComponent } from './edit-fitness-challenge-day.component';
import { FitnessChallengeLoopComponent } from './fitness-challenge-loop.component';
import { AddFitnessChallengeLoopComponent } from './add-fitness-challenge-loop.component';
import { EditFitnessChallengeLoopComponent } from './edit-fitness-challenge-loop.component';


export const routes: Routes = [
    { path: 'fitness-challenge', component: FitnessChallengeComponent,canActivate: [AuthGuard]},
    { path: 'fitness-challenge/add', component: AddFitnessChallengeComponent,canActivate: [AuthGuard]},
    { path: 'fitness-challenge/edit/:id', component: EditFitnessChallengeComponent, canActivate: [AuthGuard] },
    { path: 'fitness-challenge-day', component: FitnessChallengeDayComponent,canActivate: [AuthGuard]}, 
    { path: 'fitness-challenge-day/add', component: AddFitnessChallengeDayComponent,canActivate: [AuthGuard]},
    { path: 'fitness-challenge-day/edit/:id', component: EditFitnessChallengeDayComponent, canActivate: [AuthGuard] },
    { path: 'fitness-challenge-loops', component: FitnessChallengeLoopComponent,canActivate: [AuthGuard]},
    { path: 'fitness-challenge-loop/add', component: AddFitnessChallengeLoopComponent,canActivate: [AuthGuard]},
    { path: 'fitness-challenge-loop/edit/:id', component: EditFitnessChallengeLoopComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
   FitnessChallengeComponent,
   AddFitnessChallengeComponent,
   EditFitnessChallengeComponent,
   FitnessChallengeDayComponent,
   AddFitnessChallengeDayComponent,
   EditFitnessChallengeDayComponent,
   FitnessChallengeLoopComponent,
   AddFitnessChallengeLoopComponent,
   EditFitnessChallengeLoopComponent
   ],
  providers:[SharedService]

})

export class FitnessModule { }
