import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';





  

@Component({
  selector: 'app-visitors-permits',
  templateUrl: './visitors-permits.component.html',
  styleUrls: ['./visitors-permits.component.scss']
})
export class VisitorsPermitsComponent implements OnInit {
  
  @ViewChild('barcode') barcodeElement!: ElementRef;
  
  
  permits = [
    {
      permitNumber: '28374928',
      visitType: 'معارض الحرمين',
      visitorName: 'محمد بن محمد حسن    ',
      visitDate: '2023-12-15',
      visitTime: '10:00 ص',
      busCount: 1,
      status: 'مؤكد',
      visitorsCount: 45
    },
    {
      permitNumber: '667679839',
      visitType: 'معارض الحرمين',
      visitorName: 'يزن بن محمد حسن    ',
      visitDate: '2023-12-10',
      visitTime: '02:30 م',
      busCount: 1,
      status: 'منتهي',
      visitorsCount: 15
    },
    {
      permitNumber: '999488387',
      visitType:'معارض الحرمين',
      visitorName: 'الحارث بن محمد حسن    ',
      visitDate: '2023-12-20',
      visitTime: '09:00 ص',
      busCount: 3,
      status: 'ملغي',
      visitorsCount: 60
    }
  ];
  
  qrCodeData: string = '';
  qrCodeWidth: number = 135;

  selectedTicket : any;
  showTicketModal :boolean=false;
  isMainChecked: boolean = false;
  isPartiallyChecked: boolean = false;
  constructor() { }

  ngOnInit(): void {
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


