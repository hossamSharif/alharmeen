import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isSidebarOpen = false;
  title = 'practicAngular';
  constructor() {
  }
  
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
