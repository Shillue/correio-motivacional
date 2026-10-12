// Abrir modal
export function abrirModal(modal) {
    modal.style.display = "flex";
}


// Fechar modal
export function fecharModal(modal) {
    modal.style.display = "none";
}

// Conteúdo: salvar
export function criarModalSalvar() {
    return `
        <div class="modal__main__content">
            <h2>
                Como deseja salvar?
                <i class="fa-solid fa-heart"></i>
            </h2>
            <button
                type="button"
                class="modal__main__opcao"
                data-acao="salvar-com-nome">
                Com meu nome
            </button>
            <button
                type="button"
                class="modal__main__opcao"
                data-acao="salvar-somente-mensagem">
                Somente a mensagem
            </button>
            <button
                type="button"
                class="modal__main__fechar"
                data-acao="fechar">
                Cancelar
            </button>
        </div>
    `;
}


// Conteúdo: compartilhar
export function criarModalCompartilhar() {
    return `
        <div class="modal__main__content">
            <h2>
                Como deseja compartilhar?
                <i class="fa-solid fa-heart"></i>
            </h2>
            <button
                type="button"
                class="modal__main__opcao"
                data-acao="compartilhar-imagem">
                Imagem
            </button>
            <button
                type="button"
                class="modal__main__opcao"
                data-acao="compartilhar-link">
                Link personalizado
            </button>
            <button
                type="button"
                class="modal__main__fechar"
                data-acao="fechar">
                Cancelar
            </button>
        </div>
    `;
}


// Conteúdo: compartilhar imagem
export function criarModalImagem() {
    return `
        <div class="modal__main__content">
            <h2>
                Como deseja compartilhar a imagem?
                <i class="fa-solid fa-heart"></i>
            </h2>
            <button
                type="button"
                class="modal__main__opcao"
                data-acao="imagem-com-nome">
                Com meu nome
            </button>
            <button
                type="button"
                class="modal__main__opcao"
                data-acao="imagem-somente-mensagem">
                Somente a mensagem
            </button>
            <button
                type="button"
                class="modal__main__fechar"
                data-acao="fechar">
                Cancelar
            </button>
        </div>
    `;
}


// Conteúdo: compartilhar link
export function criarModalLink() {
    return `
        <div class="modal__main__content">
            <h2>
                Como deseja compartilhar o link?
                <i class="fa-solid fa-heart"></i>
            </h2>
            <button
                type="button"
                class="modal__main__opcao"
                data-acao="link-com-nome">
                Com meu nome
            </button>
            <button
                type="button"
                class="modal__main__opcao"
                data-acao="link-somente-mensagem">
                Somente a mensagem
            </button>
            <button
                type="button"
                class="modal__main__fechar"
                data-acao="fechar">
                Cancelar
            </button>
        </div>
    `;
}