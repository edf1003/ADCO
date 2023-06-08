import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  ChartDataset,
  ChartOptions,
  ChartType,
  ScatterDataPoint,
} from 'chart.js';
import { ColorsToSend } from 'src/app/services/colors.service';

@Component({
  selector: 'app-scartt-chart',
  templateUrl: './scartt-chart.component.html',
  styleUrls: ['./scartt-chart.component.scss'],
})
export class ScarttChartComponent implements OnInit, OnChanges {
  @Input() scarttChartData: number[][] = [];
  @Input() isClustering: boolean = false;
  @Input() clusterMap: number[] = [];
  showComponent: boolean = false;
  colors: string[] = [];
  isXNegative: boolean = false;
  isYNegative: boolean = false;

  public chartOptions: ChartOptions = {
    aspectRatio: 1,
    responsive: true,
    scales: {
      x: {
        position: 'bottom',
        pointLabels: { centerPointLabels: true },
        beginAtZero: true,
        ticks: {
          color: 'rgba(0,0,0,0.6)',
          align: 'end',
          crossAlign: 'center',
        },
        bounds: 'ticks',
        grid: {
          color: (context) => {
            if (context.tick.value === 0) {
              return 'rgba(0,0,0,1)';
            } else {
              return 'rgba(0,0,0,0.2)';
            }
          },
        },
        display: true,
      },
      y: {
        position: 'bottom',
        pointLabels: { centerPointLabels: true },
        beginAtZero: true,
        ticks: {
          color: 'rgba(0,0,0,0.6)',
          align: 'end',
          crossAlign: 'center',
        },
        bounds: 'ticks',
        grid: {
          color: (context) => {
            if (context.tick.value === 0) {
              return 'rgba(0,0,0,1)';
            } else {
              return 'rgba(0,0,0,0.2)';
            }
          },
        },
        display: true,
      },
    },
  };

  public chartType: ChartType = 'scatter';
  public chartLabels: string[] = [];
  public chartLegend = false;
  public chartData: ChartDataset[] = [];

  constructor() {}

  ngOnInit(): void {
    if (!this.isClustering) {
      this.agregarPuntos();
    } else this.separateClusters();

    const xMax = this.getX();
    const xMin = xMax * -1;
    const yMax = this.getY();
    const yMin = yMax * -1;

    if (!this.isXNegative && !this.isYNegative) {
      if (this.chartOptions.scales) {
        this.chartOptions.scales = {
          x: {
            max: xMax,
            min: 0,
            grid: {
              color: (context) => {
                if (context.tick.value === 0) {
                  return 'rgba(0,0,0,1)';
                } else {
                  return 'rgba(0,0,0,0.2)';
                }
              },
            },
            title: {
              display: true,
              text: 'X',
            },
          },
          y: {
            max: yMax,
            min: 0,
            grid: {
              color: (context) => {
                if (context.tick.value === 0) {
                  return 'rgba(0,0,0,1)';
                } else {
                  return 'rgba(0,0,0,0.2)';
                }
              },
            },
            title: {
              display: true,
              text: 'Y',
            },
          },
        };
      }
    } else {
      if (this.chartOptions.scales) {
        this.chartOptions.scales = {
          x: {
            max: xMax,
            min: xMin,
            grid: {
              color: (context) => {
                if (context.tick.value === 0) {
                  return 'rgba(0,0,0,1)';
                } else {
                  return 'rgba(0,0,0,0.2)';
                }
              },
            },
            title: {
              display: true,
              text: 'X',
            },
          },
          y: {
            max: yMax,
            min: yMin,
            grid: {
              color: (context) => {
                if (context.tick.value === 0) {
                  return 'rgba(0,0,0,1)';
                } else {
                  return 'rgba(0,0,0,0.2)';
                }
              },
            },
            title: {
              display: true,
              text: 'Y',
            },
          },
        };
      }
    }
    this.showComponent = true;
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['clusterMap']) {
      this.chartData = [];
      this.separateClusters();
    }
  }

  agregarPuntos() {
    this.chartData = [];
    const puntos = this.scarttChartData.map(([xStr, yStr]) => {
      const x = +xStr;
      const y = +yStr;
      return { x, y };
    });
    this.chartData.push({
      data: puntos,
      label: 'Puntos',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: '#73C6B6',
      pointBackgroundColor: '#73C6B6',
      pointBorderColor: '#73C6B6',
    });
  }

  agregarPuntoClustering(color: string, point: number[]) {
    const scatterDataPoint: ScatterDataPoint = {
      x: point[0],
      y: point[1],
    };
    this.chartData.push({
      data: [scatterDataPoint],
      label: 'Puntos',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: color,
      pointBackgroundColor: color,
      pointBorderColor: color,
    });
  }

  separateClusters() {
    this.showComponent = false;
    this.chartData = [];

    for (let i = 0; i < this.scarttChartData.length; i++) {
      const cluster = this.clusterMap[i];
      const color = ColorsToSend.getColor(cluster);
      const point: [number, number] = [
        this.scarttChartData[i][0],
        this.scarttChartData[i][1],
      ];
      this.agregarPuntoClustering(color, point);
    }
    this.showComponent = true;
  }

  getX() {
    let maxX = 1;
    for (let i = 0; i < this.scarttChartData.length; i++) {
      if (Math.abs(this.scarttChartData[i][0]) > maxX) {
        maxX = Math.abs(this.scarttChartData[i][0]);
      }
      if (this.scarttChartData[i][0] < 0) this.isXNegative = true;
    }
    if (maxX < 10) {
      return Math.ceil(maxX) + 0.5;
    }
    return Math.ceil(maxX / 10) * 10;
  }

  getY() {
    let maxY = 1;
    for (let i = 0; i < this.scarttChartData.length; i++) {
      if (Math.abs(this.scarttChartData[i][1]) > maxY) {
        maxY = Math.abs(this.scarttChartData[i][1]);
      }
      if (this.scarttChartData[i][1] < 0) this.isYNegative = true;
    }
    if (maxY < 10) {
      return Math.ceil(maxY) + 0.5;
    }
    return Math.ceil(maxY / 10) * 10;
  }
}
