import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LangaugeService } from './services/langauge/langauge.service';
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let languageService: LangaugeService;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        SharedModule
      ],
      providers: [
        LangaugeService,
        TranslateService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    languageService = TestBed.inject(LangaugeService);
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar', () => {
    expect(component.isSidebarOpen).toBeFalse();
    component.toggleSidebar();
    expect(component.isSidebarOpen).toBeTrue();
    component.toggleSidebar();
    expect(component.isSidebarOpen).toBeFalse();
  });

  it('should close popover on document click', () => {
    component.activePopover = 'notifications';
    component.closePopover();
    expect(component.activePopover).toBeNull();
  });

  it('should toggle popover', () => {
    const mockEvent = new Event('click');
    spyOn(mockEvent, 'stopPropagation');

    // Test opening popover
    component.togglePopover(mockEvent, 'langauge');
    expect(component.activePopover).toBe('langauge');
    expect(mockEvent.stopPropagation).toHaveBeenCalled();

    // Test closing same popover
    component.togglePopover(mockEvent, 'langauge');
    expect(component.activePopover).toBeNull();
  });

  it('should toggle popover in sidebar', () => {
    const mockEvent = new Event('click');
    spyOn(mockEvent, 'stopPropagation');

    component.togglePopoverSide(mockEvent, 'notifications');
    expect(component.activePopover).toBe('notifications');
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should switch language', () => {
    spyOn(languageService, 'setLanguage');
    component.switchLanguage('en');
    
    expect(languageService.setLanguage).toHaveBeenCalledWith('en');
    expect(component.currentLang).toBe('en');
    expect(component.isSidebarOpen).toBeFalse();
  });

  

  it('should select item and close sidebar', () => {
    component.isSidebarOpen = true;
    component.selectItem('profile');
    
    expect(component.department).toBe('profile');
    expect(component.isSidebarOpen).toBeFalse();
  });

  it('should handle language change subscription', () => {
    spyOn(console, 'log');
    const mockLangEvent: { lang: string, translations: {} } = { lang: 'ar', translations: {} };
    
    translateService.onLangChange.emit(mockLangEvent);
    
    expect(console.log).toHaveBeenCalledWith('Language changed to:', 'ar');
  });

  it('should initialize with default values', () => {
    expect(component.isSidebarOpen).toBeFalse();
    expect(component.isLanguagePopoverOpen).toBeFalse();
    expect(component.currentLang).toBe('ar');
    expect(component.activePopover).toBeNull();
    expect(component.department).toBe('myPermits');
  });

  it('should maintain active state for selected department', () => {
    component.activeDeparment('myServices');
    expect(component.department).toBe('myServices');
    
    component.activeDeparment('myTransactions');
    expect(component.department).toBe('myTransactions');
  });
});
