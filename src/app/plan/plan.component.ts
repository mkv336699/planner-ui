import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as mockData from '../../assets/mock_data.json';

@Component({
  selector: 'app-plan',
  imports: [],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss'
})
export class PlanComponent implements OnInit, OnDestroy {

  plan:  any;
  private destroy$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params) {
          console.log("params", params)
          if (params['id'] && mockData) {
            this.plan = mockData.cards.find((d: any) => d.id === params['id']);
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
