document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.querySelector('.add');
    const taskInput = document.getElementById('tafe');
    const tarefasUl = document.querySelector('.tarefas');
    const sairButton = document.getElementById('sair');

    function excluirTarefa(tarefa) {
        fetch('/excluir-tarefa', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ task: tarefa })
        })
        .then(response => response.json())
        .then(data => {
            if (data.sucesso) {
                carregarTarefas();
            }
            alert(" tem certeza que deseja excluir a tarefa ? ")
            alert(data.mensagem);
        })
        .catch(error => {
            console.error("Erro ao excluir tarefa:", error);
        });
    }
    function editarTarefa(nomeTarefa) {
        const novoNome = prompt("Digite o novo nome da tarefa:", nomeTarefa);
        console.log("Novo nome digitado:", novoNome);
        const dados = {
            nomeAtual: nomeTarefa,
            novoNome: novoNome
        };
    
        if (novoNome !== null && novoNome.trim() !== '') {
            fetch('/editar-tarefa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            })
            .then(response => response.json())
            .then(data => {
                if (data.sucesso) {
                    console.log("Tarefa editada com sucesso:", data.mensagem);
                    carregarTarefas();
                } else {
                    console.error("Erro ao editar tarefa:", data.mensagem);
                }
            })
            .catch(error => {
                console.error("Erro ao editar tarefa:", error);
                console.log("Descrição inválida. A tarefa não foi editada.");
            });
        }
    }
    

    
    
    
    function carregarTarefas() {
        fetch('/obter-tarefas', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            // Limpa a lista de tarefas antes de adicionar as tarefas do backend
            tarefasUl.innerHTML = '';

            // Adiciona as tarefas do backend como itens de lista à lista de tarefas
            data.tarefas.forEach(tarefa => {
                const newTaskLi = document.createElement('li');
                newTaskLi.textContent = tarefa;

                // Adiciona um botão de exclusão (ícone de lixeira) para cada tarefa
                const deleteButton = document.createElement('lixeira');
                deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', function() {
                    excluirTarefa(tarefa);
                   
                });
                document.body.appendChild(deleteButton); 

                // Adiciona um botão de edição (ícone de lápis) para cada tarefa
                const editButton = document.createElement('lapis');
                editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
                editButton.classList.add('edit-button');
                editButton.addEventListener('click', function() {
                    editarTarefa(tarefa);
                });

                newTaskLi.appendChild(deleteButton);
                newTaskLi.appendChild(editButton);
                tarefasUl.appendChild(newTaskLi);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar tarefas:', error);
        });
    }

    carregarTarefas();

    addButton.addEventListener('click', function() {
        const task = taskInput.value.trim();

        if (task !== '') {
            fetch('/adicionar-tarefa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: task }),
            })
            .then(response => response.json())
            .then(data => {
                carregarTarefas();

                const confirmacao = confirm('Tarefa adicionada com sucesso.');

                if (!confirmacao) {
                    alert('Obrigado por adicionar suas tarefas.');
                }
            })
            .catch(error => {
                console.error('Erro ao adicionar tarefa:', error);
            });

            taskInput.value = '';
        } else {
            alert('Por favor, insira uma tarefa válida.');
        }
    });

    sairButton.addEventListener('click', function() {
        const confirmacao = confirm('Tem certeza que deseja encerrar a sessão?');

        if (confirmacao) {
            window.location.href = "/";
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const abrirModal = document.getElementById('ver-tarefas');
    const modal = document.getElementById('TV');
    const fechar = document.querySelector('.modal .fechar');
    const listaTarefas = document.getElementById('tarefas');

    abrirModal.addEventListener('click', function(event) {
        fetch('/obter-tarefas')
            .then(response => response.json())
            .then(data => {
                listaTarefas.innerHTML = '';

                data.tarefas.forEach(function(tarefa) {
                    const li = document.createElement('li');
                    li.textContent = tarefa;

                    const verButton = document.createElement('button');
                    verButton.textContent = 'Ver';
                    verButton.className = 'ver-butto0';
                    verButton.setAttribute('data-tarefa', tarefa);
                    li.appendChild(verButton);
                    listaTarefas.appendChild(li);

                    verButton.addEventListener('click', function(event) {
                        const tarefaSelecionada =event.target.dataset.tarefa;;
                        const modalTarefa = document.createElement('div');
                        modalTarefa.className = 'modal-tarefa';

                        modalTarefa.innerHTML = `
                            <div class="modal-conteudo-tarefa">
                                <span class="fechar-tarefa">&times;</span>
                                <h2>Detalhes da Tarefa</h2>
                                <p>${tarefaSelecionada}</p>
                            </div>
                        `;

                        document.body.appendChild(modalTarefa);

                        const fecharTarefa = modalTarefa.querySelector('.fechar-tarefa');
                        fecharTarefa.addEventListener('click', function() {
                            modalTarefa.remove();
                        });
                    });

                    li.appendChild(verButton);
                    listaTarefas.appendChild(li);
                });

                modal.style.display = 'block';
            });
    });

    fechar.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
function verificarTarefasPendentes() {
    fetch('/verificar-tarefas-pendentes', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if (data.tarefasPendentes) {
            window.alert('Há tarefas pendentes. Por favor, verifique suas tarefas.');
        }
    })
    .catch(error => {
        console.error('Erro ao verificar tarefas pendentes:', error);
    });
}

// Chame a função para verificar tarefas pendentes quando a página for carregada
document.addEventListener('DOMContentLoaded', verificarTarefasPendentes);



