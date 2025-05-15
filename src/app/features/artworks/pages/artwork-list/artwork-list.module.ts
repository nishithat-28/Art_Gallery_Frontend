import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { ArtworkListComponent } from './artwork-list.component';

const routes: Routes = [
  {
    path: '',
    component: ArtworkListComponent
  }
];

@NgModule({
  declarations: [
    ArtworkListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ArtworkListModule { } 