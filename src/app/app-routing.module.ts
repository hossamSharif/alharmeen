import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Permits',
    pathMatch: 'full'
  },
  {
    path:'Permits' , 
    loadChildren:()=>import('./visitors-permits/visitors-permits.module').then(m=>m.VisitorsPermitsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
 
}
