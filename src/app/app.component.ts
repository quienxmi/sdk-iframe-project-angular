import { Component, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import QxmIframeProject from '@quienxmi/sdk-iframe-project';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {

  iframeProject:any = null;
  tokenForm = new FormGroup({
    token: new FormControl('', [
      Validators.required
    ])
  });

  constructor(){
    afterNextRender(() => {
      this.loadSdk()
    });
  }

  loadSdk(): void {
    this.iframeProject = new QxmIframeProject('#iframeTestModule', {
      logs: true
    });

    this.iframeProject.subscribeError((res:any) => {
      console.log('Iframe error:', res);
      alert(res.message);
    });

    this.iframeProject.subscribeEvent((res:any) => {
      console.log('Iframe event:', res);
      if (res.data.event === 'PROJECT_CREATE') {
        alert(`Your order was successfully created! Your CODE is "${res.data.code}"`)
      }
    });
  }

  onSubmit(): void {
    const token = this.tokenForm.value.token
    if(token){
      this.iframeProject.setToken(token).then((decodedToken: any) => {
        console.log('Decoded token: ', decodedToken);
      })
    }
  }
}