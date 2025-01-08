import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  isSidebarOpen = false;
  title = 'practicAngular';
  isLanguagePopoverOpen = false;
  currentLang = 'ar';
  activePopover: string | null = null;
  department :string | null = 'myPermits'
  constructor() {
  }
  
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('document:click')
  closePopover() {
    this.activePopover = null;
  }
    
    togglePopover(event: Event, popover: string) {
      event.stopPropagation();
      this.activePopover = this.activePopover === popover ? null : popover;
      this.activeDeparment(popover)  
    }

    
    switchLanguage(lang: string) { 
      console.log(`Switching to ${lang}`); 
      this.currentLang = lang;
    }

    activeDeparment(depart: string) { 
      this.department  = depart 
    }
  
    
   
 
  

}
