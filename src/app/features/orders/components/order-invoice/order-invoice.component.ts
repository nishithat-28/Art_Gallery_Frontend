import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { OrderResponseDto } from '../../../../core/models/order.model';

@Component({
  selector: 'app-order-invoice',
  templateUrl: './order-invoice.component.html',
  styleUrls: []
})
export class OrderInvoiceComponent implements OnInit {
  order: OrderResponseDto | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      this.error = 'Order ID not found';
      this.loading = false;
      return;
    }

    this.orderService.getOrder(Number(orderId)).subscribe({
      next: (order: OrderResponseDto) => {
        this.order = order;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.error = 'Error loading invoice';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }
}
