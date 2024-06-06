import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  constructor(private dialogRef: MatDialogRef<ShoppingCartComponent>){}

  onCloseCart(){
    this.dialogRef.close();
  }
}
