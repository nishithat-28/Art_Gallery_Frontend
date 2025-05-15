import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FaqPageComponent } from './pages/faq-page/faq-page.component';
import { MatExpansionModule } from '@angular/material/expansion';

const routes: Routes = [
  {
    path: '',
    component: FaqPageComponent
  }
];

@NgModule({
  declarations: [
    FaqPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatExpansionModule,
    RouterModule.forChild(routes)
  ]
})
export class FaqModule { } 