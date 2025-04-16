import { Component } from '@angular/core';

@Component({
  selector: 'app-contacts',
  imports: [],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent  {

  overlayOpen = false;

  openOverlay() {
    this.overlayOpen = true;
  }

  closeOverlay() {
    this.overlayOpen = false;
  }
}


