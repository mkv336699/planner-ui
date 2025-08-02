import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import * as mockData from '../../assets/mock_data.json';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface Card {
  id: number;
  title: string;
  content: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatOptionModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatDatepickerModule,
    MatIconModule
  ]
})
export class HomeComponent {

  @ViewChild('createPlanFormTpl') createPlanFormTpl!: TemplateRef<any>;

  cards: Card[] = [];
  planGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl(''),
    dateType: new FormControl(),
    days: new FormControl(0),
    dates: new FormGroup({
      startDate: new FormControl(),
      endDate: new FormControl(),
    })
  });

  constructor(
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {
    this.cards = mockData.cards;
  }

  creatPlan() {
    this.dialog.open(this.createPlanFormTpl)
  }

  onCreatePlanSubmit() {
    console.log("planGroup", this.planGroup.value);
  }

  onCardClick(card: any) {
    this.router.navigate(["/plan/" + card.id]);
  }
} 