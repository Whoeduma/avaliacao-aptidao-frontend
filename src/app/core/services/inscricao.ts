
import { Injectable, signal } from '@angular/core';
import { Inscricao } from '../../models/inscricao.model';
import {
  normalizarEmail,
  avaliarInscricao,
  validarNome,
  validarEmail,
  validarNascimento,
  type Distancia,
  type ErroRegulamento
} from '../../dominio/inscricao.regras';

const STORAGE_KEY = 'corrida.inscricoes.v1';

export interface DadosCadastro {
  nome: string;
  email: string;
  nascimento: string;
  distancia: Distancia;
}

export type ResultadoCadastro =
  | { sucesso: true }
  | {
      sucesso: false;
      erro:
        | 'NOME_INVALIDO'
        | 'EMAIL_DUPLICADO'
        | 'ERRO_ARMAZENAMENTO'
        | 'EMAIL_INVALIDO'
        | 'DATA_INVALIDA'
        | ErroRegulamento;
    };

export type ResultadoCancelamento =
  | { sucesso: true }
  | {
      sucesso: false;
      erro: 'INSCRICAO_NAO_ENCONTRADA' | 'ERRO_ARMAZENAMENTO';
    };

@Injectable({
  providedIn: 'root'
})
export class InscricaoService {
  private readonly inscricoesSignal = signal<Inscricao[]>(
    this.carregarInscricoes()
  );

  readonly inscricoes = this.inscricoesSignal.asReadonly();

  private carregarInscricoes(): Inscricao[] {
    try {
      const dados = localStorage.getItem(STORAGE_KEY);

      if (!dados) {
        return [];
      }

      const inscricoes = JSON.parse(dados);

      if (!Array.isArray(inscricoes)) {
        return [];
      }

      return inscricoes;
    } catch {
      return [];
    }
  }

  private salvarInscricoes(inscricoes: Inscricao[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inscricoes));
      return true;
    } catch {
      return false;
    }
  }

  emailJaCadastrado(email: string): boolean {
    const emailNormalizado = normalizarEmail(email);

    return this.inscricoesSignal().some(
      inscricao =>
        normalizarEmail(inscricao.email) === emailNormalizado
    );
  }

  cadastrar(dados: DadosCadastro): ResultadoCadastro {
    const email = normalizarEmail(dados.email);

    if (!validarNome(dados.nome)) {
      return {
        sucesso: false,
        erro: 'NOME_INVALIDO'
      };
    }

    if (!validarEmail(dados.email)) {
      return {
        sucesso: false,
        erro: 'EMAIL_INVALIDO'
      };
    }

    if (this.emailJaCadastrado(email)) {
      return {
        sucesso: false,
        erro: 'EMAIL_DUPLICADO'
      };
    }

    if (!validarNascimento(dados.nascimento)) {
      return {
        sucesso: false,
        erro: 'DATA_INVALIDA'
      };
    }

    const avaliacao = avaliarInscricao(
      dados.nascimento,
      dados.distancia,
      '2027-03-14'
    );

    if (!avaliacao.aceita) {
      return {
        sucesso: false,
        erro: avaliacao.erro!
      };
    }

    const novaInscricao: Inscricao = {
      nome: dados.nome.trim().replace(/\s+/g, ' '),
      email,
      nascimento: dados.nascimento,
      distancia: dados.distancia,
      idadeNaProva: avaliacao.idadeNaProva,
      categoria: avaliacao.categoria!
    };

    const listaAtualizada = [
      ...this.inscricoesSignal(),
      novaInscricao
    ];

    const salvou = this.salvarInscricoes(listaAtualizada);

    if (!salvou) {
      return {
        sucesso: false,
        erro: 'ERRO_ARMAZENAMENTO'
      };
    }

    this.inscricoesSignal.set(listaAtualizada);

    return { sucesso: true };
  }

  cancelar(email: string): ResultadoCancelamento {
    const emailNormalizado = normalizarEmail(email);

    if (!this.emailJaCadastrado(emailNormalizado)) {
      return {
        sucesso: false,
        erro: 'INSCRICAO_NAO_ENCONTRADA'
      };
    }

    const listaAtualizada = this.inscricoesSignal().filter(
      inscricao =>
        normalizarEmail(inscricao.email) !== emailNormalizado
    );

    const salvou = this.salvarInscricoes(listaAtualizada);

    if (!salvou) {
      return {
        sucesso: false,
        erro: 'ERRO_ARMAZENAMENTO'
      };
    }

    this.inscricoesSignal.set(listaAtualizada);

    return { sucesso: true };
  }
}
