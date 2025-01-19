import { TestBed } from '@angular/core/testing';
import { LangaugeService } from './langauge.service';
import { TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

describe('LangaugeService', () => {
  let service: LangaugeService;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        LangaugeService
      ]
    });
    service = TestBed.inject(LangaugeService);
    translateService = TestBed.inject(TranslateService);
  });  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set language to Arabic by default', () => {
    spyOn(translateService, 'setDefaultLang');
    spyOn(translateService, 'use');
    service.ngOnInit();
    service.setDefaultLang('ar'); 

    expect(translateService.setDefaultLang).toHaveBeenCalledWith('ar');
    expect(translateService.use).toHaveBeenCalledWith('ar');
  });

  it('should change language direction for Arabic', () => {
    service.setLanguage('ar');
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('should change language direction for English', () => {
    service.setLanguage('en');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('should set new language and update translations', () => {
    spyOn(translateService, 'use');
    
    service.setLanguage('en');
    
    expect(translateService.use).toHaveBeenCalledWith('en');
  });

  it('should maintain current language after multiple changes', () => {
    service.setLanguage('en');
    service.setLanguage('ar');
    service.setLanguage('en');
    
    expect(document.documentElement.dir).toBe('ltr');
  });
});
