import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType, ScatterDataPoint, ScriptableScaleContext } from 'chart.js';

@Component({
  selector: 'app-scartt-chart',
  templateUrl: './scartt-chart.component.html',
  styleUrls: ['./scartt-chart.component.scss']
})
export class ScarttChartComponent implements OnInit, OnChanges{

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
      },
    },
  };

  public chartType: ChartType = 'scatter';
  public chartLabels: string[] = [];
  public chartLegend = false;
  public chartData: ChartDataset[] = [];

  constructor() {}

  ngOnInit(): void {
    if (!this.isClustering){
      this.agregarPuntos();
    } else
      this.separateClusters();

    const xMax = this.getX();
    const xMin = xMax * -1;
    const yMax = this.getY();
    const yMin = yMax * -1;

    if(!this.isXNegative && !this.isYNegative ){
      if (this.chartOptions.scales){
        this.chartOptions.scales = { x: { max: xMax, min: 0, grid:{
          color: (context) => {
            if (context.tick.value === 0){
              return 'rgba(0,0,0,1)';
            } else {
              return 'rgba(0,0,0,0.2)';
            }
          },
        },
        title: {
          display: true,
          text: 'X'
        }},  y: { max: yMax, min: 0, grid:{
          color: (context) => {
            if (context.tick.value === 0){
              return 'rgba(0,0,0,1)';
            } else {
              return 'rgba(0,0,0,0.2)';
            }
          },
        },title: {
          display: true,
          text: 'Y'
        }}};
      }
    } else {
      if (this.chartOptions.scales){
        this.chartOptions.scales = { x: { max: xMax, min: xMin, grid:{
          color: (context) => {
            if (context.tick.value === 0){
              return 'rgba(0,0,0,1)';
            } else {
              return 'rgba(0,0,0,0.2)';
            }
          },
        },
        title: {
          display: true,
          text: 'X'
        }},  y: { max: yMax, min: yMin, grid:{
          color: (context) => {
            if (context.tick.value === 0){
              return 'rgba(0,0,0,1)';
            } else {
              return 'rgba(0,0,0,0.2)';
            }
          },
        },title: {
          display: true,
          text: 'Y'
        }}};
      }
    }
    this.showComponent = true;
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if(simpleChanges['clusterMap']){
      this.chartData = [];
      this.separateClusters();
    }
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

  agregarPuntoClustering(color: string, point: number[]) {
    const scatterDataPoint: ScatterDataPoint = {
      x: point[0],
      y: point[1]
    };
    this.chartData.push({
      data: [scatterDataPoint],
      label: 'Puntos',
      pointRadius: 8,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: color,
      pointBackgroundColor: color,
      pointBorderColor: color,
    });
  }

  separateClusters() {
    this.showComponent = false;
    const colors: string[] = [
      "#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#00FFFF","#FFA500",
      "#800080","#008000","#000080","#8B0000","#FFC0CB","#FF69B4","#FFD700",
      "#ADFF2F","#00FF7F","#008080","#A52A2A","#696969","#D3D3D3","#FF1493",
      "#1E90FF","#20B2AA","#9370DB","#FA8072","#778899","#BDB76B","#FF7F50",
      "#6A5ACD","#F4A460"
    ];

    const colorMap: { [key: number]: string } = {
      "-2": colors[0],"0": colors[1],"1": colors[2],"2": colors[3],"3": colors[4],
      "4": colors[5],"5": colors[6],"6": colors[7],"7": colors[8],"8": colors[9],
      "9": colors[10],"10": colors[11],"11": colors[12],"12": colors[13],"13": colors[14],
      "14": colors[15],"15": colors[16],"16": colors[17],"17": colors[18],"18": colors[19],
      "19": colors[20],"20": colors[21],"21": colors[22],"22": colors[23],"23": colors[24],
      "24": colors[25],"25": colors[26],"26": colors[27],"27": colors[28],"28": colors[29],
      "29": colors[30]
    };

    for (let i = 0; i < this.scarttChartData.length; i++) {
      const cluster = this.clusterMap[i].toString();
      const color = colorMap[cluster];
      const point: [number, number] = [this.scarttChartData[i][0], this.scarttChartData[i][1]]
      this.agregarPuntoClustering(color, point);
    }
    this.showComponent = true;
  }

  getX() {
    let maxX = 1;
    for (let i = 0; i<this.scarttChartData.length ; i++){
      if (Math.abs(this.scarttChartData[i][0])>maxX){
        maxX = Math.abs(this.scarttChartData[i][0]);
      }
      if(this.scarttChartData[i][0]<0)
        this.isXNegative = true;
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
      if(this.scarttChartData[i][1]<0)
        this.isYNegative = true;
    }
    if (maxY < 10){
      return Math.ceil(maxY) + 0.5;
    }
    return Math.ceil(maxY / 10) * 10;
  }
}
