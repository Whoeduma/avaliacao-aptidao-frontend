import { TestBed } from '@angular/core/testing';
import { InscricaoService } from './inscricao';

describe('InscricaoService', () => {
  let service: InscricaoService;

  beforeEach(() => {
    localStorage.removeItem('corrida.inscricoes.v1');

    TestBed.configureTestingModule({});
    service = TestBed.inject(InscricaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve cadastrar um participante válido', () => {
    const resultado = service.cadastrar ({
      nome: 'Maria Silva',
      email: 'maria@gmail.com',
      nascimento: '2000-05-10',
      distancia: 'KM_5'
    });

    expect(resultado.sucesso).toBe(true);
    expect(service.inscricoes().length).toBe(1);
  });

  it('não deve permitir e-mail duplicado', () => {

    service.cadastrar({
      nome: 'Maria Silva',
      email: 'maria@gmail.com',
      nascimento: '2000-05-10',
      distancia: 'KM_5'
    });

    const resultado = service.cadastrar({
      nome: 'João Santos',
      email: '  MARIA@GMAIL.COM  ',
      nascimento: '1995-08-20',
      distancia: 'KM_10'
    });

    expect(resultado.sucesso).toBe(false);

    if (!resultado.sucesso) {
      expect(resultado.erro).toBe('EMAIL_DUPLICADO');
    } 

    expect(service.inscricoes().length).toBe(1);
  })

  it('não deve cadastrar participante com nome inválido', () => {
    const resultado = service.cadastrar({
      nome: 'Jo',
      email: 'jo@email.com',
      nascimento: '2000-05-10',
      distancia: 'KM_5'
    });

    expect(resultado.sucesso).toBe(false);

    if(!resultado.sucesso) {
      expect(resultado.erro).toBe('NOME_INVALIDO');
    }

    expect(service.inscricoes().length).toBe(0);
  })

  it('não deve cadastrar participante com e-mail inválido', () => {
  const resultado = service.cadastrar({
    nome: 'Ana Silva',
    email: 'ana@gmail',
    nascimento: '2000-05-10',
    distancia: 'KM_5'
  });

  expect(resultado.sucesso).toBe(false);

  if (!resultado.sucesso) {
    expect(resultado.erro).toBe('EMAIL_INVALIDO');
  }

  expect(service.inscricoes().length).toBe(0);
  });

  it('não deve cadastrar participante com data inválida', () => {
  const resultado = service.cadastrar({
    nome: 'Ana Silva',
    email: 'ana@gmail.com',
    nascimento: '2000-02-31',
    distancia: 'KM_5'
  });

  expect(resultado.sucesso).toBe(false);

  if (!resultado.sucesso) {
    expect(resultado.erro).toBe('DATA_INVALIDA');
  }

  expect(service.inscricoes().length).toBe(0);
  });

  it('não deve cadastrar participante menor de 14 anos', () => {
  const resultado = service.cadastrar({
    nome: 'Ana Silva',
    email: 'ana@gmail.com',
    nascimento: '2013-03-15',
    distancia: 'KM_5'
  });

  expect(resultado.sucesso).toBe(false);

  if (!resultado.sucesso) {
    expect(resultado.erro).toBe('IDADE_MINIMA');
  }

  expect(service.inscricoes().length).toBe(0);
  });

  it('não deve permitir 10 km para menores de 18 anos', () => {
  const resultado = service.cadastrar({
    nome: 'Ana Silva',
    email: 'ana@gmail.com',
    nascimento: '2010-05-10',
    distancia: 'KM_10'
  });

  expect(resultado.sucesso).toBe(false);

  if (!resultado.sucesso) {
    expect(resultado.erro).toBe('DISTANCIA_NAO_PERMITIDA');
  }

  expect(service.inscricoes().length).toBe(0);
  });

});
