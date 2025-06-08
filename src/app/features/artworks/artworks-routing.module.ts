import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtworkListComponent } from './pages/artwork-list/artwork-list.component';
import { ArtworkDetailsComponent } from './pages/artwork-details/artwork-details.component';
import { SellArtworkComponent } from './components/sell-artwork/sell-artwork.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'sell-artwork',
    component: SellArtworkComponent,
    canActivate: [AuthGuard]
  },
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtworksRoutingModule { }