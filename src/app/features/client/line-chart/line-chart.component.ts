// src/app/chart/chart.component.ts
import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `<canvas id="myChart"></canvas>`,  // Canvas element for the chart
})
export class ChartComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    // Register all necessary components of Chart.js
    Chart.register(...registerables);

    // Get the context of the canvas element
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    // Create a new Chart instance
    new Chart(ctx, {
      type: 'line',  // Specify the type of chart (line chart)
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],  // X-axis labels
        datasets: [{
          label: 'Series A',  // Legend label
          data: [65, 59, 80, 81, 56, 55, 40],  // Data for the chart
          borderColor: 'rgba(75, 192, 192, 1)',  // Line color
          borderWidth: 1  // Width of the line
        }]
      },
      options: {
        responsive: true,  // Make the chart responsive
      }
    });
  }
}
