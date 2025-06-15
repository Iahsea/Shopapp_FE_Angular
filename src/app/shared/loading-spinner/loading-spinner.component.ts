import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';  // Import MatProgressSpinnerModule


@Component({
  selector: 'app-loading-spinner',
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent implements OnInit {
  loading$: Observable<boolean> | undefined;

  constructor(private loadingService: LoadingService) { }


  ngOnInit(): void {
    this.loading$ = this.loadingService.loading$;
  }


}
