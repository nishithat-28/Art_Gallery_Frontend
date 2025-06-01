import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { ArtworkDetailsComponent } from './artwork-details.component';
import { ArtworkService } from 'src/app/core/services/artwork.service';

const routes: Routes = [
  {
    path: '',
    component: ArtworkDetailsComponent
  }
];

@NgModule({
  declarations: [
    ArtworkDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ArtworkDetailsModule { 
  

} 