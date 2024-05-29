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
      confirmButtonColor: '#FF857A',
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
      confirmButtonColor: "#FF857A",
      cancelButtonText: "Cancelar",
      confirmButtonText: 'Confirmar',
      customClass: {
        cancelButton: "alter-cancel-btn",
        confirmButton: 'custom-confirm-btn',
      },
    });
  }
}