import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { InscricaoService, type DadosCadastro } from '../../core/services/inscricao';
import { Notificacao } from '../../core/services/notificacao';
import {
  validarEmail,
  validarNascimento,
  validarNome,
  type Distancia
} from '../../dominio/inscricao.regras';

@Component({
  selector: 'app-nova-inscricao',
  imports: [FormsModule, RouterLink],
  templateUrl: './nova-inscricao.html',
  styleUrl: './nova-inscricao.css'
})
export class NovaInscricao {
  private readonly inscricaoService = inject(InscricaoService);
  private readonly router = inject(Router);
  private readonly notificacao = inject(Notificacao);

  dados: {
    nome: string;
    email: string;
    nascimento: string;
    distancia: Distancia | '';
  } = { nome: '', email: '', nascimento: '', distancia: '' };

  erros: Record<string, string> = {};
  enviando = false;

  confirmarInscricao(): void {
    this.erros = {};
    const nome = this.dados.nome.trim();

    if (!nome) {
      this.erros['nome'] = 'Informe o nome completo.';
    } else if (!validarNome(nome)) {
      this.erros['nome'] = 'O nome deve conter entre 3 e 100 caracteres.';
    }
    if (!this.dados.email.trim()) {
      this.erros['email'] = 'Informe o e-mail.';
    } else if (!validarEmail(this.dados.email)) {
      this.erros['email'] = 'Informe um e-mail válido.';
    }
    if (!this.dados.nascimento) {
      this.erros['nascimento'] = 'Informe a data de nascimento.';
    } else if (!validarNascimento(this.dados.nascimento)) {
      this.erros['nascimento'] = 'Informe uma data válida e anterior a hoje.';
    }
    if (!this.dados.distancia) {
      this.erros['distancia'] = 'Escolha o percurso.';
    }
    if (Object.keys(this.erros).length > 0) {
      return;
    }

    const cadastro: DadosCadastro = {
      nome: this.dados.nome,
      email: this.dados.email,
      nascimento: this.dados.nascimento,
      distancia: this.dados.distancia as Distancia
    };

    this.enviando = true;
    this.inscricaoService.cadastrar(cadastro).subscribe({
      next: () => {
        this.inscricaoService.carregar();
        this.notificacao.mostrarSucesso('Inscrição realizada com sucesso!');
        this.router.navigate(['/inscricoes']);
      },
      error: erro => {
        this.erros['geral'] = this.inscricaoService.obterMensagemErro(
          erro,
          'Não foi possível realizar a inscrição. Tente novamente.'
        );
        this.enviando = false;
      }
    });
  }
}
