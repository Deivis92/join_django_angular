
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../services/config-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit {
  contacts: any[] = [];
  groupedContacts: { letter: string, contacts: any[] }[] = [];
  selectedContact: any = null;
  selectedInitials: string = '';
  overlayOpen = false;
  showNameError = false;
  editOverlayOpen = false;


  newContact = {
    name: '',
    email: '',
    phone_number: ''
  };

  constructor(private configService: ConfigService) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.configService.getContacts().subscribe({
      next: (data) => this.prepareGroupedContacts(data),
      error: (err) => console.error('Fehler beim Laden der Kontakte', err),
    });
  }

  submitContact(): void {
    const parts = this.newContact.name.trim().split(' ');
    if (parts.length < 2) {
      this.showNameError = true;
      return;
    }

    this.showNameError = false;

    this.configService.createContact(this.newContact).subscribe({
      next: (response) => {
        console.log('Kontakt erfolgreich erstellt:', response);
        this.closeOverlay();
        this.loadContacts(); // aktualisiere Liste
        this.resetForm();
      },
      error: (error) => {
        console.error('Fehler beim Erstellen des Kontakts:', error);
      }
    });
  }

  resetForm(): void {
    this.newContact = {
      name: '',
      email: '',
      phone_number: ''
    };
  }

  renderContactDetailCard(contactId: number, initials: string): void {
    const contact = this.groupedContacts
      .flatMap(group => group.contacts)
      .find(c => c.id === contactId);

    if (contact) {
      this.selectedContact = contact;
      this.selectedInitials = initials;
    }
  }


  closeContactDetailCardWithoutSlideIn(): void {
    this.selectedContact = null;
  }

  deleteContact(id: number): void {
    if (confirm('Möchtest du diesen Kontakt wirklich löschen?')) {
      this.configService.deleteContact(id).subscribe({
        next: () => {
          console.log(`Kontakt mit ID ${id} wurde gelöscht`);
          this.loadContacts();
          this.selectedContact = null;
        },
        error: (err) => {
          console.error('Fehler beim Löschen des Kontakts:', err);
        }
      });
    }
  }


  private prepareGroupedContacts(data: any[]): void {
    const contactsWithColors = this.assignRandomColors(data);
    const sortedContacts = this.sortContactsByName(contactsWithColors);
    this.groupedContacts = this.groupContactsByFirstLetter(sortedContacts);
  }

  private assignRandomColors(contacts: any[]): any[] {
    return contacts.map(contact => ({
      ...contact,
      color: this.getRandomColor()
    }));
  }

  private sortContactsByName(contacts: any[]): any[] {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
  }

  private groupContactsByFirstLetter(contacts: any[]): { letter: string, contacts: any[] }[] {
    const grouped = new Map<string, any[]>();

    contacts.forEach(contact => {
      const letter = contact.name[0].toUpperCase();
      if (!grouped.has(letter)) {
        grouped.set(letter, []);
      }
      grouped.get(letter)?.push(contact);
    });

    return Array.from(grouped.entries()).map(([letter, contacts]) => ({
      letter,
      contacts
    }));
  }

  renderEditOverlay(id: number, initials: string): void {
    const contact = this.groupedContacts
      .flatMap(group => group.contacts)
      .find(c => c.id === id);

    if (contact) {
      this.selectedContact = contact;
      this.selectedInitials = initials;
      this.editOverlayOpen = true;
    }
  }

  closeEditOverlay(): void {
    this.editOverlayOpen = false;
  }

  updateContact(): void {
    this.configService.updateContact(this.selectedContact).subscribe({
      next: () => {
        this.editOverlayOpen = false;
        this.loadContacts(); // Liste neu laden
      },
      error: err => console.error('Fehler beim Aktualisieren:', err)
    });
  }




  getInitials(name: string): string {
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] ?? '';
    const last = parts[1]?.[0] ?? '';
    return (first + last).toUpperCase();
  }

  openOverlay() {
    this.overlayOpen = true;
  }

  closeOverlay() {
    this.overlayOpen = false;
  }

  getRandomColor(): string {
    const colors = [
      '#FFB6C1', '#FFA07A', '#FFD700', '#90EE90', '#00CED1',
      '#87CEFA', '#9370DB', '#FF69B4', '#A52A2A', '#00FA9A'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }


  setContactActive(event: Event): void {
    const elements = document.querySelectorAll('.contact-card');
    elements.forEach(el => el.classList.remove('active'));
    (event.currentTarget as HTMLElement).classList.add('active');
  }
}
