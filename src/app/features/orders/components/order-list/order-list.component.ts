import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderService, Order } from '../../../../core/services/order.service';
import { OrderItem } from '../../../../core/models/order.model';
import { Artwork } from '../../../../core/models/artwork.model';

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
type StatusFilter = Order['status'] | 'all';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = false;
  filterForm: FormGroup;
  error: string | null = null;
  searchTerm = '';
  sortBy: 'date' | 'amount' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  private readonly statusClasses: Record<Order['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  constructor(
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      status: ['all'],
      dateRange: ['all'],
      sort: ['date-desc'],
      search: ['']
    });

    // Subscribe to form changes
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.loading = true;
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.snackBar.open('Error loading orders. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loading = false;
      }
    });
  }

  private applyFilters(): void {
    let filtered = [...this.orders];

    // Apply status filter
    const status = this.filterForm.get('status')?.value;
    if (status !== 'all') {
      filtered = filtered.filter(order => order.status === status);
    }

    // Apply date range filter
    const dateRange = this.filterForm.get('dateRange')?.value;
    if (dateRange !== 'all') {
      const days = parseInt(dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter(order => new Date(order.createdAt) >= cutoffDate);
    }

    // Apply search filter
    const search = this.filterForm.get('search')?.value?.toLowerCase();
    if (search) {
      filtered = filtered.filter(order => 
        order.id.toString().includes(search) ||
        order.items.some(item => item.artwork.title.toLowerCase().includes(search))
      );
    }

    // Apply sorting
    const sort = this.filterForm.get('sort')?.value;
    filtered.sort((a, b) => {
      switch (sort) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'amount-desc':
          return this.getOrderTotal(b) - this.getOrderTotal(a);
        case 'amount-asc':
          return this.getOrderTotal(a) - this.getOrderTotal(b);
        default:
          return 0;
      }
    });

    this.filteredOrders = filtered;
  }

  resetFilters(): void {
    this.filterForm.patchValue({
      status: 'all',
      dateRange: 'all',
      sort: 'date-desc',
      search: ''
    });
  }

  cancelOrder(order: Order): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(order.id.toString()).subscribe({
        next: (updatedOrder) => {
          const index = this.orders.findIndex(o => o.id === order.id);
          if (index !== -1) {
            this.orders[index] = updatedOrder;
            this.applyFilters();
          }
          this.snackBar.open('Order cancelled successfully.', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          this.snackBar.open('Error cancelling order. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  getStatusClass(status: Order['status']): string {
    return this.statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  getOrderTotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  exportOrders(): void {
    const ordersToExport = this.filteredOrders;
    if (ordersToExport.length === 0) {
      this.snackBar.open('No orders to export.', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      return;
    }

    // Create CSV content
    const headers = [
      'Order ID',
      'Date',
      'Status',
      'Total Amount',
      'Items',
      'Shipping Address'
    ];

    const rows = ordersToExport.map(order => [
      order.id.toString(),
      new Date(order.createdAt).toLocaleString(),
      order.status,
      this.getOrderTotal(order).toString(),
      order.items.map(item => `${item.artwork.title} (${item.quantity})`).join('; '),
      order.shippingAddress
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  filterOrders(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = [...this.orders];
    } else {
      const search = this.searchTerm.toLowerCase().trim();
      this.filteredOrders = this.orders.filter(order => 
        order.id.toString().includes(search) ||
        order.status.toLowerCase().includes(search) ||
        order.items.some((item: OrderItem) => item.artwork.title.toLowerCase().includes(search))
      );
    }
    this.sortOrders();
  }

  sortOrders(): void {
    this.filteredOrders.sort((a: Order, b: Order) => {
      if (this.sortBy === 'date') {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return this.sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        return this.sortDirection === 'desc' ? 
          b.totalAmount - a.totalAmount : 
          a.totalAmount - b.totalAmount;
      }
    });
  }

  getOrderItemsSummary(order: Order): string {
    return order.items.map((item: OrderItem) => 
      `${item.artwork.title} (${item.quantity})`
    ).join('; ');
  }
} 