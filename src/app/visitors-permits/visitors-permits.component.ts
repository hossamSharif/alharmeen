import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { VisitorsPermitsService } from '../services/apiService/visitors-permits.service';
import html2canvas from 'html2canvas';
import { TranslateService } from '@ngx-translate/core';
import { LangaugeService } from '../services/langauge/langauge.service';


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

  printMode: boolean = false;
   
  constructor( private languageService:LangaugeService ,private visitorService: VisitorsPermitsService ,private translate: TranslateService) {
    this.translate.onLangChange.subscribe(event => {
      console.log('Language changed to:', event.lang);
     
    });
   }

  ngOnInit(): void { 
    this.loadPermits();
    // Subscribe to language changes
    this.translate.onLangChange.subscribe((lan:any) => {
      // Trigger any necessary updates when language changes
      console.log(lan ,'Language changed');
      this.loadPermits();
    });
    
  }

  switchLanguage(lang: string) {
    this.languageService.setLanguage(lang); 
  }
 

  loadPermits() {
    this.loading = true;
    this.visitorService.getPermits().subscribe(data => {
      this.permits = data;
      this.loading = false;
    });
  }
 
  ngAfterViewInit() {
   this.searchPermit();
  }
 
  searchPermit(){
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

  printPermitsTable() {
    const printContent = document.getElementById('permits-table');
    if (printContent) {
      const windowPrint = window.open('', '', 'width=900,height=650');
      windowPrint?.document.write('<html><head><title>تقرير التصاريح</title>');
      
      windowPrint?.document.write(`
        <style>
          body { 
            direction: rtl;
            font-family: Arial, sans-serif;
          }
          .report-header {
            text-align: center;
            margin-bottom: 30px;
          }
          .main-title {
            font-size: 24px;
            color: #333;
            margin-bottom: 10px;
          }
          .sub-title {
            font-size: 16px;
            color: #666;
          }
          table { 
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td { 
            border: 1px solid #ddd;
            padding: 12px;
            text-align: right;
          }
          th {
            background-color: #f5f5f5;
          }
          .report-footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
          .print-date {
            color: #666;
            font-size: 14px;
          }
          .actions-column{
            display: none !important;
          }
          .checkbox-column{
              display: none !important;	
          }
            
        </style>
      `);
      
      windowPrint?.document.write('</head><body>');
      
      // Add Header
      windowPrint?.document.write(`
        <div class="report-header">
          <h1 class="main-title">تقرير تصاريح الزوار</h1>
          <div class="sub-title">معارض الحرمين</div>
        </div>
      `);
      
      // Modify and add table
      const tableHTML = printContent.outerHTML;
      // const modifiedTable = tableHTML
      //   .replace(/<th class="checkbox-column".*?<\/th>/g, '')
      //   .replace(/<td class="checkbox-column".*?<\/td>/g, '')
      //   .replace(/<td class="actions-column".*?<\/td>/g, '')
      //   .replace(/<th class="actions-column".*?<\/th>/g, '');
      
      windowPrint?.document.write(tableHTML);
      
      // Add Footer
      windowPrint?.document.write(`
        <div class="report-footer">
          <div class="print-date">تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</div>
        </div>
      `);
      
      windowPrint?.document.write('</body></html>');
      windowPrint?.document.close();
      windowPrint?.print();
    }
  }
  
 

  printTicket() {
    // Set print mode first
    this.printMode = true;
    
    // Give time for Angular to update the DOM with hidden elements
    setTimeout(() => {
        const ticketElement = document.getElementById('print-ticket');
        if (ticketElement) {
            html2canvas(ticketElement).then(canvas => {
                const printWindow = window.open('', '', 'width=600,height=600');
                printWindow?.document.write(`
                    <html>
                    <head>
                        <title>تصريح زيارة</title>
                        <style>
                            body { margin: 0; display: flex; justify-content: center; }
                            img { max-width: 75%; height: 70%; }
                        </style>
                    </head>
                    <body>
                        <img src="${canvas.toDataURL('image/png')}" />
                    </body>
                    </html>
                `);
                printWindow?.document.close();
                
                printWindow?.addEventListener('load', () => {
                    printWindow?.print();
                    this.printMode = false;
                });
            });
        }
    }, 100); // Small delay to ensure DOM updates
  }


   
//   printTicket() {
//     console.log("Printing ticket...");
//     const ticketContent = document.getElementById('ticket-modal-content');
//     if (ticketContent) {
//       const printWindow = window.open('', '', 'width=600,height=600');
//       printWindow?.document.write('<html><head><title>تصريح زيارة</title>');
      
//       printWindow?.document.write(`
// <style>    
//     .modal-overlay {
//     position: fixed;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-color: rgba(0, 0, 0, 0.5);
//     display: none;
//     justify-content: center;
//     align-items: center;
//     z-index: 1000;
//     direction: rtl;
// }

// .modal-overlay.show {
//     display: flex;
// }

// .modal-content {
//     height: 100%;
//     overflow-y: auto;
//     background: white;
//     border-radius: 12px;
//     width: 90%;
//     max-width: 580px;
//     padding: 24px;
//     position: relative;
//     padding: 10px 24px 10px 24px;
//     direction: rtl;
// }

// .modal-header,
// .modal-toolbar,
// .terms-link,
// .location-info
//   {
//     display: none;   
//  }

 

//   .ticket-card {
//     display: flex;
//     flex-direction:column; 
//     border: 2px solid #d9d9d9;
//     border-radius: 8px;
//     margin: 12px 0px 12px 0px;
//   }

// .ticket-header { 
//     padding: 16px; 
//     background-image: url('./assets/images/pattern.png') ,  linear-gradient(to left, rgb(1 0 9) 0%, rgb(16 0 0) 50%, rgb(155 116 9) 146%);
//     background-position: center;
//     border-top-left-radius: 10px;
//     border-top-right-radius: 10px;
//     h2{
//         color: #FFFFFF;
//     }
//     label{
//         color: #cab6b6;
//     }
// }

 

//  //qr code  
//  .ticket-content {
//     display: flex;
//     justify-content: space-between;
//     align-items: flex-start;
//     padding-bottom: 5px;
// }

// .qr-section {
//     display: flex;
//     gap: 5px;
// }

// .qr-frame {
//     // width: 120px;
//     // height: 120px;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
  
//     .permit-number {
//       margin-top: -20px;
//       font-weight: bold;
//       font-size: 14px;
//       letter-spacing: 1px;
//       text-align: center;
//   }
// }

// .visitor-info {
//     display: flex;
//     flex-direction: column;
//     gap: 8px;
//     padding-top: 16px;
// }

// .info-label {
//     color: #666;
//     font-size: 14px;
// }

// .info-value {
//     color: #000;
//     font-size: 16px;
//     font-weight: 500;
// }

 

 


// //ticket info 
// .ticket-info {
//     margin-top: 12px;
//     width: 100%;
// }

// .info-row {
//     width: 95%;
//     padding: 0px 12px 0px 12px;
//     display: flex;
//     justify-content: space-between;
//     flex-wrap: wrap;
//     gap: 20px;
//     margin-bottom: 15px;
// }

// .input-group {
//     flex: 1;
//     display: flex;
//     flex-direction: column;
//     gap: 8px;
//     width: 25%;
// }

// .input-group label {
//     color: #090000;
//     font-size: 14px;
//     text-align: right;
    
// }

// .input-group input {
//     padding: 8px 12px;
//     border-radius: 5px;
//     border: 1px solid #ccc;
//     font-size: 14px;
//     text-align: right; 
//     color: black;
// }
 
//  .ticket-separator { 
//   margin-right: -20px; 
//   img{
//     width: 100%;
//   }
 
//  }

 
 

// // footer ticket 
// .ticket-footer {
//  padding-bottom: 12px;
// }

// .barcode-section {
//     display: flex;
//     justify-content: center; 
// }

// .barcode-section img {
//    width: 100%;
// }

// .footer-info {
//        display: flex ;
//         justify-content: space-between;
//         align-items: center;
//         padding-top: 5px;
//         margin: 0 28px 20px 10px;
//         width: 90%
// }

 

 
// .email-info {
//     text-align: center;
//     color: black;
// }

//           @media print {
//             body {
//               margin: 0;
//               padding: 0;
//             }
//             .ticket-container {
//               width: 100%;
//               max-width: 500px;
//             }
//             .no-print {
//               display: none;
//             }
//           }
//         </style>
//       `);
      
//       printWindow?.document.write('</head><body>');
      
//       printWindow?.document.write(`
//         <div class="ticket-container">
//           ${ticketContent.innerHTML}
//         </div>
//       `);
//       printWindow?.document.write('</body></html>');
//       printWindow?.document.close();
      
//       // Wait for images to load before printing
//       printWindow?.addEventListener('load', () => {
//         setTimeout(() => {
//           printWindow?.print();
//         }, 500);
//       });
//     }
//   }

  

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


