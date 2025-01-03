import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitorsPermitsRoutingModule } from './visitors-permits-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { VisitorsPermitsComponent } from './visitors-permits.component';


const routes: Routes = [
  {
    path:'',
    component:VisitorsPermitsComponent
  }
];

@NgModule({
  declarations: [VisitorsPermitsComponent],
  imports: [
    CommonModule,
    VisitorsPermitsRoutingModule,
    RouterModule.forChild(routes)
  ]
})
export class VisitorsPermitsModule { }
