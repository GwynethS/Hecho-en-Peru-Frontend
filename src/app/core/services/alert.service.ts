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
      text: message,
      confirmButtonColor: '#383838',
      confirmButtonText: 'Cerrar',
    });
  }

  showWarning(title: string, message?: string): void{
    this.notification$.next({
      icon: 'warning',
      title,
      text: message,
      confirmButtonColor: '#383838',
      confirmButtonText: 'Cerrar',
    });
  }

  showError(title: string, message?: string): void{
    this.notification$.next({
      icon: 'error',
      title,
      text: message,
      confirmButtonColor: '#383838',
      confirmButtonText: 'Cerrar',
    });
  }

  showConfirmDeleteAction(feature: string){
    return Swal.fire({
      title: `¿Estás seguro?`,
      text: `No se podrá revertir la acción de eliminar ${feature}`,
      icon: "warning",
      iconColor: "#EC9892",
      showCancelButton: true,
      cancelButtonColor: "#383838",
      confirmButtonColor: "#E9806E",
      cancelButtonText: "Cancelar",
      confirmButtonText: 'Confirmar',
      customClass: {
        cancelButton: "alter-cancel-btn",
        confirmButton: 'custom-confirm-btn',
      },
    });
  }

  showConfirmAction(title: string, message?: string, confirmButtonText?: string){
    return Swal.fire({
      title,
      text: message,
      icon: "warning",
      iconColor: "#EC9892",
      showCancelButton: true,
      cancelButtonColor: "#383838",
      confirmButtonColor: "#E9806E",
      cancelButtonText: "Cancelar",
      confirmButtonText,
      customClass: {
        cancelButton: "alter-cancel-btn",
        confirmButton: 'custom-confirm-btn',
      },
    });
  }

  showSuccesActionWaitResponse(title: string, message?: string, confirmButtonText?: string){
    return Swal.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonColor: '#383838',
      confirmButtonText
    });
  }

  showWarningActionWaitResponse(title: string, message?: string, confirmButtonText?: string){
    return Swal.fire({
      icon: 'warning',
      title,
      text: message,
      confirmButtonColor: '#383838',
      confirmButtonText
    });
  }
}