import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { OrderDetailRequest } from '../../../layouts/customer/pages/checkout/models/order-detail-request';

export const ShoppingCartAction = createActionGroup({
  source: 'ShoppingCart',
  events: {
    'Add product': props<{ orderDetail: OrderDetailRequest }>(),
    'Remove product': props<{ productId: string }>(),
    'Update product quantity': props<{ productId: string; quantity: number }>(),
    'Clear cart': emptyProps()
  },
});
