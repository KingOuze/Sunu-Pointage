import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importez RouterModule ici
import { FormsModule } from '@angular/forms'; // Importer FormsModule
import { FilterPipe } from '../pipes/filter.pipes';

@Component({
  selector: 'app-attendance-list',
  standalone:true,
  imports:[CommonModule,SidebarComponent,FormsModule,FilterPipe],
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent {
  searchQuery: string = '';
  selectedDate: string = '';

  attendanceRecords = [
    {
      id: 2341421,
      employee: 'Ahmed Rashdan',
      role: 'Help Desk Executive',
      department: 'IT Department',
      date: '29 July 2023',
      status: 'Présent',
      arrivalTime: '10h 2m'
    },
    {
      id: 3411421,
      employee: 'Ali Alhamdan',
      role: 'Senior Executive',
      department: 'Marketing',
      date: '29 July 2023',
      status: 'Absent',
      arrivalTime: '0 m'
    },
    {
      id: 2341121,
      employee: 'Mona Alghafar',
      role: 'Senior Manager',
      department: 'Design',
      date: '29 July 2023',
      status: 'En retard',
      arrivalTime: '8h 30m'
    },
    {
      id: 2341421,
      employee: 'Moustafa Adel',
      role: 'Director',
      department: 'Development',
      date: '29 July 2023',
      status: 'Télétravail',
      arrivalTime: '10h 5m'
    },
    // Ajoutez plus de données ici...
  ];
}
