import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { type Distancia } from '../../dominio/inscricao.regras';
import { Inscricao } from '../../models/inscricao.model';

const API_URL = 'http://localhost:8080/api/inscricoes';

export interface DadosCadastro {
  nome: string;
  email: string;
  nascimento: string;
  distancia: Distancia;
}

export interface DadosAtualizacao {
  nome: string;
  nascimento: string;
  distancia: Distancia;
}

export interface InscricaoResponse {
  nome: string;
  email: string;
  dataNascimento: string;
  percurso: Distancia;
  idadeNaProva: number;
  categoria: Inscricao['categoria'];
}

export interface ResumoInscricoes {
  total: number;
  km5: number;
  km10: number;
}

interface ErroApi {
  mensagem?: string;
}

@Injectable({ providedIn: 'root' })
export class InscricaoService {
  private readonly http = inject(HttpClient);
  private readonly inscricoesSignal = signal<Inscricao[]>([]);
  private readonly resumoSignal = signal<ResumoInscricoes>({ total: 0, km5: 0, km10: 0 });

  readonly inscricoes = this.inscricoesSignal.asReadonly();
  readonly resumo = this.resumoSignal.asReadonly();
  readonly carregando = signal(false);
  readonly erroCarregamento = signal('');

  carregar(): void {
    this.carregando.set(true);
    this.erroCarregamento.set('');

    this.http.get<InscricaoResponse[]>(API_URL).subscribe({
      next: respostas => {
        this.inscricoesSignal.set(respostas.map(resposta => this.mapear(resposta)));
        this.carregando.set(false);
      },
      error: erro => {
        this.erroCarregamento.set(
          this.obterMensagemErro(erro, 'Não foi possível carregar as inscrições.')
        );
        this.carregando.set(false);
      }
    });

    this.carregarResumo();
  }

  cadastrar(dados: DadosCadastro): Observable<InscricaoResponse> {
    return this.http.post<InscricaoResponse>(API_URL, {
      nome: dados.nome,
      email: dados.email,
      dataNascimento: dados.nascimento,
      percurso: dados.distancia
    });
  }

  consultar(email: string): Observable<InscricaoResponse> {
    return this.http.get<InscricaoResponse>(this.urlPorEmail(email));
  }

  editar(email: string, dados: DadosAtualizacao): Observable<InscricaoResponse> {
    return this.http.put<InscricaoResponse>(this.urlPorEmail(email), {
      nome: dados.nome,
      dataNascimento: dados.nascimento,
      percurso: dados.distancia
    });
  }

  cancelar(email: string): Observable<void> {
    return this.http.delete<void>(this.urlPorEmail(email)).pipe(
      tap(() => {
        this.inscricoesSignal.update(inscricoes =>
          inscricoes.filter(inscricao => inscricao.email !== email)
        );
        this.carregarResumo();
      })
    );
  }

  obterMensagemErro(erro: unknown, mensagemPadrao: string): string {
    if (erro instanceof HttpErrorResponse) {
      const resposta = erro.error as ErroApi | string | null;
      if (typeof resposta === 'object' && resposta?.mensagem) {
        return resposta.mensagem;
      }
      if (erro.status === 0) {
        return 'Não foi possível conectar ao servidor. Verifique se o backend está em execução.';
      }
    }
    return mensagemPadrao;
  }

  private carregarResumo(): void {
    this.http.get<ResumoInscricoes>(`${API_URL}/resumo`).subscribe({
      next: resumo => this.resumoSignal.set(resumo),
      error: () => this.resumoSignal.set({ total: 0, km5: 0, km10: 0 })
    });
  }

  private urlPorEmail(email: string): string {
    return `${API_URL}/${encodeURIComponent(email)}`;
  }

  private mapear(resposta: InscricaoResponse): Inscricao {
    return {
      nome: resposta.nome,
      email: resposta.email,
      nascimento: resposta.dataNascimento,
      distancia: resposta.percurso,
      idadeNaProva: resposta.idadeNaProva,
      categoria: resposta.categoria
    };
  }
}
