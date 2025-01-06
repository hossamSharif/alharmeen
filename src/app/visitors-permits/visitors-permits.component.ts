import { Component, OnInit } from '@angular/core';
 



  

@Component({
  selector: 'app-visitors-permits',
  templateUrl: './visitors-permits.component.html',
  styleUrls: ['./visitors-permits.component.scss']
})
export class VisitorsPermitsComponent implements OnInit {

  permits = [
    {
      permitNumber: 'P-2023-001',
      visitType: 'معارض الحرمين',
      visitorName: 'محمد بن محمد حسن    ',
      visitDate: '2023-12-15',
      visitTime: '10:00 ص',
      busCount: 1,
      status: 'مؤكد',
      visitorsCount: 45
    },
    {
      permitNumber: 'P-2023-002',
      visitType: 'معارض الحرمين',
      visitorName: 'يزن بن محمد حسن    ',
      visitDate: '2023-12-10',
      visitTime: '02:30 م',
      busCount: 1,
      status: 'منتهي',
      visitorsCount: 15
    },
    {
      permitNumber: 'P-2023-012',
      visitType:'معارض الحرمين',
      visitorName: 'الحارث بن محمد حسن    ',
      visitDate: '2023-12-20',
      visitTime: '09:00 ص',
      busCount: 3,
      status: 'ملغي',
      visitorsCount: 60
    }
  ];
  
  barcodeValue = '';
  barcodeOptions = {
    format: 'CODE128',
    width: 2,
    height: 100,
    displayValue: true,
    fontOptions: '',
    font: 'monospace',
    textAlign: 'center',
    textPosition: 'bottom',
    textMargin: 2,
    fontSize: 20,
    background: '#ffffff',
    lineColor: '#000000',
    margin: 10
  };



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

  generateBarcode(permitNumber:number) {
   
   
  }
 
 openTicketModal(ticket: any) { 
  this.selectedTicket = ticket;  
  this.generateQRCode(ticket.permitNumber);
  this.showTicketModal = true;  
  console.log(this.selectedTicket);
}

closeModal() {
  this.showTicketModal = false;
  this.selectedTicket = null;
}

 
}


