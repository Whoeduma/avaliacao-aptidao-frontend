import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { InscricaoService, type InscricaoResponse } from '../../core/services/inscricao';

@Component({
  selector: 'app-detalhes-inscricao',
  imports: [RouterLink],
  templateUrl: './detalhes-inscricao.html',
  styleUrl: './detalhes-inscricao.css'
})
export class DetalhesInscricao {
  private readonly route = inject(ActivatedRoute);
  private readonly inscricaoService = inject(InscricaoService);

  readonly email = this.route.snapshot.paramMap.get('email') ?? '';
  readonly carregando = signal(true);
  readonly inscricao = signal<InscricaoResponse | null>(null);
  erro = '';

  constructor() {
    this.inscricaoService.consultar(this.email).subscribe({
      next: resposta => {
        this.inscricao.set(resposta);
        this.carregando.set(false);
      },
      error: erro => {
        this.erro = this.inscricaoService.obterMensagemErro(
          erro,
          'Não foi possível carregar a inscrição.'
        );
        this.carregando.set(false);
      }
    });
  }

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}
