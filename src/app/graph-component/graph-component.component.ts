import { Component, Input,SimpleChange } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { ApiService } from '../api.service';

@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.css']
})
export class GraphComponentComponent {
  title = 'ng2-charts-demo';
  @Input() queryName:any = '';
  @Input() filter:any = 'All';


  chartType = 'bar';
  unChangedValue:any=[];
  public scatterChartDatasets: ChartConfiguration<'scatter'>['data']['datasets'] = [
    {
      data: [
      ],
      label: '',
      pointRadius: 10,
    },
  ];
  public lineChartData: ChartConfiguration['data'] = {
    
    
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series A',
        fill: true,
        tension: 0.5,
      }
    ]
  };
  public lineChartOptions: any = {
    plugins:{
      title:{
        display:true,
        text:''
      }
    },
    responsive: false,
scales:{
      x:{
        display:true,
        title:{
          display:true,
          text:'Emergency Response Time vs. Fatality Rate by State'
        }
      },
      y:{
        display:true,
        title:{
          display:true,
          text:'Fatality Ratio'
        }
      }
    }
  };
  public lineChartLegend = true;
public scatterChartOptions: ChartOptions = {
    plugins:{
      title:{
        display:true,
        text:'Fatality Rate VS Response Time'
      }
    },
    responsive: false,
    scales:{
      x:{
        display:true,
        title:{
          display:true,
          text:'Response Time'
        }
      },
      y:{
        display:true,
        title:{
          display:true,
          text:'Fatality Ratio'
        }
      }
    }
  };

  constructor(private apiService:ApiService) {}

  ngOnChanges(changes: any) {
    this.changeQuery(this.queryName,this.filter)
        
    
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values
    
}

  filterCategories(category:any){
    this.lineChartData = structuredClone(this.unChangedValue)
    console.log(category)
    if(this.chartType === 'bar' && category != 'All'){
      this.lineChartData.datasets = this.lineChartData.datasets.filter((dataset:any)=>{if(category.includes(dataset.label)) {return true}else{return false}});
      this.lineChartData = structuredClone(this.lineChartData)
      console.log(this.lineChartData)
    }
  }

  changeToGraphData(dataArray:any,categoryKey:string,timeString:string,yDataString:string){
    this.lineChartData.labels = [];
    this.lineChartData.datasets = [];
    let categories:any = [];
    for(let singleData of dataArray){
      let label = singleData[timeString];
      if(!this.lineChartData.labels.includes(label)){
        this.lineChartData.labels.push(label)
      }
      let category = singleData[categoryKey];
      if(!categories.includes(category)){
        categories.push(category)
      }
    }
    for(let category of categories){
      let dataSet:any =  {
        data: [],
        label: category,
        fill: true,
        tension: 0.5
      }
      for(let label of this.lineChartData.labels){
        let yData = dataArray.find((a:any)=>a[categoryKey] === category && a[timeString] === label);
        dataSet.data.push(yData[yDataString]);
      }
      this.lineChartData.datasets.push(dataSet);
    }
    console.log(this.lineChartData)
    this.lineChartData =structuredClone(this.lineChartData)
    return structuredClone(this.lineChartData)
  }

  ngOnInit() {
    this.changeQuery('perHundredThousandPopulation','All')
  }

  changeQuery(queryName:any,filter:any){
    console.log(queryName)
    if(queryName === 'crashSeverityIndex'){
      this.chartType = 'bar';
      this.apiService.crashSeverityIndex().subscribe((data)=>{
        console.log(data);
        this.unChangedValue = this.changeToGraphData(data[0],'COMBINEDGROUP','YEAR','CRASHSEVERITYINDEX');
this.lineChartOptions.scales.y.title.text = 'CRASH SEVERITY INDEX';
        this.lineChartOptions.scales.x.title.text = 'YEAR';
        this.lineChartOptions.plugins.title.text = 'Severity Trends View'
        this.lineChartOptions = structuredClone(this.lineChartOptions)
        this.filterCategories(filter);
      })
    }else if(queryName === 'perHundredThousandPopulation'){
      this.chartType = 'bar';
      this.apiService.perHundredThousandPopulation().subscribe((data)=>{
        console.log(data);
        this.unChangedValue = this.changeToGraphData(data[0],'STATENAME','YEAR','ACCIDENTS_PER_100K');
this.lineChartOptions.scales.y.title.text = 'ACCIDENTS_PER_100K';
        this.lineChartOptions.scales.x.title.text = 'YEAR';
        this.lineChartOptions.plugins.title.text = 'Accidents per 100,000 Population Over Time'
        this.lineChartOptions = structuredClone(this.lineChartOptions)
        this.filterCategories(filter);
      })
    }else if(queryName === 'responseTime'){
      this.chartType = 'scatter';
      this.apiService.responseTime().subscribe((data)=>{
        for (let singleData of data[0]){
          this.scatterChartDatasets[0].data.push({y:singleData['FATALITYTOINJURYRATIO'],x:singleData['AVGRESPONSETIMEMINUTES']})
        }
        this.scatterChartDatasets = structuredClone(this.scatterChartDatasets);
        this.unChangedValue =  structuredClone(this.scatterChartDatasets);
        this.filterCategories(filter);
      })
    }else if(queryName === 'fatalitiesPerSeason'){
      this.chartType = 'bar';
this.lineChartOptions.scales.y.title.text = 'FATALITYRATE';
      this.lineChartOptions.scales.x.title.text = 'SEASON';
      this.lineChartOptions.plugins.title.text = 'Seasonal Fatality Rate Analysis'
      this.lineChartOptions = structuredClone(this.lineChartOptions)
      this.apiService.fatalitiesPerSeason().subscribe((data)=>{
        console.log(data);
        let spring = data[0].find((a:any)=>a['SEASON'] ==='Spring');
        let summer = data[0].find((a:any)=>a['SEASON'] ==='Summer');
        let autumn = data[0].find((a:any)=>a['SEASON'] ==='Autumn');
        let winter = data[0].find((a:any)=>a['SEASON'] ==='Winter');
        this.lineChartData = {
          labels: [
            'Spring',
            'Summer',
            'Autumn',
            'Winter'
          ],
          datasets: [
            {
              data: [ spring['FATALITYRATE'], summer['FATALITYRATE'], autumn['FATALITYRATE'],winter['FATALITYRATE'] ],
              label: 'Seasons',
              fill: true,
              tension: 0.5,
            }
          ]
        }
        this.unChangedValue = structuredClone(this.lineChartData);
        this.filterCategories(filter);
      })
    }else if(queryName === 'drugAlcoholVision'){
      this.chartType = 'bar';
this.lineChartOptions.scales.y.title.text = 'PERCENTAGE';
      this.lineChartOptions.scales.x.title.text = 'TIMEOFDAY';
      this.lineChartOptions.plugins.title.text = 'Time of Day vs. Contributing Factors Analysis'
      this.lineChartOptions = structuredClone(this.lineChartOptions)
      this.apiService.drugAlcoholVision().subscribe((data)=>{
        let morning = data[0].find((a:any)=>a['TIMEOFDAY'] ==='Morning(5am to 11:59am)');
        let afternoon = data[0].find((a:any)=>a['TIMEOFDAY'] ==='Afternoon(12pm to 4:59pm)');
        let evening = data[0].find((a:any)=>a['TIMEOFDAY'] ==='Evening(5pm to 6:59pm)');
        let night = data[0].find((a:any)=>a['TIMEOFDAY'] ==='Night(7pm to 4:59am)');
        this.lineChartData = {
          labels: [
            'Morning(5am to 11:59am)',
            'Afternoon(12pm to 4:59pm)',
            'Evening(5pm to 6:59pm)',
            'Night(7pm to 4:59am)',
          ],
          datasets: [
            {
              data: [ morning['VISIONACCIDENTS'], afternoon['VISIONACCIDENTS'],evening['VISIONACCIDENTS'],night['VISIONACCIDENTS'] ],
              label: 'VISION ACCIDENT PERCENTAGE',
              fill: true,
              tension: 0.5,
            },
            {
              data: [ morning['DRUGACCIDENTS'], afternoon['DRUGACCIDENTS'],evening['DRUGACCIDENTS'],night['DRUGACCIDENTS'] ],
              label: 'DRUG ACCIDENT PERCENTAGE',
              fill: true,
              tension: 0.5,
            },{
              data: [ morning['ALCOHOLACCIDENTS'], afternoon['ALCOHOLACCIDENTS'],evening['ALCOHOLACCIDENTS'],night['ALCOHOLACCIDENTS'] ],
              label: 'ALCOHOL ACCIDENT PERCENTAGE',
              fill: true,
              tension: 0.5,
            },{
              data: [ morning['UNKNOWNREASONACCIDENTS'], afternoon['UNKNOWNREASONACCIDENTS'],evening['UNKNOWNREASONACCIDENTS'],night['UNKNOWNREASONACCIDENTS'] ],
              label: 'UNKNOWNREASON ACCIDENT PERCENTAGE',
              fill: true,
              tension: 0.5,
            }
          ]
        };
        this.unChangedValue = structuredClone(this.lineChartData);
        this.filterCategories(filter);
      })
    }
  }

}
