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
  selector: 'app-day-card-modal',
  template: `
    <div class="day-card-modal">
      <div class="modal-header">
        <h2 mat-dialog-title>
          <mat-icon class="header-icon">calendar_today</mat-icon>
          Day {{ data.dayNumber }}
        </h2>
        <button mat-icon-button mat-dialog-close aria-label="Close">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <form [formGroup]="dayCardForm" class="day-card-form">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Day Alias</mat-label>
            <input matInput formControlName="alias" placeholder="e.g., Arrival Day, Beach Day">
            <mat-hint>Give this day a memorable name</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Day Description</mat-label>
            <textarea matInput formControlName="content" rows="4" 
                      placeholder="Describe your plans for this day..."></textarea>
            <mat-hint>Add your detailed plans here</mat-hint>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-flat-button color="primary" (click)="saveDayCard()" 
                [disabled]="!dayCardForm.valid">
          <mat-icon>save</mat-icon>
          Save
        </button>
      </mat-dialog-actions>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  styles: [`
    .day-card-modal {
      min-width: 500px;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .header-icon {
      margin-right: 8px;
      color: #007bff;
    }
    
    .day-card-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .w-100 {
      width: 100%;
    }
    
    mat-dialog-actions {
      padding: 16px 0 0 0;
      margin: 0;
    }
    
    @media (max-width: 600px) {
      .day-card-modal {
        min-width: 90vw;
      }
    }
  `]
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