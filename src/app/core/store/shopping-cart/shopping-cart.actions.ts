import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { OrderDetailRequest } from '../../../layouts/customer/models/order-detail-request';

export const ShoppingCartAction = createActionGroup({
  source: 'ShoppingCart',
  events: {
    'Add product': props<{ product: OrderDetailRequest }>(),
    'Remove product': props<{ productId: string }>(),
    'Update product quuantity': props<{ productId: string; quantity: number }>,
    'Clear cart': emptyProps()
  },
});
