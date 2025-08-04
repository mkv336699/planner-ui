import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface DayCardData {
  dayNumber: number;
  alias?: string;
  content?: string;
}

@Component({
  selector: 'app-day-card',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './day-card.html',
  styleUrl: './day-card.scss'
})
export class DayCardModalComponent {
  dayCardForm: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DayCardData,
    public dialogRef: MatDialogRef<DayCardModalComponent>
  ) {
    this.dayCardForm = new FormGroup({
      alias: new FormControl(this.data.alias || ''),
      content: new FormControl(this.data.content || '')
    });
  }

  saveDayCard() {
    if (this.dayCardForm.valid) {
      const result = {
        dayNumber: this.data.dayNumber,
        alias: this.dayCardForm.get('alias')?.value,
        content: this.dayCardForm.get('content')?.value
      };
      this.dialogRef.close(result);
    }
  }
}
