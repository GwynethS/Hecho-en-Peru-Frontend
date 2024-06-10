import { Injectable } from '@angular/core';
import Toastify from 'toastify-js';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  showToast(text: string){
    return Toastify({
      text,
      duration: 3000,
      close: true,
      offset: {
        x: 10, 
        y: '6rem'
      },
      stopOnFocus: true, 
      style: {
        background: "#E9806E",
      }
    }).showToast();
  }
}
