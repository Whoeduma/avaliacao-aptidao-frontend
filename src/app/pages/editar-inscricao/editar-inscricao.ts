import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { InscricaoService, type InscricaoResponse } from '../../core/services/inscricao';
import { Notificacao } from '../../core/services/notificacao';
import { type Distancia } from '../../dominio/inscricao.regras';

@Component({
  selector: 'app-editar-inscricao',
  imports: [FormsModule, RouterLink],
  templateUrl: './editar-inscricao.html',
  styleUrl: './editar-inscricao.css'
})
export class EditarInscricao {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly inscricaoService = inject(InscricaoService);
  private readonly notificacao = inject(Notificacao);

  readonly email = this.route.snapshot.paramMap.get('email') ?? '';
  readonly carregando = signal(true);
  inscricao: InscricaoResponse | null = null;
  nome = '';
  nascimento = '';
  distancia: Distancia = 'KM_5';
  erro = '';
  salvando = false;

  constructor() {
    this.inscricaoService.consultar(this.email).subscribe({
      next: resposta => {
        this.inscricao = resposta;
        this.nome = resposta.nome;
        this.nascimento = resposta.dataNascimento;
        this.distancia = resposta.percurso;
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

  salvar(): void {
    this.erro = '';
    this.salvando = true;
    this.inscricaoService.editar(this.email, {
      nome: this.nome,
      nascimento: this.nascimento,
      distancia: this.distancia
    }).subscribe({
      next: () => {
        this.inscricaoService.carregar();
        this.notificacao.mostrarSucesso('Inscrição atualizada com sucesso!');
        this.router.navigate(['/inscricoes']);
      },
      error: erro => {
        this.erro = this.inscricaoService.obterMensagemErro(
          erro,
          'Não foi possível salvar a inscrição.'
        );
        this.salvando = false;
      }
    });
  }
}
