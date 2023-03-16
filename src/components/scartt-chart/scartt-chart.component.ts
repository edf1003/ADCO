import { Component, Input, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-scartt-chart',
  templateUrl: './scartt-chart.component.html',
  styleUrls: ['./scartt-chart.component.scss']
})
export class ScarttChartComponent implements OnInit{

  @Input() scarttChartData: number[][] = [];

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
    const puntos = this.scarttChartData.map(([xStr, yStr]) => {
      const x = +xStr;
      const y = +yStr;
      this.chartLabels.push(`(${x}, ${y})`);
      return {x, y};
    });
    this.chartData.push({
      data: puntos,
      label: 'Puntos',
      pointRadius: 8,
      pointHoverRadius: 8,
      pointBackgroundColor: '#73C6B6'
    });
  }

}
