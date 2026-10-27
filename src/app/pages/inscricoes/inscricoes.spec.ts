import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Inscricoes } from './inscricoes';
import { provideRouter } from '@angular/router';

describe('Inscricoes', () => {
  let component: Inscricoes;
  let fixture: ComponentFixture<Inscricoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inscricoes],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Inscricoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
