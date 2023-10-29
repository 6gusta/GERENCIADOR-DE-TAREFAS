from flask import Flask, request, jsonify, render_template

app = Flask(__name__, template_folder='templates', static_url_path='/static', static_folder='static')
tarefas = []
@app.route("/")
def index():
    return render_template("login.html")

# Rota para autenticação
@app.route('/api/login', methods=['POST'])
def login():
    try:
        if request.is_json:
            dados = request.get_json()
            if "usuario" in dados and "senha" in dados:
                usuario = dados["usuario"]
                senha = dados["senha"]
                # Lógica de autenticação
                if usuario == "gusta" and senha == "luiz9175":
                    return jsonify({"autenticando": True, "mensagem": "Login bem-sucedido."})
                else:
                    return jsonify({"autenticando": False, "mensagem": "[ERRO!!] Credenciais inválidas"})
            else:
                return jsonify({"autenticando": False, "mensagem": "[ERRO!!] Chaves 'usuario' e 'senha' ausentes nos dados enviados."})
        else:
            return jsonify({"autenticando": False, "mensagem": "\033[31m[ERRO!!] Solicitação inválida, formato JSON esperado."})
    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({"autenticando": False, "mensagem": "Erro interno do servidor."}), 500

# Rota para a tela inicial
@app.route('/tela-inicial')
def tela_inicial():
    return render_template('tela-inicial.html')

@app.route('/adicionar-tarefa', methods=['POST'])
def adicionar_tarefa():
    dados = request.get_json()
    if 'task' in dados:
        tarefa = dados['task']
        tarefas.append(tarefa)
        app.logger.info(f'Tarefa recebida e adicionada: {tarefa}')  # Adicione esta linha para registrar a tarefa no log do Flask
        return jsonify({'mensagem': 'Tarefa adicionada com sucesso'})
    app.logger.error('Dados inválidos recebidos')  # Adicione esta linha para registrar erros no log do Flask
    return jsonify({'erro': 'Dados inválidos'}), 400


@app.route('/obter-tarefas', methods=['GET'])
def obter_tarefas():
    # Retorna a lista de tarefas como uma resposta JSON
    return jsonify({'tarefas': tarefas})

@app.route('/excluir-tarefa', methods=['POST'])
def excluir_tarefa():
    dados=request.get_json()
    if "task" in dados:
        tarefa = dados['task']
        if tarefa in tarefas:
            tarefas.remove(tarefa)
            app.logger.info(f" tarefa excluida: {tarefa}")
            return jsonify({'sucesso':True, 'mensagem': 'tarefa excluida  com sucessso '})
        app.logger.error(' tarefa nao encontrada ou dados invalidos  recebidos ')
        return jsonify({'sucesso': False, 'mensagem': ' tarefa nao econtrada  ou dados invalidos '}),400

if __name__ == '__main__':
    app.run(debug=True)