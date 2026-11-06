import { Component, computed, inject, signal } from '@angular/core';
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
  readonly carregando = this.inscricaoService.carregando;
  readonly erroCarregamento = this.inscricaoService.erroCarregamento;
  readonly resumo = this.inscricaoService.resumo;
  readonly busca = signal('');
  readonly total5km = computed(() => this.resumo().km5);
  readonly total10km = computed(() => this.resumo().km10);

  inscricaoParaCancelar: Inscricao | null = null;
  erroCancelamento = '';

  constructor() {
    this.inscricaoService.carregar();
  }

  readonly inscricoesFiltradas = computed(() => {
    const termo = this.normalizarTexto(this.busca().trim());
    if (!termo) {
      return this.inscricoes();
    }
    return this.inscricoes().filter(inscricao =>
      this.normalizarTexto(inscricao.nome).includes(termo)
      || this.normalizarTexto(inscricao.email).includes(termo)
    );
  });

  atualizarBusca(evento: Event): void {
    this.busca.set((evento.target as HTMLInputElement).value);
  }

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
    this.inscricaoService.cancelar(this.inscricaoParaCancelar.email).subscribe({
      next: () => {
        this.fecharCancelamento();
        this.inscricaoService.carregar();
      },
      error: erro => {
        this.erroCancelamento = this.inscricaoService.obterMensagemErro(
          erro,
          'Não foi possível cancelar a inscrição. Tente novamente.'
        );
      }
    });
  }

  private normalizarTexto(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
}
