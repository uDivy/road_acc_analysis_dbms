import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public loggedInUsername: string = '';
  public queryName = 'perHundredThousandPopulation';
  public filter:any = 'All';
  public tableCountResponse: string = 'Get Rows Count';
  public selectedStates: string[] = [];
  public selectedAgeGroups: string[] = [];
  public selectedGenders: string[] = [];
  public selectedSeasons: string[] = [];
  public selectedFactors: string[] = [];
  public selectedResponseTimes: string[] = [];
  constructor(private userService: UserService, private apiService: ApiService, private router: Router) {
    // this.loggedInUsername = this.userService.getLoggedInUsername();
  }

  ngOnInit(): void {
    // Retrieve the username from localStorage
    this.loggedInUsername = this.userService.getLoggedInUsername();
  }
  public showNav = false;
  public showNavView = false; // Add this variable
  public states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  public ageGroups = ['Young <18-30>', 'Middle Age <31-50>', 'Senior Citizen <50+>'];
  public genders = ['Male', 'Female', 'Other'];
  public seasons = ['Spring', 'Summer', 'Autumn', 'Winter']; // Add Seasons values
  public factors = ['Alcohol', 'Drugs', 'Vision']; // Add Factors values
  public responseTimes = ['Fast', 'Moderate', 'Slow']; // Add Response Time values
  public filteredStates = [...this.states];
  public filteredAgeGroups = [...this.ageGroups];
  public filteredGenders = [...this.genders];
  public filteredSeasons = [...this.seasons]; // Initialize filtered Seasons with all season values
  public filteredFactors = [...this.factors]; // Initialize filtered Factors with all factor values
  public filteredResponseTime = [...this.responseTimes]; // Initialize filtered Response Time with all response time values
  public showDropdownState = false;
  public showDropdownAgeGroup = false;
  public showDropdownGender = false;
  public showDropdownSeasons = false; // Add a variable for Seasons dropdown
  public showDropdownFactors = false; // Add a variable for Factors dropdown
  public showDropdownResponseTime = false; // Add a variable for Response Time dropdown
  public searchText = '';
  public ageGroupSearchText = '';
  public genderSearchText = '';
  public seasonsSearchText = ''; // Add a variable for seasons search text
  public factorsSearchText = ''; // Add a variable for factors search text
  public responseTimeSearchText = ''; // Add a variable for response time search text

  toggleDropdown(type: string) {
    if (type === 'state') {
      this.showDropdownState = !this.showDropdownState;
      this.showDropdownAgeGroup = false;
      this.showDropdownGender = false;
      this.showDropdownSeasons = false;
      this.showDropdownFactors = false;
      this.showDropdownResponseTime = false;
      this.queryName = 'perHundredThousandPopulation';
  // Update the filter to use selectedStates array
      this.filter = this.selectedStates.length > 0 ? structuredClone(this.selectedStates) : 'All';
    } else if (type === 'ageGroup') {
      this.showDropdownAgeGroup = !this.showDropdownAgeGroup;
      this.showDropdownState = false;
      this.showDropdownGender = false;
      this.showDropdownSeasons = false;
      this.showDropdownFactors = false;
      this.showDropdownResponseTime = false;
      this.queryName = 'crashSeverityIndex';
      this.filter = 'All';
      console.log(this.filter,this.queryName)
    } else if (type === 'gender') {
      this.showDropdownGender = !this.showDropdownGender;
      this.showDropdownState = false;
      this.showDropdownAgeGroup = false;
      this.showDropdownSeasons = false;
      this.showDropdownFactors = false;
      this.showDropdownResponseTime = false;
      this.queryName = 'crashSeverityIndex';
      this.filter = 'All';
    } else if (type === 'seasons') {
      this.showDropdownSeasons = !this.showDropdownSeasons;
      this.showDropdownState = false;
      this.showDropdownAgeGroup = false;
      this.showDropdownGender = false;
      this.showDropdownFactors = false;
      this.showDropdownResponseTime = false;
      this.queryName = 'fatalitiesPerSeason';
      this.filter = 'All';
    } else if (type === 'factors') {
      this.showDropdownFactors = !this.showDropdownFactors;
      this.showDropdownState = false;
      this.showDropdownAgeGroup = false;
      this.showDropdownGender = false;
      this.showDropdownSeasons = false;
      this.showDropdownResponseTime = false;
      this.queryName = 'drugAlcoholVision';
      this.filter = 'All';
    } else if (type === 'responseTime') {
      this.showDropdownResponseTime = !this.showDropdownResponseTime;
      this.showDropdownState = false;
      this.showDropdownAgeGroup = false;
      this.showDropdownGender = false;
      this.showDropdownSeasons = false;
      this.showDropdownFactors = false;
      this.queryName = 'responseTime';
      this.filter = 'All';
    }
  }

  filterStates() {
      this.filteredStates = this.states.filter(state => state.toLowerCase().includes(this.searchText.toLowerCase()));
  }

  filterAgeGroups() { // Function to filter Age Groups
    this.filteredAgeGroups = this.ageGroups.filter(ageGroup =>
      ageGroup.toLowerCase().includes(this.ageGroupSearchText.toLowerCase())
    );
  }

  filterGenders() {
    this.filteredGenders = this.genders.filter(gender =>
      gender.toLowerCase().includes(this.genderSearchText.toLowerCase())
    );
  }

  // Filter Seasons
  filterSeasons() {
    this.filteredSeasons = this.seasons.filter(season =>
      season.toLowerCase().includes(this.seasonsSearchText.toLowerCase())
    );
  }

  // Filter Factors
  filterFactors() {
    this.filteredFactors = this.factors.filter(factor =>
      factor.toLowerCase().includes(this.factorsSearchText.toLowerCase())
    );
  }

  // Filter Response Time
  filterResponseTime() {
    this.filteredResponseTime = this.responseTimes.filter(responseTime =>
      responseTime.toLowerCase().includes(this.responseTimeSearchText.toLowerCase())
    );
  }

  toggleNav(type: string) {
    if (type === 'filter') {
      this.showNav = !this.showNav;
      this.showNavView = false; // Close the "View" button-triggered side navigation
    } else if (type === 'view') {
      // this.showNavView = !this.showNavView; // Toggle the "View" button-triggered side navigation
      // this.showNav = false; // Close the regular filters side navigation
    }
  }

  getTableCount() {
    // Assuming you have a method in ApiService to make the API call
    this.apiService.getTableCount().subscribe(
      (response) => {
        // Handle the response from the backend
        this.tableCountResponse = response[0][0].TOTAL_COUNT; // Assuming the response has a property named "count"
      },
      (error) => {
        // Handle API call errors
        console.error('Error fetching table count:', error);
        this.tableCountResponse = 'Error'; // Display an error message on the button
      }
    );
  }

  redirectToLoginPage() {
    this.router.navigate(['/']); // '/login' should be the route path to your login page
  }

  // Function to add or remove selected state
  toggleState(state: string) {
    const index = this.selectedStates.indexOf(state);
  if (index === -1) {
    // State is already selected, so remove it
    this.selectedStates.push(state);
  } else {
    // State is not selected, so add it
    this.selectedStates.splice(index,1);
  }

  // After toggling, update the graph based on the selected states
  // Call a function here to update the graph with the updated selectedStates
  }
  
  // Function to add or remove selected age group
  toggleAgeGroup(ageGroup: string) {
    if (this.selectedAgeGroups.includes(ageGroup)) {
      this.selectedAgeGroups = this.selectedAgeGroups.filter(item => item !== ageGroup);
    } else {
      this.selectedAgeGroups.push(ageGroup);
    }
  }

  filterGraphSeasons(season:any){
    this.filter = [season]
  }

  filterFactorGraph(factor:any){
    if(factor==='Alcohol'){
      this.filter = 'ALCOHOL ACCIDENT PERCENTAGE'
    }else if(factor==='Drugs'){
      this.filter = 'DRUG ACCIDENT PERCENTAGE'
    }else if(factor==='Vision'){
      this.filter = 'VISION ACCIDENT PERCENTAGE'
    }
  }

  filterAgeGroupGraph(ageGroup:string){
    if(ageGroup === 'Young <18-30>'){
      this.filter = ['Young Female','Young Male','Young Others']
    }else if(ageGroup === 'Middle Age <31-50>'){
      this.filter = ['Middle Age Female','Middle Age Male','Middle Age Others']
    }else if(ageGroup==='Senior Citizen <50+>'){
      this.filter = ['Senior Citizen Female','Senior Citizen Male','Senior Citizen Others']
    }
  }

  filterGenderGraph(ageGroup:string){
    if(ageGroup === 'Male'){
      this.filter = ['Middle Age Male','Young Male','Senior Citizen Male']
    }else if(ageGroup === 'Female'){
      this.filter = ['Middle Age Female','Young Female','Senior Citizen Female']
    }else if(ageGroup==='Other'){
      this.filter = ['Senior Citizen Others','Young Others','Middle Age Others']
    }
  }

  // Function to add or remove selected gender
  toggleGender(gender: string) {
    if (this.selectedGenders.includes(gender)) {
      this.selectedGenders = this.selectedGenders.filter(item => item !== gender);
    } else {
      this.selectedGenders.push(gender);
    }
  }

  // Function to add or remove selected season
  toggleSeason(season: string) {
    if (this.selectedSeasons.includes(season)) {
      this.selectedSeasons = this.selectedSeasons.filter(item => item !== season);
    } else {
      this.selectedSeasons.push(season);
    }
  }

  // Function to add or remove selected factor
  toggleFactor(factor: string) {
    if (this.selectedFactors.includes(factor)) {
      this.selectedFactors = this.selectedFactors.filter(item => item !== factor);
    } else {
      this.selectedFactors.push(factor);
    }
  }

  // Function to add or remove selected response time
  toggleResponseTime(responseTime: string) {
    if (this.selectedResponseTimes.includes(responseTime)) {
      this.selectedResponseTimes = this.selectedResponseTimes.filter(item => item !== responseTime);
    } else {
      this.selectedResponseTimes.push(responseTime);
    }
  
}
}
