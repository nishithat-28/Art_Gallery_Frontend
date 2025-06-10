import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderInvoiceComponent } from './components/order-invoice/order-invoice.component';

const routes: Routes = [
  {
    path: '',
    component: OrderListComponent,
  },
  {
    path: ':id',
    component: OrderDetailsComponent,
  },
  {
    path: 'invoice/:id',
    component: OrderInvoiceComponent,
  }
];

@NgModule({
  declarations: [
    OrderDetailsComponent,
    OrderListComponent,
    OrderInvoiceComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ]
})
export class OrdersModule { } 