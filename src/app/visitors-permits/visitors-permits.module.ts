import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VisitorsPermitsComponent } from './visitors-permits.component';
import { VisitorsPermitsService } from './visitors-permits.service'; 
import { SharedModule } from '../shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';
import { VisitorsPermitsRoutingModule } from './visitors-permits-routing.module';
import { RouterModule, Routes } from '@angular/router';


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
    SharedModule,
    QRCodeModule,
    HttpClientModule, 
    VisitorsPermitsRoutingModule,
    RouterModule.forChild(routes)
  ],
  providers: [VisitorsPermitsService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VisitorsPermitsModule { }
