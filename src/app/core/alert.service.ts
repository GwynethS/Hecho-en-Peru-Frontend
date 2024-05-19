import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private notification$ = new Subject<SweetAlertOptions>();

  constructor(){
    this.notification$.subscribe({
      next: (options) => {
        Swal.fire(options);
      }
    });
  }
  
  showSuccess(title: string, message: string): void{
    this.notification$.next({
      icon: 'success',
      title,
      text: message
    });
  }
  
  showError(title: string, message?: string): void{
    this.notification$.next({
      icon: 'error',
      title,
      text: message,
      confirmButtonColor: '#FD6759',
    });
  }

  showConfirmDeleteAction(feature: string){
    return Swal.fire({
      title: `¿Estás seguro de que deseas eliminar ${feature}?`,
      text: 'No podrás revertir esta acción',
      icon: "warning",
      iconColor: "#EC9892",
      showCancelButton: true,
      cancelButtonColor: "#242423",
      confirmButtonColor: "#FD6759",
      confirmButtonText: 'Confirmar',
      cancelButtonText: "Cancelar",
      customClass: {
        cancelButton: "alter-btn-cancel",
      },
    });
  }
}