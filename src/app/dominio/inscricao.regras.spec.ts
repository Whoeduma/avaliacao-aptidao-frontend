import { describe, expect, it } from 'vitest';

import {
    normalizarEmail,
    calcularIdade,
    avaliarInscricao,
    validarNome, 
    validarEmail,
    validarNascimento
} from './inscricao.regras';

const DATA_PROVA = '2027-03-14';

describe('Regras da inscrição', () => {
    it('deve normalizar o e-mail', () => {
        const resultado = normalizarEmail('  DUDA@GMAIL.COM  ');
        
        expect(resultado).toBe('duda@gmail.com');
    });

    it('deve calcular a idade antes do aniversário', () => {
        const idade = calcularIdade('2009-03-15', DATA_PROVA);

        expect(idade).toBe(17);
    });

    it('deve considerar aniversário no dia da prova', () => {
    const idade = calcularIdade('2009-03-14', DATA_PROVA);

    expect(idade).toBe(18);
  });

  it('deve recusar participantes menores de 14 anos', () => {
    const resultado = avaliarInscricao(
        '2013-03-15',
        'KM_5',
        DATA_PROVA
    );

    expect(resultado.aceita).toBe(false);
    expect(resultado.erro).toBe('IDADE_MINIMA');
  });

  it('deve recusar 10 km para menores de 18 anos', () => {
    const resultado = avaliarInscricao(
        '2009-03-15',
        'KM_10',
        DATA_PROVA
    );

    expect(resultado.aceita).toBe(false);
    expect(resultado.erro).toBe('DISTANCIA_NAO_PERMITIDA');
  });

  it('deve classificar participantes de 40 anos como MASTER', () => {
    const resultado = avaliarInscricao(
        '1987-03-14',
        'KM_10',
        DATA_PROVA
    );

    expect(resultado.aceita).toBe(true);
    expect(resultado.categoria).toBe('MASTER');
  });

  it('deve validar nomes entre 3 e 100 caracteres', () => {
    expect(validarNome('Ana')).toBe(true);
    expect(validarNome(' Maria  Silva ')).toBe(true);
    expect(validarNome('A')).toBe(false);
    expect(validarNome('     ')).toBe(false);
    expect(validarNome('A'.repeat(101))).toBe(false);
  });

  it('deve validar o formato do e-mail', () => {
  expect(validarEmail('maria@gmail.com')).toBe(true);
  expect(validarEmail('  MARIA@GMAIL.COM  ')).toBe(true);
  expect(validarEmail('maria.com')).toBe(false);
  expect(validarEmail('maria@')).toBe(false);
  expect(validarEmail('maria@gmail')).toBe(false);
  expect(validarEmail('   ')).toBe(false);
});

it('deve validar a data de nascimento', () => {
  expect(validarNascimento('2000-05-10')).toBe(true);
  expect(validarNascimento('2000-02-29')).toBe(true);
  expect(validarNascimento('2000-02-31')).toBe(false);
  expect(validarNascimento('2028-01-01')).toBe(false);
  expect(validarNascimento('abc')).toBe(false);
});


});