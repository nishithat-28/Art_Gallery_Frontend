import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderService } from '../../../../core/services/order.service';
import { OrderResponseDto, OrderItemResponseDto } from '../../../../core/models/order.model';

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
type StatusFilter = OrderResponseDto['status'] | 'all';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: OrderResponseDto[] = [];
  filteredOrders: OrderResponseDto[] = [];
  loading = false;
  filterForm: FormGroup;
  error: string | null = null;
  searchTerm = '';
  sortBy: 'date' | 'amount' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  private readonly statusClasses: Record<OrderResponseDto['status'], string> = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
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
    this.error = null;
    
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        console.log('Orders loaded successfully:', orders);
        this.orders = orders;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = 'Error loading orders. Please try again.';
        this.snackBar.open(this.error, 'Close', {
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
      filtered = filtered.filter(order => new Date(order.orderDate) >= cutoffDate);
    }

    // Apply search filter
    const search = this.filterForm.get('search')?.value?.toLowerCase();
    if (search) {
      filtered = filtered.filter(order => 
        order.id.toString().includes(search) ||
        order.orderItems.some(item => item.artWorkTitle.toLowerCase().includes(search))
      );
    }

    // Apply sorting
    const sort = this.filterForm.get('sort')?.value;
    filtered.sort((a, b) => {
      switch (sort) {
        case 'date-desc':
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        case 'date-asc':
          return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
        case 'amount-desc':
          return b.totalAmount - a.totalAmount;
        case 'amount-asc':
          return a.totalAmount - b.totalAmount;
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

  getStatusClass(status: OrderResponseDto['status']): string {
    return this.statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  getOrderTotal(order: OrderResponseDto): number {
    return order.totalAmount;
  }

  getOrderItemsSummary(order: OrderResponseDto): string {
    return order.orderItems.map(item => 
      `${item.artWorkTitle} (${item.quantity})`
    ).join('; ');
  }

  viewInvoice(order: OrderResponseDto): void {
    this.router.navigate(['/orders', order.id, 'invoice']);
  }
} 