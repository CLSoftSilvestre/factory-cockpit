import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {

  darkMode = signal<boolean>(false);

  fetchPreferences() {
    const userPreferencesAsText = localStorage.getItem('userPreferences');

    if (userPreferencesAsText) {
      const pref = JSON.parse(userPreferencesAsText) as boolean;
      this.darkMode.set(pref);
    }
  }

  savePreferences = effect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(this.darkMode()))
  })


  constructor() {
    this.fetchPreferences();
  }
}
