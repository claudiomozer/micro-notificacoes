export interface Jogador {
    readonly _id: string;
    readonly telefone: string;
    readonly email: string;
    categoria: string;
    nome: string;
    ranking: string;
    posicaoRanking: number;
    urlFotoJogador: string;
}