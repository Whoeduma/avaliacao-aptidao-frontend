export type Distancia = 'KM_5' | 'KM_10';

export type Categoria = 
    | 'JUVENIL'
    | 'ADULTO'
    | 'MASTER'
    | 'SENIOR';

export type ErroRegulamento =
    | 'IDADE_MINIMA'
    | 'DISTANCIA_NAO_PERMITIDA';

export interface AvaliacaoInscricao {
    aceita: boolean;
    idadeNaProva: number;
    categoria: Categoria | null;
    erro: ErroRegulamento | null;
}

export function normalizarEmail(email: string): string {
    return email.trim().toLowerCase();
}

export function calcularIdade(
    nascimento: string,
    referencia: string
): number {
    const [anoNascimento, mesNascimento, diaNascimento] = 
    nascimento.split('-').map(Number);

    const [anoReferencia, mesReferencia, diaReferencia] = 
    referencia.split('-').map(Number);

    let idade = anoReferencia - anoNascimento;

    if(mesReferencia < mesNascimento || (mesReferencia === mesNascimento && diaReferencia < diaNascimento))
    {
        idade--;
    }
    return idade;
}

export function avaliarInscricao(
    nascimento: string,
    distancia: Distancia,
    dataProva: string
): AvaliacaoInscricao {
    const idade = calcularIdade(nascimento, dataProva);

    if(idade < 14){
        return{
            aceita: false,
            idadeNaProva: idade,
            categoria: null,
            erro: 'IDADE_MINIMA'
        };
    }

    if(idade < 18 && distancia === 'KM_10') {
        return{
            aceita: false,
            idadeNaProva: idade,
            categoria: null,
            erro: 'DISTANCIA_NAO_PERMITIDA'
        };
    }

    let categoria: Categoria;

    if(idade < 18) {
        categoria = 'JUVENIL';
    } else if (idade < 40) {
        categoria = 'ADULTO';
    } else if (idade < 60) {
        categoria = 'MASTER';
    } else {
        categoria = 'SENIOR';
    }

    return{
        aceita: true,
        idadeNaProva: idade,
        categoria: categoria,
        erro: null
    };

}

export function validarNome(nome: string): boolean {
    const nomeTratado = nome.trim().replace(/\s+/g,' ');

    return nomeTratado.length >= 3 && nomeTratado.length <= 100;
}


export function validarEmail(email: string): boolean {
  const emailNormalizado = normalizarEmail(email);

  const formatoEmail =
    /^[a-zA-Z0-9._%+-]{2,}@[a-zA-Z0-9-]{2,}(?:\.[a-zA-Z]{2,})+$/;

  return formatoEmail.test(emailNormalizado);
}


export function validarNascimento(nascimento: string): boolean {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) {
        return false;
    }

    const [ano, mes, dia] = nascimento.split('-').map(Number);

    const data = new Date(Date.UTC(ano, mes - 1, dia));

    const dataValida =
        data.getUTCFullYear() === ano &&
        data.getUTCMonth() === mes - 1 &&
        data.getUTCDate() === dia;
    
        if(!dataValida) {
            return false;
        }

        const hoje = new Date ();
        const dataDeHoje = Date.UTC(
            hoje.getFullYear(),
            hoje.getMonth(),
            hoje.getDate()
        );

        return data.getTime() < dataDeHoje;
}

