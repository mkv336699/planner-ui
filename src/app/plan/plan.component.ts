import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as mockData from '../../assets/mock_data.json';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DayCardModalComponent, DayCardData } from './day-card/day-card';

@Component({
  selector: 'app-plan',
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss'
})
export class PlanComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('canvasContainer') canvasContainer!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  plan: any;
  private destroy$ = new Subject<void>();
  
  // Canvas and timeline properties
  zoomLevel = 1;
  timelineWidth = 1200;
  dayWidth = 200;
  isDragging = false;
  lastMouseX = 0;
  lastMouseY = 0;
  canvasOffsetX = 0;
  canvasOffsetY = 0;

  // Day cards data
  dayCards: { [key: number]: DayCardData } = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params) {
          console.log("params", params)
          if (params['id'] && mockData) {
            this.plan = mockData.cards.find((d: any) => d.id === parseInt(params['id']));
            this.updateTimelineWidth();
          }
        }
      });
  }

  ngAfterViewInit() {
    this.setupCanvas();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openDayCardModal(dayNumber: number) {
    const existingData = this.dayCards[dayNumber] || { dayNumber, alias: '', content: '' };
    
    const dialogRef = this.dialog.open(DayCardModalComponent, {
      data: existingData,
      width: '600px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe((result: DayCardData | undefined) => {
      if (result) {
        this.dayCards[dayNumber] = result;
        console.log('Day card saved:', result);
      }
    });
  }

  getDayCardData(dayNumber: number): DayCardData | null {
    return this.dayCards[dayNumber] || null;
  }

  setupCanvas() {
    const canvas = this.canvas.nativeElement;
    const container = this.canvasContainer.nativeElement;

    // Mouse wheel zoom
    container.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      this.zoomLevel = Math.max(0.1, Math.min(3, this.zoomLevel * delta));
      this.updateCanvasTransform();
    });

    // Mouse drag pan - listen on the canvas container
    container.addEventListener('mousedown', (e: MouseEvent) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      container.style.cursor = 'grabbing';
      e.preventDefault();
    });

    // Use document for mousemove to allow dragging outside the container
    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;
        this.canvasOffsetX += deltaX;
        this.canvasOffsetY += deltaY;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        this.updateCanvasTransform();
        e.preventDefault();
      }
    });

    // Use document for mouseup to catch mouse release anywhere
    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        container.style.cursor = 'grab';
      }
    });

    // Prevent context menu on right click
    container.addEventListener('contextmenu', (e: MouseEvent) => {
      e.preventDefault();
    });
  }

  updateCanvasTransform() {
    const canvas = this.canvas.nativeElement;
    canvas.style.transform = `translate(${this.canvasOffsetX}px, ${this.canvasOffsetY}px) scale(${this.zoomLevel})`;
  }

  updateTimelineWidth() {
    if (this.plan?.days) {
      this.timelineWidth = this.plan.days * this.dayWidth;
    }
  }

  getDaysArray(): number[] {
    if (this.plan?.days) {
      return Array.from({ length: this.plan.days }, (_, i) => i);
    }
    return Array.from({ length: 7 }, (_, i) => i); // Default 7 days
  }

  zoomIn() {
    this.zoomLevel = Math.min(3, this.zoomLevel * 1.2);
    this.updateCanvasTransform();
  }

  zoomOut() {
    this.zoomLevel = Math.max(0.1, this.zoomLevel / 1.2);
    this.updateCanvasTransform();
  }

  resetZoom() {
    this.zoomLevel = 1;
    this.canvasOffsetX = 0;
    this.canvasOffsetY = 0;
    this.updateCanvasTransform();
  }
}
