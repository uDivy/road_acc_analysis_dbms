import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service'; // Import the ApiService
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public username = '';
  public password = '';
  loginError = false; // Initialize as false
  loginErrorMessage = 'Login error';


  constructor(private router: Router, private apiService: ApiService, private userService: UserService) {}

  login() {
    // Send a GET request to the /login endpoint with the username and password
    const userData = { username: this.username, password: this.password};

    // Assuming you have a login method in ApiService
    this.apiService.login({ username: this.username, password: this.password }).subscribe(
      (response) => {
        // Handle the response from the backend
        console.log('Login Successful:', response);
        // Store the username
        // Store the username in the UserService
        this.userService.setLoggedInUsername(this.username);
        this.router.navigate(['home']);
      },
      (error) => {
        // Handle login failure or errors from the backend
        console.error('Login Failed:', error);
        // You can display an error message to the user if needed
        this.loginError = true;
        this.loginErrorMessage = 'Login failed. Please check your credentials.';
      }
    );
  }

  signup() {
    // Send a POST request to the /signup endpoint with the username and password
    const userData = { username: this.username, password: this.password };

    // Assuming you have a signup method in ApiService
    this.apiService.signup(userData).subscribe(
      (response) => {
        // Handle the response from the backend
        console.log('Signup Successful:', response);
        // Optionally, you can automatically log in the user after signup
        // this.login();
      },
      (error) => {
        // Handle signup failure or errors from the backend
        console.error('Signup Failed:', error);
        // You can display an error message to the user if needed
      }
    );
  }
}