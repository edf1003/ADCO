import { Component, Input, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType, ScriptableScaleContext } from 'chart.js';

@Component({
  selector: 'app-scartt-chart',
  templateUrl: './scartt-chart.component.html',
  styleUrls: ['./scartt-chart.component.scss']
})
export class ScarttChartComponent implements OnInit{

  @Input() scarttChartData: number[][] = [];
  showComponent: boolean = false;

  public chartOptions: ChartOptions = {
    aspectRatio: 1,
    responsive: true,
    scales: {
      x: {
        position: 'bottom',
        pointLabels: {centerPointLabels: true},
        beginAtZero: true,
        ticks: {
          color: 'rgba(0,0,0,0.6)',
          align: 'end',
          crossAlign: 'center',
        },
        bounds: 'ticks',
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
          display: false,
          text: 'X Axis Label'
        },
      },
      y: {
        position: 'bottom',
        pointLabels: {centerPointLabels: true},
        beginAtZero: true,
        ticks: {
          color: 'rgba(0,0,0,0.6)',
          align: 'end',
          crossAlign: 'center',
        },
        bounds: 'ticks',
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
          display: false,
          text: 'Y Axis Label'
        }
      },
    },
  };

  public chartType: ChartType = 'scatter';
  public chartLabels: string[] = [];
  public chartLegend = false;
  public chartData: ChartDataset[] = [];

  constructor() {}

  ngOnInit(): void {
    this.agregarPuntos();
    const xMax = this.getX();
    const xMin = xMax * -1;
    const yMax = this.getY();
    const yMin = yMax * -1;
    if (this.chartOptions.scales){
      this.chartOptions.scales = { x: { max: xMax, min: xMin, grid:{
        color: (context) => {
          if (context.tick.value === 0){
            return 'rgba(0,0,0,1)';
          } else {
            return 'rgba(0,0,0,0.2)';
          }
        },
      }},  y: { max: yMax, min: yMin, grid:{
        color: (context) => {
          if (context.tick.value === 0){
            return 'rgba(0,0,0,1)';
          } else {
            return 'rgba(0,0,0,0.2)';
          }
        },
      }}};
    }
    this.showComponent = true;
  }

  agregarPuntos() {
    const puntos = this.scarttChartData.map(([xStr, yStr]) => {
      const x = +xStr;
      const y = +yStr;
      return {x, y};
    });
    this.chartData.push({
      data: puntos,
      label: 'Puntos',
      pointRadius: 8,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: '#73C6B6',
      pointBackgroundColor: '#73C6B6',
      pointBorderColor: '#73C6B6',
    });
  }

  getX() {
    let maxX = 1;
    for (let i = 0; i<this.scarttChartData.length ; i++){
      if (Math.abs(this.scarttChartData[i][0])>maxX){
        maxX = Math.abs(this.scarttChartData[i][0]);
      }
    }
    if (maxX < 10){
      return Math.ceil(maxX) + 0.5;
    }
    return Math.ceil(maxX / 10) * 10;
  }

  getY() {
    let maxY = 1;
    for (let i = 0; i<this.scarttChartData.length ; i++){
      if (Math.abs(this.scarttChartData[i][1])>maxY){
        maxY = Math.abs(this.scarttChartData[i][1]);
      }
    }
    if (maxY < 10){
      return Math.ceil(maxY) + 0.5;
    }
    return Math.ceil(maxY / 10) * 10;
  }
}
