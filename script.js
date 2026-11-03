let listaDeTarefas = JSON.parse(localStorage.getItem('meuKanbanTarefas')) || [];

function adicionarTarefa() {
    let input = document.getElementById("tituloTarefa");
    let selectPrioridade = document.getElementById("prioridadeTarefa");
    
    let texto = input.value.trim();
    let prioridade = selectPrioridade.value;

    if (texto === "") {
        alert("Por favor, digite uma descrição para a tarefa.");
        return;
    }

    let novaTarefa = {
        id: Date.now(),
        titulo: texto,
        prioridade: prioridade,
        status: "fazer" 
    };

    listaDeTarefas.push(novaTarefa);
    salvarNoLocalStorage();

    input.value = ""; 
    renderizarTela();
}

function salvarNoLocalStorage() {
    localStorage.setItem('meuKanbanTarefas', JSON.stringify(listaDeTarefas));
}

function renderizarTela() {
    document.getElementById("coluna-fazer").innerHTML = "";
    document.getElementById("coluna-andamento").innerHTML = "";
    document.getElementById("coluna-concluido").innerHTML = "";

    let contFazer = 0;
    let contAndamento = 0;
    let contConcluido = 0;

    listaDeTarefas.forEach(tarefa => {
        // Estilização das tags de prioridade baseadas em variáveis CSS limpas
        let estiloTag = '';
        if (tarefa.prioridade === 'Alta') estiloTag = 'background-color: rgba(248, 81, 73, 0.15); color: #f85149;';
        else if (tarefa.prioridade === 'Média') estiloTag = 'background-color: rgba(210, 153, 34, 0.15); color: #d29922;';
        else estiloTag = 'background-color: rgba(88, 166, 255, 0.15); color: #58a6ff;';
        
        // Card base
        let cardHTML = `
            <div class="card-tarefa">
                <span class="tag-prioridade" style="${estiloTag}">${tarefa.prioridade}</span>
                <p>${tarefa.titulo}</p>
                <div class="botoes-card">
                    <button class="btn-mover" onclick="mudarStatus(${tarefa.id}, 'andamento')">Avançar &rarr;</button>
                    <button class="btn-excluir" onclick="excluirTarefa(${tarefa.id})">Excluir</button>
                </div>
            </div>
        `;

        if (tarefa.status === "fazer") {
            document.getElementById("coluna-fazer").innerHTML += cardHTML;
            contFazer++;
        } else if (tarefa.status === "andamento") {
            cardHTML = cardHTML.replace("'andamento'", "'concluido'"); 
            document.getElementById("coluna-andamento").innerHTML += cardHTML;
            contAndamento++;
        } else if (tarefa.status === "concluido") {
            // Card concluído com visual esmaecido natural e sem botão de avançar
            cardHTML = `
                <div class="card-tarefa" style="opacity: 0.5;">
                    <span class="tag-prioridade" style="background-color: #30363d; color: var(--texto-mutado); text-decoration: line-through;">${tarefa.prioridade}</span>
                    <p style="text-decoration: line-through; color: var(--texto-mutado);">${tarefa.titulo}</p>
                    <div class="botoes-card" style="justify-content: flex-end;">
                        <button class="btn-excluir" onclick="excluirTarefa(${tarefa.id})">Excluir</button>
                    </div>
                </div>
            `;
            document.getElementById("coluna-concluido").innerHTML += cardHTML;
            contConcluido++;
        }
    });

    document.getElementById("qtd-fazer").innerText = contFazer;
    document.getElementById("qtd-andamento").innerText = contAndamento;
    document.getElementById("qtd-concluido").innerText = contConcluido;

    let totalTarefas = listaDeTarefas.length;
    let porcentagem = totalTarefas > 0 ? Math.round((contConcluido / totalTarefas) * 100) : 0;
    
    document.getElementById("progresso-total").style.width = porcentagem + "%";
}

function mudarStatus(idTarefa, novoStatus) {
    listaDeTarefas = listaDeTarefas.map(tarefa => {
        if (tarefa.id === idTarefa) {
            tarefa.status = novoStatus;
        }
        return tarefa;
    });
    salvarNoLocalStorage();
    renderizarTela();
}

function excluirTarefa(idTarefa) {
    listaDeTarefas = listaDeTarefas.filter(tarefa => tarefa.id !== idTarefa);
    salvarNoLocalStorage();
    renderizarTela();
}

renderizarTela();
