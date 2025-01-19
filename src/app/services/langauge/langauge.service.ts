import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class LangaugeService {

  private currentLang = new BehaviorSubject<string>('ar');

  constructor(private translate: TranslateService) {
    
  }
  ngOnInit() {
    this.setDefaultLang('ar')
  }

  setDefaultLang(defalt:string) {
    this.translate.setDefaultLang(defalt);
    this.translate.use('ar');
  }
  setLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang.next(lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  getCurrentLang() {
    return this.currentLang.asObservable();
  }

    
}
