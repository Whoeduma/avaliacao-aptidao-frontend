
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { InscricaoService } from '../../core/services/inscricao';

@Component({
  selector: 'app-inscricoes',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './inscricoes.html',
  styleUrl: './inscricoes.css'
})
export class Inscricoes {
  private readonly inscricaoService = inject(InscricaoService);

  readonly inscricoes = this.inscricaoService.inscricoes;

  readonly total5km = computed(() =>
    this.inscricoes().filter(
      inscricao => inscricao.distancia === 'KM_5'
    ).length
  );

  readonly total10km = computed(() =>
    this.inscricoes().filter(
      inscricao => inscricao.distancia === 'KM_10'
    ).length
  );
}
