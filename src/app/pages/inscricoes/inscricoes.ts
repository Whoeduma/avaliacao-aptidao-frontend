
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { InscricaoService } from '../../core/services/inscricao';
import { Inscricao } from '../../models/inscricao.model';

@Component({
  selector: 'app-inscricoes',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './inscricoes.html',
  styleUrl: './inscricoes.css'
})
export class Inscricoes {
  private readonly inscricaoService = inject(InscricaoService);

  readonly inscricoes = this.inscricaoService.inscricoes;

  inscricaoParaCancelar: Inscricao | null = null;
  erroCancelamento = '';

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

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }


  abrirCancelamento(inscricao: Inscricao): void {
    this.inscricaoParaCancelar = inscricao;
    this.erroCancelamento = '';
  }

  fecharCancelamento(): void {
    this.inscricaoParaCancelar = null;
    this.erroCancelamento = '';
  }

  confirmarCancelamento(): void {
    if (!this.inscricaoParaCancelar) {
      return;
    }

    const resultado = this.inscricaoService.cancelar(
      this.inscricaoParaCancelar.email
    );

    if (!resultado.sucesso) {
      this.erroCancelamento =
        'Não foi possível cancelar a inscrição. Tente novamente.';
      return;
    }

    this.fecharCancelamento();
  }
}
