import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'loggedInUsername';

  getLoggedInUsername(): string {
    return localStorage.getItem(this.STORAGE_KEY) || '';
  }

  setLoggedInUsername(username: string): void {
    localStorage.setItem(this.STORAGE_KEY, username);
  }

  clearLoggedInUsername(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}