// importações
import { criarMensagem, criarMensagemPorDados} from "./components/message.js";
import { salvarComNome, salvarSomenteMensagem } from "./components/save.js";
import { compartilharComNome, compartilharSomenteMensagem, compartilharLinkComNome, compartilharLinkSomenteMensagem } from "./components/compartilha.js";
import { abrirModal, fecharModal, criarModalSalvar, criarModalCompartilhar, criarModalImagem, criarModalLink } from "./components/modal.js";

// Elementos
const formulario = document.querySelector("#formulario");
const campoNome = document.querySelector("#nome");
const formularioErro = document.querySelector("#formularioErro");

const mensagem = document.querySelector(".message");
const messageContent = document.querySelector(".message__content");

// Botões do modal
const btnSalvar = document.querySelector(".btn__salva");
const btnCompartilhar = document.querySelector(".btn__compartilhar");

// Modal
const modal = document.querySelector("#modal");

// Dados atuais do cartão
let dadosCartaoAtual = null;


// Revelar mensagem
formulario.addEventListener("submit", async event => {

    event.preventDefault();


    const nomeDigitado = campoNome.value.trim();


    // Verificar nome
    if (nomeDigitado === "") {

        formularioErro.textContent =
            "Digite seu nome para revelar a mensagem";

        campoNome.focus();

        return;
    }


    // Limpar erro
    formularioErro.textContent = "";


    try {

        // Criar mensagem
        const resultado = await criarMensagem(nomeDigitado);

        // Colocar HTML no cartão
        messageContent.innerHTML = resultado.html;

        dadosCartaoAtual = resultado;

        //Remover a borda
        mensagem.style.border = 'none';
        // Mostrar cartão
        mensagem.classList.add("mensagem__revelada");
        
        // Rolar até a mensagem
        mensagem.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


        // Limpar campo
        campoNome.value = "";

    } catch (erro) {

        console.error(
            "Erro ao revelar mensagem:",
            erro
        );

        formularioErro.textContent =
            "Não foi possível revelar a mensagem. Tente novamente.";
    }
});


// Abrir modal salvar
btnSalvar.addEventListener(
    "click",
    () => {

        modal.innerHTML =
            criarModalSalvar();

        abrirModal(modal);
    }
);


// Abrir modal compartilhar
btnCompartilhar.addEventListener( "click", () => { 
        modal.innerHTML = criarModalCompartilhar();
        abrirModal(modal);
    }
);


// Ações dos botões do modal
modal.addEventListener( "click", async event => {
        const botao = event.target.closest( "[data-acao]" );

        if (!botao) {
            return;
        }

        const acao = botao.dataset.acao;

        // Fechar
        if (acao === "fechar") {
            fecharModal(modal);

            return;
        }

        // Salvar com nome
        if ( acao === "salvar-com-nome" ) {
            if (!dadosCartaoAtual) {
                return;
            }

            await salvarComNome( messageContent, dadosCartaoAtual.nome );

            fecharModal(modal);

            return;
        }

        // Salvar somente mensagem
        if ( acao === "salvar-somente-mensagem") {
            if (!dadosCartaoAtual) {
                return;
            }

            await salvarSomenteMensagem( messageContent );

            fecharModal(modal);

            return;
        }

        // Compartilhar imagem
        if ( acao === "compartilhar-imagem" ) {
            modal.innerHTML = criarModalImagem();

            return;
        }

        // Compartilhar link
        if ( acao === "compartilhar-link") {
            modal.innerHTML = criarModalLink();

            return;
        }

        // Compartilhar imagem com nome
        if ( acao === "imagem-com-nome" ) {
            if (!dadosCartaoAtual) {
                return;
            }

            await compartilharComNome( messageContent, dadosCartaoAtual.nome );

            fecharModal(modal);

            return;
        }

        // Compartilhar imagem sem nome
        if ( acao === "imagem-somente-mensagem" ) {
            if (!dadosCartaoAtual) {
                return;
            }

            await compartilharSomenteMensagem( messageContent);

            fecharModal(modal);

            return;
        }

        // Compartilhar link com nome
        if ( acao === "link-com-nome") {
            if (!dadosCartaoAtual) {
                return;
            }

            await compartilharLinkComNome( dadosCartaoAtual );

            fecharModal(modal);

            return;
        }


        // Compartilhar link sem nome
        if ( acao === "link-somente-mensagem" ) {
            if (!dadosCartaoAtual) {
                return;
            }

            await compartilharLinkSomenteMensagem( dadosCartaoAtual );

            fecharModal(modal);

            return;
        }

    }
);

// Verificar se a página foi aberta através de um link
async function carregarCartaoDoLink() {
    const parametros = new URLSearchParams( window.location.search );

    const codigo = parametros.get("cartao");

    if (!codigo) {
        return;
    }

    try {
        const dados = decodificarDados(codigo);

        const resultado = await criarMensagemPorDados( dados);

        messageContent.innerHTML =resultado.html;

        dadosCartaoAtual = {
            ...dados,
            nome:
                resultado.nome
        };

        mensagem.classList.remove( "manifestar" );

        setTimeout(() => {
            mensagem.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);


    } catch (erro) {
        console.error(
            "Erro ao carregar cartão do link:",
            erro
        );
    }
}

// Decodificar dados do link
function decodificarDados(codigo) {
    const base64 =
        codigo
            .replace(/-/g, "+")
            .replace(/_/g, "/");

    const preenchimento =  "=".repeat((4 - base64.length % 4) % 4);

    const binario = atob( base64 + preenchimento );

    const bytes =
        Uint8Array.from(
            binario,
            caractere =>
                caractere.charCodeAt(0)
        );

    const texto = new TextDecoder().decode(bytes);

    return JSON.parse(texto);
}


// Carregar cartão do link
carregarCartaoDoLink();