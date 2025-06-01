import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtworkListComponent } from './pages/artwork-list/artwork-list.component';
import { ArtworkDetailsComponent } from './pages/artwork-details/artwork-details.component';
import { SellArtworkComponent } from './components/sell-artwork/sell-artwork.component';

const routes: Routes = [
  {
    path: '',
    component: ArtworkListComponent
  },
  {
    path: ':id',
    component: ArtworkDetailsComponent
  },
  {
    path: 'sell-artwork',
    component: SellArtworkComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtworksRoutingModule { }