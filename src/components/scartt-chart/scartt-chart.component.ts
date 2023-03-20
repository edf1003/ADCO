import { Component, Input, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType, ScriptableScaleContext } from 'chart.js';

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
        ticks: {
          color: 'rgba(0,0,0,0.6)',
        },
        grid: {
          color: (context) => {
            if (context.tick.value === 0){
              return 'rgba(0,0,0,1)';
            } else {
              return 'rgba(0,0,0,0.2)';
            }
          },
        },
        display: true,
        title: {
          display: true,
          text: 'X Axis Label'
        },
      },
      y: {
        ticks: {
          color: 'rgba(0,0,0,0.6)'
        },
        grid:{
          color: (context) => {
            if (context.tick.value === 0){
              return 'rgba(0,0,0,1)';
            } else {
              return 'rgba(0,0,0,0.2)';
            }
          },
        },
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
      pointHoverBackgroundColor: '#73C6B6',
      pointBackgroundColor: '#73C6B6'
    });
  }

}
