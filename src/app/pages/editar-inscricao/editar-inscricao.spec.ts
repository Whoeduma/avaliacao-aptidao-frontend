import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarInscricao } from './editar-inscricao';

describe('EditarInscricao', () => {
  let component: EditarInscricao;
  let fixture: ComponentFixture<EditarInscricao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarInscricao],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarInscricao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
