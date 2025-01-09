import { Component, HostListener } from '@angular/core';
import { LangaugeService } from './services/langauge/langauge.service';
import { TranslateService } from '@ngx-translate/core';

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
  constructor( private languageService:LangaugeService ,private translate: TranslateService) {
    this.translate.onLangChange.subscribe(event => {
      console.log('Language changed to:', event.lang);
     
    });
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

    togglePopoverSide(event: Event, popover: string) {
      event.stopPropagation();
      this.activePopover = this.activePopover === popover ? null : popover; 
    }

    switchLanguage(lang: string) {
      this.languageService.setLanguage(lang);
      this.currentLang = lang;
      this.isSidebarOpen = false;
    }
   

    activeDeparment(depart: string) { 
      this.department  = depart 
      if(this.isSidebarOpen == true){
        this.isSidebarOpen = false; 
      }
    }

    selectItem(item: string) {
      this.department = item;
      this.isSidebarOpen = false;
    }
  
    
   
 
  

}
