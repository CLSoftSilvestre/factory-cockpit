import { Component, inject, input, signal } from '@angular/core';
import { DataService } from '../../../../shared/services/data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-webview',
  standalone: true,
  imports: [],
  templateUrl: './webview.component.html',
  styleUrl: './webview.component.css'
})
export class WebviewComponent {
  config = input("__config__");
  viewdate = input("__viewdate__");
  sanitizedUrl: SafeResourceUrl;
  
  ngOnInit() {
    const config = this.config()
    var config2 = JSON.stringify(config);
    var config3 = JSON.parse(config2);
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(config3['webview_link']);
  }
  
  constructor(private sanitizer: DomSanitizer) {
    const config = this.config()
    var config2 = JSON.stringify(config);
    var config3 = JSON.parse(config2);
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(config3['webview_link']);
  } 

}
