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

    function editarTarefa(tarefa) {
        // Implemente a lógica para editar a tarefa aqui
        // Você pode abrir um modal ou caixa de diálogo para editar a tarefa
        // e, em seguida, enviar a tarefa editada para o backend da mesma forma que adiciona ou exclui tarefas
        // Por questões de simplicidade, esta função está vazia por enquanto
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
                deleteButton.addEventListener('click', function() {
                    excluirTarefa(tarefa);
                });

                // Adiciona um botão de edição (ícone de lápis) para cada tarefa
                const editButton = document.createElement('lapis');
                editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
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
