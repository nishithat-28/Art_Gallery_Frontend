import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellArtworkComponent } from './sell-artwork.component';

describe('SellArtworkComponent', () => {
  let component: SellArtworkComponent;
  let fixture: ComponentFixture<SellArtworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellArtworkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellArtworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
