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

  it('cancela somente o participante escolhido e libera seu e-mail', () => {
    service.cadastrar({ nome: 'Maria Silva', email: 'maria@exemplo.com', nascimento: '2000-05-10', distancia: 'KM_5' });
    service.cadastrar({ nome: 'João Silva', email: 'joao@exemplo.com', nascimento: '1990-05-10', distancia: 'KM_10' });
    expect(service.cancelar(' MARIA@EXEMPLO.COM ').sucesso).toBe(true);
    expect(service.inscricoes().map(item => item.email)).toEqual(['joao@exemplo.com']);
    expect(service.cadastrar({ nome: 'Maria Silva', email: 'maria@exemplo.com', nascimento: '2000-05-10', distancia: 'KM_5' }).sucesso).toBe(true);
  });

  it('avisa sobre JSON corrompido sem apagar os dados originais', () => {
    TestBed.resetTestingModule();
    localStorage.setItem('corrida.inscricoes.v1', '{invalido');
    const novoServico = TestBed.inject(InscricaoService);
    expect(novoServico.inscricoes()).toEqual([]);
    expect(novoServico.avisoArmazenamento()).toContain('Não foi possível ler');
    expect(localStorage.getItem('corrida.inscricoes.v1')).toBe('{invalido');
  });

  it('rejeita registros armazenados sem a estrutura esperada', () => {
    TestBed.resetTestingModule();
    localStorage.setItem('corrida.inscricoes.v1', JSON.stringify([{}]));
    const novoServico = TestBed.inject(InscricaoService);
    expect(novoServico.inscricoes()).toEqual([]);
    expect(novoServico.avisoArmazenamento()).toContain('inválidos');
  });

  it('não altera a lista quando o armazenamento falha', () => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new Error('sem espaço'); };
    try {
      const resultado = service.cadastrar({ nome: 'Maria Silva', email: 'maria@exemplo.com', nascimento: '2000-05-10', distancia: 'KM_5' });
      expect(resultado).toEqual({ sucesso: false, erro: 'ERRO_ARMAZENAMENTO' });
      expect(service.inscricoes()).toEqual([]);
    } finally {
      Storage.prototype.setItem = original;
    }
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

  
  it('deve editar o nome de um participante', () => {
    service.cadastrar({
      nome: 'Maria Silva',
      email: 'maria@gmail.com',
      nascimento: '2000-05-10',
      distancia: 'KM_5'
    });

    const resultado = service.editar('maria@gmail.com', {
      nome: 'Maria Oliveira',
      nascimento: '2000-05-10',
      distancia: 'KM_5'
    });

    expect(resultado.sucesso).toBe(true);
    expect(service.inscricoes()[0].nome).toBe('Maria Oliveira');
    expect(service.inscricoes()[0].email).toBe('maria@gmail.com');
    expect(service.inscricoes().length).toBe(1);
  });

  it('não deve permitir editar para 10 km se o participante for menor de 18 anos', () => {
    service.cadastrar({
      nome: 'Ana Silva',
      email: 'ana@gmail.com',
      nascimento: '2010-05-10',
      distancia: 'KM_5'
    });

    const resultado = service.editar('ana@gmail.com', {
      nome: 'Ana Silva',
      nascimento: '2010-05-10',
      distancia: 'KM_10'
    });

    expect(resultado.sucesso).toBe(false);

    if (!resultado.sucesso) {
      expect(resultado.erro).toBe('DISTANCIA_NAO_PERMITIDA');
    }

    expect(service.inscricoes()[0].distancia).toBe('KM_5');
  });

  it('deve atualizar a categoria quando a data de nascimento mudar', () => {
    service.cadastrar({
      nome: 'Carlos Souza',
      email: 'carlos@gmail.com',
      nascimento: '2010-05-10',
      distancia: 'KM_5'
    });

    expect(service.inscricoes()[0].categoria).toBe('JUVENIL');

    const resultado = service.editar('carlos@gmail.com', {
      nome: 'Carlos Souza',
      nascimento: '2000-05-10',
      distancia: 'KM_10'
    });

    expect(resultado.sucesso).toBe(true);
    expect(service.inscricoes()[0].categoria).toBe('ADULTO');
    expect(service.inscricoes()[0].distancia).toBe('KM_10');
    expect(service.inscricoes()[0].idadeNaProva).toBe(26);
  });

  it('não deve editar uma inscrição inexistente', () => {
    const resultado = service.editar('inexistente@gmail.com', {
      nome: 'Pessoa Teste',
      nascimento: '2000-05-10',
      distancia: 'KM_5'
    });

    expect(resultado.sucesso).toBe(false);

    if (!resultado.sucesso) {
      expect(resultado.erro).toBe('INSCRICAO_NAO_ENCONTRADA');
    }

    expect(service.inscricoes().length).toBe(0);
  });


});
