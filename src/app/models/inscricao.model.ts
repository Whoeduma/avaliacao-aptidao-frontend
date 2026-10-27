import {Categoria, Distancia} from '../dominio/inscricao.regras';

export interface Inscricao {
    nome: string;
    email: string;
    nascimento: string;
    distancia: Distancia;
    idadeNaProva: number;
    categoria: Categoria;
}