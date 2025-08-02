import { Component, Inject, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface GenericDialogData {
  title?: string;
  content?: string | TemplateRef<any>;
  actions?: TemplateRef<any>;
}

@Component({
  selector: 'app-generic-dialog',
  template: `
    <h2 mat-dialog-title *ngIf="data.title">{{ data.title }}</h2>
    <mat-dialog-content>
      <ng-container *ngIf="isString(data.content); else tplContent">
        {{ data.content }}
      </ng-container>
      <ng-template #tplContent>
        <ng-container *ngIf="data.content && !isString(data.content)" [ngTemplateOutlet]="data.content"></ng-container>
      </ng-template>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <ng-container *ngIf="data.actions; else defaultActions">
        <ng-container *ngTemplateOutlet="data.actions"></ng-container>
      </ng-container>
      <ng-template #defaultActions>
        <button mat-button mat-dialog-close>Close</button>
      </ng-template>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class GenericDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: GenericDialogData,
    public dialogRef: MatDialogRef<GenericDialogComponent>
  ) {}

  isString(val: any): val is string {
    return typeof val === 'string';
  }
} 