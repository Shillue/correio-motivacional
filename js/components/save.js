// Limpar nome para usar no arquivo
export function formatarNomeArquivo(nome) {
    return nome
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\p{L}\p{N}-]/gu, "");
}


// Baixar imagem
function baixarImagem(imagem, nomeArquivo) {

    const link = document.createElement("a");

    link.download = nomeArquivo;
    link.href = imagem;

    link.click();
}


// Gerar imagem do cartão
export async function gerarImagemCartao(elemento) {

    const imagem = await htmlToImage.toPng(elemento, {
        skipFonts: true,
    });

    return imagem;
}


// Gerar imagem somente com a mensagem
export async function gerarImagemSomenteMensagem(cartao) {

    const nome = cartao.querySelector(".message__nome");

    const displayOriginal = nome.style.display;

    nome.style.display = "none";

    try {
        const imagem = await gerarImagemCartao(cartao);

        return imagem;

    } finally {
        nome.style.display = displayOriginal;
    }
}


// Salvar com nome
export async function salvarComNome(cartao, nome) {

    const imagem = await gerarImagemCartao(cartao);

    const nomeArquivo = formatarNomeArquivo(nome);

    baixarImagem(
        imagem,
        `correio-motivacional-para-${nomeArquivo}.png`
    );
}


// Salvar somente mensagem
export async function salvarSomenteMensagem(cartao) {

    const imagem = await gerarImagemSomenteMensagem(cartao);

    baixarImagem(
        imagem,
        "correio-motivacional-somente-mensagem.png"
    );
}