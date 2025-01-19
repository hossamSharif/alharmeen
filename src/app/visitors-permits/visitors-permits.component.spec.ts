import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VisitorsPermitsComponent } from './visitors-permits.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LangaugeService } from '../services/langauge/langauge.service';
import { VisitorsPermitsService } from '../services/apiService/visitors-permits.service';
import { SharedModule } from '../shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { PERMITS_DATA } from './mock-permits';
import { QRCodeModule } from 'angularx-qrcode';

describe('VisitorsPermitsComponent', () => {
  let component: VisitorsPermitsComponent;
  let fixture: ComponentFixture<VisitorsPermitsComponent>;
  let visitorService: VisitorsPermitsService;
  let languageService: LangaugeService;
  let translateService: TranslateService;

  const mockPermits = PERMITS_DATA;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisitorsPermitsComponent],
      imports: [
        TranslateModule.forRoot(),
        SharedModule,
        HttpClientTestingModule,
        QRCodeModule
      ],
      providers: [
        VisitorsPermitsService,
        LangaugeService,
        TranslateService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VisitorsPermitsComponent);
    component = fixture.componentInstance;
    visitorService = TestBed.inject(VisitorsPermitsService);
    languageService = TestBed.inject(LangaugeService);
    translateService = TestBed.inject(TranslateService);
      fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load permits on init', fakeAsync(() => {
    spyOn(visitorService, 'getPermits').and.returnValue(of(mockPermits));
    component.ngOnInit();
    tick();
    expect(component.permits).toEqual(mockPermits);
    expect(component.loading).toBeFalse();
  }));

  it('should switch language', () => {
    spyOn(languageService, 'setLanguage');
    component.switchLanguage('ar');
    expect(languageService.setLanguage).toHaveBeenCalledWith('ar');
  });

  it('should sort permits by date', () => {
    component.permits = [...mockPermits];
    component.sortByDate();
    expect(component.isSorted).toBeTrue();
    
    const firstDate = new Date(component.permits[0].visitDate);
    const lastDate = new Date(component.permits[component.permits.length - 1].visitDate);
    expect(firstDate.getTime()).toBeLessThanOrEqual(lastDate.getTime());
  });

  it('should get correct status class', () => {
    expect(component.getStatusClass('مؤكد')).toBe('status-success');
    expect(component.getStatusClass('ملغي')).toBe('status-rejected');
    expect(component.getStatusClass('منتهي')).toBe('status-ended');
  });

  it('should open ticket modal with correct permit', () => {
    const testPermit = mockPermits[0];
    spyOn(component, 'generateBarcode');
    spyOn(component, 'generateQRCode');
    
    component.openTicketModal(testPermit);
    
    expect(component.selectedTicket).toEqual(testPermit);
    expect(component.showTicketModal).toBeTrue();
    expect(component.generateBarcode).toHaveBeenCalledWith(testPermit.permitNumber);
    expect(component.generateQRCode).toHaveBeenCalledWith(testPermit.permitNumber);
  });

  it('should close modal', () => {
    component.showTicketModal = true;
    component.selectedTicket = mockPermits[0];
    
    component.closeModal();
    
    expect(component.showTicketModal).toBeFalse();
    expect(component.selectedTicket).toBeNull();
  });

  it('should generate QR code data', () => {
    const permitNumber = '28374928';
    component.generateQRCode(permitNumber);
    expect(component.qrCodeData).toBe(permitNumber);
  });

  it('should search permits when user types in search input', fakeAsync(() => {
    // Create mock search input element
    const mockElementRef = {
      nativeElement: document.createElement('input')
    };
    component.searchInput = mockElementRef;
  
    // Mock the search service response
    const searchResults = [mockPermits[0]];
    spyOn(visitorService, 'searchPermits').and.returnValue(of(searchResults));
  
    // Initialize the search functionality
    component.ngAfterViewInit();
  
    // Simulate user typing
    mockElementRef.nativeElement.value = '28374928';
    mockElementRef.nativeElement.dispatchEvent(new Event('keyup'));
  
    // Account for debounceTime
    tick(400);
  
    // Verify results
    expect(visitorService.searchPermits).toHaveBeenCalledWith('28374928');
    expect(component.permits).toEqual(searchResults);
    expect(component.loading).toBeFalse();
  }));

  it('should handle print mode for ticket', fakeAsync(() => {
    spyOn(window, 'open').and.returnValue(window);
    component.printTicket();
    tick(100);
    expect(component.printMode).toBeTrue();
  }));
});
