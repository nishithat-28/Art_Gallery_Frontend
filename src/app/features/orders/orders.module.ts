import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OrderListComponent } from './components/order-list/order-list.component';

const routes: Routes = [
  {
    path: '',
    component: OrderListComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: ':id',
    component: OrderDetailsComponent,
    //canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    OrderDetailsComponent,
    OrderListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ]
})
export class OrdersModule { } 