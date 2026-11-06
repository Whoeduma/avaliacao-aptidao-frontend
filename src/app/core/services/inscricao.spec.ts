import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { InscricaoService } from './inscricao';

describe('InscricaoService', () => {
  let service: InscricaoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(InscricaoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('carrega inscrições e resumo da API', () => {
    service.carregar();

    http.expectOne('http://localhost:8080/api/inscricoes').flush([{
      nome: 'Ana Souza',
      email: 'ana@email.com',
      dataNascimento: '1990-05-20',
      percurso: 'KM_10',
      idadeNaProva: 36,
      categoria: 'ADULTO'
    }]);
    http.expectOne('http://localhost:8080/api/inscricoes/resumo')
      .flush({ total: 1, km5: 0, km10: 1 });

    expect(service.inscricoes()[0].nascimento).toBe('1990-05-20');
    expect(service.resumo()).toEqual({ total: 1, km5: 0, km10: 1 });
  });

  it('envia o contrato correto no cadastro', () => {
    service.cadastrar({
      nome: 'Ana Souza',
      email: 'ana@email.com',
      nascimento: '1990-05-20',
      distancia: 'KM_10'
    }).subscribe();

    const requisicao = http.expectOne('http://localhost:8080/api/inscricoes');
    expect(requisicao.request.method).toBe('POST');
    expect(requisicao.request.body).toEqual({
      nome: 'Ana Souza',
      email: 'ana@email.com',
      dataNascimento: '1990-05-20',
      percurso: 'KM_10'
    });
    requisicao.flush({});
  });

  it('envia edição sem permitir alteração do e-mail', () => {
    service.editar('ana@email.com', {
      nome: 'Ana Maria',
      nascimento: '1990-05-20',
      distancia: 'KM_5'
    }).subscribe();

    const requisicao = http.expectOne('http://localhost:8080/api/inscricoes/ana%40email.com');
    expect(requisicao.request.method).toBe('PUT');
    expect(requisicao.request.body).toEqual({
      nome: 'Ana Maria',
      dataNascimento: '1990-05-20',
      percurso: 'KM_5'
    });
    requisicao.flush({});
  });

  it('usa a mensagem em português devolvida pelo backend', () => {
    const erro = new HttpErrorResponse({
      status: 400,
      error: { mensagem: 'A idade mínima para participar é 14 anos.' }
    });

    expect(service.obterMensagemErro(erro, 'Falha')).toBe(
      'A idade mínima para participar é 14 anos.'
    );
  });
});
