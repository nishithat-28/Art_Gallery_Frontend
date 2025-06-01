import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ArtworkListComponent } from './pages/artwork-list/artwork-list.component';
import { ArtworkDetailsComponent } from './pages/artwork-details/artwork-details.component';
import { ArtworkCardComponent } from './components/artwork-card/artwork-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SellArtworkComponent } from './components/sell-artwork/sell-artwork.component';
import { CoreModule } from '../../core/core.module';
import { ArtworksRoutingModule } from './artworks-routing.module';

@NgModule({
  declarations: [
    ArtworkListComponent,
    ArtworkDetailsComponent,
    ArtworkCardComponent,
    SellArtworkComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ArtworksRoutingModule,
    CoreModule
  ],
  providers: [
    DecimalPipe
  ]
})
export class ArtworksModule { } 