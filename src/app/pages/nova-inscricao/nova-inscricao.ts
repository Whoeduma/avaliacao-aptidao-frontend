
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Notificacao } from '../../core/services/notificacao';

import {
  InscricaoService,
  type DadosCadastro,
  type ResultadoCadastro
} from '../../core/services/inscricao';

import {
  validarNome,
  validarEmail,
  validarNascimento,
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

  // Dados preenchidos pelo usuário
  dados: {
    nome: string;
    email: string;
    nascimento: string;
    distancia: Distancia | '';
  } = {
    nome: '',
    email: '',
    nascimento: '',
    distancia: ''
  };

  // Erros exibidos na tela
  erros: Record<string, string> = {};

  confirmarInscricao(): void {
    this.erros = {};

    // Verifica todos os campos antes de tentar cadastrar
    if (!this.dados.nome.trim()) {
      this.erros['nome'] = 'Informe o nome completo.';
    } else if (!validarNome(this.dados.nome)) {
      this.erros['nome'] = 'Informe um nome válido.';
    }

    if (!this.dados.email.trim()) {
      this.erros['email'] = 'Informe o e-mail.';
    } else if (!validarEmail(this.dados.email)) {
      this.erros['email'] = 'Informe um e-mail válido.';
    }

    if (!this.dados.nascimento) {
      this.erros['nascimento'] = 'Informe a data de nascimento.';
    } else if (!validarNascimento(this.dados.nascimento)) {
      this.erros['nascimento'] = 'Informe uma data válida.';
    }

    if (!this.dados.distancia) {
      this.erros['distancia'] = 'Escolha o percurso.';
    }

    // Se houver qualquer erro, não cadastra
    if (Object.keys(this.erros).length > 0) {
      return;
    }

    // Todos os campos foram preenchidos e validados
    const dadosCadastro: DadosCadastro = {
      nome: this.dados.nome,
      email: this.dados.email,
      nascimento: this.dados.nascimento,
      distancia: this.dados.distancia as Distancia
    };

    const resultado = this.inscricaoService.cadastrar(dadosCadastro);

    
    if (resultado.sucesso) {
      this.notificacao.mostrarSucesso(
        'Inscrição realizada com sucesso!'
      );

      this.router.navigate(['/inscricoes']);
      return;
    }

    this.mostrarErro(resultado.erro);

  }

  private mostrarErro(
    erro: Extract<ResultadoCadastro, { sucesso: false }>['erro']
  ): void {

    switch (erro) {
      case 'NOME_INVALIDO':
        this.erros['nome'] = 'Informe um nome válido.';
        break;

      case 'EMAIL_INVALIDO':
        this.erros['email'] = 'Informe um e-mail válido.';
        break;

      case 'EMAIL_DUPLICADO':
        this.erros['email'] = 'Este e-mail já está cadastrado.';
        break;

      case 'DATA_INVALIDA':
        this.erros['nascimento'] = 'Informe uma data válida.';
        break;

      case 'IDADE_MINIMA':
        this.erros['nascimento'] =
          'É necessário ter pelo menos 14 anos na data da corrida.';
        break;

      case 'DISTANCIA_NAO_PERMITIDA':
        this.erros['distancia'] =
          'Participantes de 14 a 17 anos só podem correr 5 km.';
        break;

      case 'ERRO_ARMAZENAMENTO':
        this.erros['geral'] =
          'Não foi possível salvar a inscrição. Tente novamente.';
        break;
    }
  }
}
