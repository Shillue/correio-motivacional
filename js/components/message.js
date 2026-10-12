let mensagens = [];
let molduras = [];
let simbolos = [];

let molduraAnterior = null;
let simbolosAnteriores = null;


// Sortear um item de uma lista
function sortearItem(lista) {

    const indice = Math.floor(Math.random() * lista.length);

    return lista[indice];
}


// Sortear dois símbolos diferentes
function sortearSimbolos(lista, anteriores = null) {

    let primeiro;
    let segundo;

    do {
        primeiro = sortearItem(lista);

        const simbolosDisponiveis = lista.filter( simbolo => simbolo.id !== primeiro.id );

        segundo = sortearItem(simbolosDisponiveis);

    } while (
        anteriores && (
            ( primeiro.id === anteriores.primeiro.id && segundo.id === anteriores.segundo.id
            )
            ||
            ( primeiro.id === anteriores.segundo.id && segundo.id === anteriores.primeiro.id
            )
        )
    );

    return {
        primeiro,
        segundo
    };
}


// Sortear moldura sem repetir a anterior
function sortearMoldura(lista, anterior) {

    const moldurasDisponiveis =
        lista.filter( moldura => moldura.id !== anterior?.id );

    return sortearItem(moldurasDisponiveis);
}


// Carregar mensagens
async function carregarMensagens() {

    const resposta = await fetch("./js/data/mensagens.json");

    mensagens = await resposta.json();
}


// Carregar molduras
async function carregarMolduras() {

    const resposta = await fetch("./js/data/molduras.json");

    molduras = await resposta.json();
}


// Carregar símbolos
async function carregarSimbolos() {

    const resposta = await fetch("./js/data/simbolos.json");

    simbolos = await resposta.json();
}


// Iniciar carregamentos
const mensagensCarregadas = carregarMensagens();
const moldurasCarregadas = carregarMolduras();
const simbolosCarregados = carregarSimbolos();

// Formatar nome
export function formatarNome(nome) {

    return nome
        .toLowerCase()
        .split(/\s+/)
        .map(palavra => {
            return palavra.charAt(0).toUpperCase() + palavra.slice(1);
        }).join(" ");
}


// Criar HTML do cartão
function criarHtmlCartao(
    nome,
    mensagem,
    moldura,
    simbolo1,
    simbolo2,
    mostrarNome = true
) {

    return `
        <img
            class="carta__moldura"
            src="${moldura.arquivo}"
            alt=""
            aria-hidden="true"
        >

        ${mostrarNome? 
                `
                    <h3 class="message__nome">
                        <span class="message__nome__texto">
                            Para, ${nome}
                        </span>

                        <span class="message__simbolo">
                            ${simbolo1.simbolo}
                        </span>
                    </h3>
                `
                : ""
        }

        <p class="message__text">
            ${mensagem.texto}
            ${simbolo2.simbolo}
        </p>
    `;
}


// Criar mensagem normal
export async function criarMensagem(nomeDigitado) {

    await mensagensCarregadas;
    await moldurasCarregadas;
    await simbolosCarregados;

    const nome = formatarNome(nomeDigitado);

    const mensagemSorteada = sortearItem(mensagens);

    const molduraSorteada = sortearMoldura( molduras, molduraAnterior);

    const simbolosSorteados = sortearSimbolos( simbolos, simbolosAnteriores);

    molduraAnterior = molduraSorteada;

    simbolosAnteriores = simbolosSorteados;

    const html = criarHtmlCartao( nome, mensagemSorteada, molduraSorteada, simbolosSorteados.primeiro, simbolosSorteados.segundo );

    return {
        html,
        nome,
        mensagemId: mensagemSorteada.id,
        molduraId: molduraSorteada.id,
        simbolo1Id: simbolosSorteados.primeiro.id,
        simbolo2Id: simbolosSorteados.segundo.id
    };
}


// Criar cartão a partir dos dados do link
export async function criarMensagemPorDados(dados) {

    await mensagensCarregadas;
    await moldurasCarregadas;
    await simbolosCarregados;

    const mensagem = mensagens.find( item => item.id === Number(dados.mensagemId));

    const moldura = molduras.find( item => item.id === Number(dados.molduraId));

    const simbolo1 = simbolos.find( item => item.id === Number(dados.simbolo1Id));

    const simbolo2 = simbolos.find(item => item.id === Number(dados.simbolo2Id));


    if (
        !mensagem ||
        !moldura ||
        !simbolo1 ||
        !simbolo2
    ) {
        throw new Error(
            "Não foi possível encontrar os dados do cartão."
        );
    }

    const nome = dados.nome ? formatarNome(dados.nome) : "";

    const html =
        criarHtmlCartao(
            nome,
            mensagem,
            moldura,
            simbolo1,
            simbolo2,
            Boolean(nome)
        );


    return {
        html,
        nome
    };
}