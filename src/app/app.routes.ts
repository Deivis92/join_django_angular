import { Routes } from '@angular/router';
import { SummaryComponent } from './main/summary/summary.component';
import { AddtaskComponent } from './main/addtask/addtask.component';
import { BoardComponent } from './main/board/board.component';
import { ContactsComponent } from './main/contacts/contacts.component';

export const routes: Routes = [
  {
    path: 'summary',
    component: SummaryComponent,
  },
  {
    path: 'add-task',
    component: AddtaskComponent,
  },
  {
    path: 'board',
    component: BoardComponent,
  },
  {
    path: 'contacts',
    component: ContactsComponent,
  },
  {
    path: '',
    redirectTo: 'summary',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'summary',
  },
];