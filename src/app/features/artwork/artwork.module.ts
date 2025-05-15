import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { ArtworkListComponent } from './components/artwork-list/artwork-list.component';
import { ArtworkDetailComponent } from './components/artwork-detail/artwork-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ArtworkListComponent
  },
  {
    path: ':id',
    component: ArtworkDetailComponent
  }
];

@NgModule({
  declarations: [
    ArtworkListComponent,
    ArtworkDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class ArtworkModule { } 