
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

  // Lista original de participantes
  readonly inscricoes = this.inscricaoService.inscricoes;

  // Texto digitado no campo de pesquisa
  readonly busca = signal('');

  // Remove acentos e ignora letras maiúsculas/minúsculas
  private normalizarTexto(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  // Filtra participantes por nome ou e-mail
  readonly inscricoesFiltradas = computed(() => {
    const termo = this.normalizarTexto(this.busca().trim());

    if (!termo) {
      return this.inscricoes();
    }

    return this.inscricoes().filter(inscricao =>
      this.normalizarTexto(inscricao.nome).includes(termo) ||
      this.normalizarTexto(inscricao.email).includes(termo)
    );
  });

  // Atualiza a pesquisa enquanto o usuário digita
  atualizarBusca(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    this.busca.set(campo.value);
  }

  // Participante selecionado para cancelamento
  inscricaoParaCancelar: Inscricao | null = null;
  erroCancelamento = '';

  // Contadores de participantes por distância
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

  // Formata a data para o padrão brasileiro
  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  // Abre o modal de confirmação de cancelamento
  abrirCancelamento(inscricao: Inscricao): void {
    this.inscricaoParaCancelar = inscricao;
    this.erroCancelamento = '';
  }

  // Fecha o modal de cancelamento
  fecharCancelamento(): void {
    this.inscricaoParaCancelar = null;
    this.erroCancelamento = '';
  }

  // Confirma o cancelamento da inscrição
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
