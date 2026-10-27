import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  InscricaoService, type DadosCadastro, type ResultadoCadastro} from '../../core/services/inscricao';

@Component({
  selector: 'app-nova-inscricao',
  imports: [FormsModule, RouterLink],
  templateUrl: './nova-inscricao.html',
  styleUrl: './nova-inscricao.css'
})
export class NovaInscricao {
  private readonly inscricaoService = inject(InscricaoService);
  private readonly router = inject(Router);

  dados: DadosCadastro = {
    nome: '',
    email: '',
    nascimento: '',
    distancia: 'KM_5'
  };

  erros: Record<string, string> = {};

  confirmarInscricao(): void{
    this.erros = {};

    const resultado = this.inscricaoService.cadastrar(this.dados);

    if(resultado.sucesso) {
      //vai fechar o modal e volta para a lista
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
        this.erros['nome'] =
          'Informe um nome completo entre 3 e 100 caracteres.';
        break;

         case 'EMAIL_INVALIDO':
        this.erros['email'] =
          'Informe um e-mail válido.';
        break;

      case 'EMAIL_DUPLICADO':
        this.erros['email'] =
          'Este e-mail já está cadastrado.';
        break;

      case 'DATA_INVALIDA':
        this.erros['nascimento'] =
          'Informe uma data de nascimento válida.';
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