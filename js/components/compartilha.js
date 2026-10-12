import {
    gerarImagemCartao,
    gerarImagemSomenteMensagem,
    formatarNomeArquivo
} from "./save.js";


// Criar arquivo para compartilhamento
async function criarArquivo(imagem, nomeArquivo) {

    const resposta = await fetch(imagem);

    const blob = await resposta.blob();

    return new File(
        [blob],
        nomeArquivo,
        {
            type: "image/png"
        }
    );
}


// Compartilhar arquivo
async function compartilharArquivo(arquivo, nome) {

    if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
            files: [arquivo]
        })
    ) {

        await navigator.share({
            title: "Correio Motivacional",
            text: `Uma mensagem especial para ${nome} 💗`,
            files: [arquivo]
        });

        return true;
    }

    return false;
}


// Compartilhar com nome
export async function compartilharComNome(cartao, nome) {

    const imagem = await gerarImagemCartao(cartao);

    const nomeArquivo = formatarNomeArquivo(nome);

    const arquivo = await criarArquivo(
        imagem,
        `correio-motivacional-para-${nomeArquivo}.png`
    );


    const compartilhou = await compartilharArquivo(
        arquivo,
        nome
    );


    // Se não puder compartilhar, baixa a imagem
    if (!compartilhou) {

        const link = document.createElement("a");

        link.download =
            `correio-motivacional-para-${nomeArquivo}.png`;

        link.href = imagem;

        link.click();
    }
}


// Compartilhar somente mensagem
export async function compartilharSomenteMensagem(cartao) {

    const imagem = await gerarImagemSomenteMensagem(cartao);

    const arquivo = await criarArquivo(
        imagem,
        "correio-motivacional-somente-mensagem.png"
    );


    const compartilhou = await compartilharArquivo(
        arquivo,
        "uma pessoa especial"
    );


    // Se não puder compartilhar, baixa a imagem
    if (!compartilhou) {

        const link = document.createElement("a");

        link.download =
            "correio-motivacional-somente-mensagem.png";

        link.href = imagem;

        link.click();
    }
}

// Criar dados do link
function criarDadosLink( dados, incluirNome ) {
    const dadosLink = {
        mensagemId: dados.mensagemId,
        molduraId: dados.molduraId,
        simbolo1Id: dados.simbolo1Id,
        simbolo2Id: dados.simbolo2Id
    };

    if (incluirNome) {
        dadosLink.nome = dados.nome;
    }

    return dadosLink;
}

// Codificar dados
function codificarDados(dados) {
    const texto = JSON.stringify(dados);
    const bytes = new TextEncoder().encode(texto);
    let binario = "";

    bytes.forEach(byte => {
        binario += String.fromCharCode(byte);
    });

    return btoa(binario)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}


// Criar URL personalizada
export function criarLinkPersonalizado( dados, incluirNome ) {

    const dadosLink = criarDadosLink( dados, incluirNome );
    const codigo = codificarDados(dadosLink);
    const url = new URL( window.location.href);

    url.search = "";
    url.hash = "";

    url.searchParams.set( "cartao", codigo );

    return url.toString();
}


// Compartilhar link
async function compartilharLink( url, nome ) {
    if (navigator.share) {
        await navigator.share({
            title: "Correio Motivacional",
            text:
                nome
                    ? `Uma mensagem especial para ${nome} 💗`
                    : "Uma mensagem especial 💗",
            url
        });
        return true;
    }
    return false;
}

// Compartilhar link com nome
export async function compartilharLinkComNome( dados ) {
    const url = criarLinkPersonalizado( dados, true );

    const compartilhou = await compartilharLink( url, dados.nome );

    if (!compartilhou) {
        await navigator.clipboard.writeText( url );
        alert( "Link personalizado copiado!" );
    }
}

// Compartilhar link somente mensagem
export async function compartilharLinkSomenteMensagem( dados) {
    const url = criarLinkPersonalizado( dados, false );

    const compartilhou = await compartilharLink( url, "" );

    if (!compartilhou) {
        await navigator.clipboard.writeText( url );

        alert( "Link personalizado copiado!" );
    }
}