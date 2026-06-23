document.addEventListener('DOMContentLoaded', () => {
    
    // 1. FILTRO DINÂMICO DE COMUNICADOS
    const filtro = document.getElementById('filtro-comunicados');
    const itens = document.querySelectorAll('.item-comunicado');

    if (filtro) {
        filtro.addEventListener('change', (e) => {
            const categoriaSelecionada = e.target.value;

            itens.forEach(item => {
                const categoriaItem = item.getAttribute('data-categoria');
                
                if (categoriaSelecionada === 'todos' || categoriaItem === categoriaSelecionada) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // 2. MARCAR COMO LIDO DINAMICAMENTE
    const botoesLido = document.querySelectorAll('.btn-marcar-lido');

    botoesLido.forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Localiza o contêiner do botão para substituir o HTML
            const paiElemento = this.parentElement;
            
            // Substitui o botão clicável por um selo estático de "Lido"
            paiElemento.innerHTML = `
                <span class="tiny text-muted font-italic">Enviado por: <strong>Secretaria Acadêmica</strong></span>
                <span class="badge bg-light text-muted fw-600 font-xs px-2 py-1"><i class="fas fa-eye me-1"></i> Lido</span>
            `;
        });
    });
});