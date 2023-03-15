import { Component, Input, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-scartt-chart',
  templateUrl: './scartt-chart.component.html',
  styleUrls: ['./scartt-chart.component.css']
})
export class ScarttChartComponent implements OnInit{

  @Input() scarttChartData: string[][] = [];

  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'X Axis Label'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Y Axis Label'
        }
      }
    }
  };

  public chartType: ChartType = 'scatter';
  public chartLabels: string[] = [];
  public chartLegend = false;

  public chartData: ChartDataset[] = [];

  constructor() {}

  ngOnInit(): void {
      this.agregarPuntos();
  }

  agregarPuntos() {
    const puntos = [];
    for (let i = 0; i < this.scarttChartData.length; i++) {
      const x = parseInt(this.scarttChartData[i][0]);
      const y = parseInt(this.scarttChartData[i][1]);
      puntos.push({ x: x, y: y });
      this.chartLabels.push(`(${x}, ${y})`);
    }
    this.chartData.push({
      data: puntos,
      label: 'Puntos',
      pointRadius: 8,
      pointHoverRadius: 8,
    });
  }

}
