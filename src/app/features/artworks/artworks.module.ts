import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ArtworkListComponent } from './pages/artwork-list/artwork-list.component';
import { ArtworkDetailsComponent } from './pages/artwork-details/artwork-details.component';
import { ArtworkCardComponent } from './components/artwork-card/artwork-card.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const routes: Routes = [
  {
    path: '',
    component: ArtworkListComponent
  },
  {
    path: ':id',
    component: ArtworkDetailsComponent
  }
];

@NgModule({
  declarations: [
    ArtworkListComponent,
    ArtworkDetailsComponent,
    ArtworkCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    DecimalPipe
  ]
})
export class ArtworksModule { } 