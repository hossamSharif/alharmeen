import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './component/icon/icon.component'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
 
 
@NgModule({ 
  declarations: [IconComponent],
  imports: [
    CommonModule ,
    HttpClientModule,
    TranslateModule 
  ],
  exports: [IconComponent ,TranslateModule ]
})
export class SharedModule { }
