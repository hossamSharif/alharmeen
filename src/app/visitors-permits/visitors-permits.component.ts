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
    const ticketContent = document.getElementById('ticket-modal-content');
    if (ticketContent) {
      const printWindow = window.open('', '', 'width=600,height=600');
      printWindow?.document.write('<html><head><title>Visitor Permit</title>');
      
      // Add print styles
      printWindow?.document.write(`
        <style>
          .ticket-container {
            padding: 20px;
            max-width: 500px;
            margin: 0 auto;
            direction: rtl;
          }
          .qr-section {
            text-align: center;
            margin: 20px 0;
          }
          .permit-details {
            margin: 15px 0;
          }
          .permit-details div {
            margin: 8px 0;
          }
          .barcode-section {
            text-align: center;
            margin: 20px 0;
          }
          @media print {
            .no-print {
              display: none;
            }
          }
        </style>
      `);
      
      printWindow?.document.write('</head><body>');
      printWindow?.document.write(ticketContent.outerHTML);
      printWindow?.document.write('</body></html>');
      printWindow?.document.close();
      printWindow?.print();
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


