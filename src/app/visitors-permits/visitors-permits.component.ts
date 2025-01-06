import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { VisitorsPermitsService } from './visitors-permits.service';



@Component({
  selector: 'app-visitors-permits',
  templateUrl: './visitors-permits.component.html',
  styleUrls: ['./visitors-permits.component.scss']
})
export class VisitorsPermitsComponent implements OnInit { 
  @ViewChild('barcode') barcodeElement!: ElementRef; 
  @ViewChild('searchInput', { read: ElementRef }) searchInput!: ElementRef;
  permits: any[] = [];
  loading = false; 
   

  //qr
  qrCodeData: string = '';
  qrCodeWidth: number = 135; 
  selectedTicket : any;
  showTicketModal :boolean=false;
  

  //sort and filter
  isSorted: boolean = false;
   
  constructor(private visitorService: VisitorsPermitsService) {
     
   }

  ngOnInit(): void { 
    this.loadPermits();
  }


  loadPermits() {
    this.loading = true;
    this.visitorService.getPermits().subscribe(data => {
      this.permits = data;
      this.loading = false;
    });
  }
 
  ngAfterViewInit() {
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      map((event: any) => event.target.value),
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => this.loading = true),
      switchMap(term => this.visitorService.searchPermits(term))
    ).subscribe(results => {
      this.permits = results;
      this.loading = false;
    });
  }
 
  sortByDate() {
    if (!this.isSorted) {
      // Sort ascending
      this.permits.sort((a, b) => {
        const dateA = new Date(a.visitDate);
        const dateB = new Date(b.visitDate);
        return dateA.getTime() - dateB.getTime();
      });
      this.isSorted = true;
    } else {
      // Reverse the order
      this.permits.reverse();
      this.isSorted = false;
    }
  }
 

  getStatusClass(status: string): string {
    switch(status.toLowerCase()) {
        case 'مؤكد':
            return 'status-success';
        case 'ملغي':
            return 'status-rejected';
        case 'منتهي':
            return 'status-ended';
        default:
            return '';
    }
  }

  generateQRCode(permitNumber: string) {
      this.qrCodeData = permitNumber;
    }

  generateBarcode(permit: string) {
    const JsBarcode = require('jsbarcode');
    JsBarcode(this.barcodeElement.nativeElement, permit, {
    format: 'CODE39',
    displayValue: false, // Hide the text below the barcode
    width: 4, // Controls the width of each bar
    height: 60, // Optional: you can also control height
    margin: 10, // Optional: adds margin around the barcode
    fontSize: 14 // Optional: controls the size of text below barcode
    });
  }
 
 openTicketModal(ticket: any) { 
  this.selectedTicket = ticket; 
  this.generateBarcode(ticket.permitNumber); 
  this.generateQRCode(ticket.permitNumber);
  this.showTicketModal = true;  
  console.log(this.selectedTicket);
}

closeModal() {
  this.showTicketModal = false;
  this.selectedTicket = null;
}

 
}


