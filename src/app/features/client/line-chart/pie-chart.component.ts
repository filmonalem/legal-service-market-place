import { CommonModule } from '@angular/common';
import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <canvas id="pieChart"></canvas>
    </div>
  `,
})
export class PieChartComponent implements AfterViewInit {
  @Input() pieChartData: number[] = []; // Data for the pie chart
  @Input() pieChartLabels: string[] = []; // Labels for the pie chart

  pieChartOptions: ChartOptions = {
    responsive: true,
  };

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    const ctx = this.el.nativeElement.querySelector('#pieChart').getContext('2d');
    
    new Chart(ctx, {
      type: 'pie', // Type of chart
      data: {
        labels: this.pieChartLabels,
        datasets: [{
          data: this.pieChartData,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // Example colors
        }],
      },
      options: this.pieChartOptions,
    });
  }
}