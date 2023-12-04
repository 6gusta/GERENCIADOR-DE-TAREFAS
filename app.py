from flask import Flask,Response, request, jsonify, render_template,send_file
from flask_sqlalchemy import SQLAlchemy
import _mysql_connector
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
import datetime
import schedule
import time
import threading



class Tarefa:
    def __init__(self, id_tarefa, descricao):
        self.id_tarefa = id_tarefa
        self.descricao = descricao
tarefas = [
   
    
]
# Exemplo de como adicionar tarefas à lista no servidor (convertendo para minúsculas)



app = Flask(__name__, template_folder='templates', static_url_path='/static', static_folder='static')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:luiz91755676@localhost:3306/cadastro'
CORS(app)

db = SQLAlchemy(app)
class Pessoa(db.Model):
    __tablename__ = 'pessoas'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    celular = db.Column(db.String(20), nullable=False)
    senha = db.Column(db.String(60), nullable=False)

    def as_dict(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}

import mysql.connector

def conectar_ao_banco_de_dados():
    # Inicialize a variável 'connection' com um objeto de conexão MySQL
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="luiz91755676",
        database="cadastro"
    )
    
    app.logger.debug('Operações de banco de dados bem-sucedidas!')
    return connection

# Em algum lugar do seu código, chame a função para obter a conexão
connection = conectar_ao_banco_de_dados()

# Agora você pode usar 'connection' para executar operações no banco de dados
cursor = connection.cursor()
cursor.execute("SELECT * FROM pessoas")
resultados = cursor.fetchall()

# Não se esqueça de fechar a conexão após usar
connection.close()





def verificar_tarefas_pendentes():
    # Lógica para verificar tarefas pendentes no banco de dados
    # Enviar lembretes para as tarefas pendentes
    print("Verificar tarefas pendentes e enviar lembretes")
    

def enviar_lembretes():
    agora = datetime.now()
    tarefas_pendentes = [tarefa for tarefa in tarefas if tarefa['data'] <= agora]
    for tarefa in tarefas_pendentes:
        print(f"Tarefa pendente: {tarefa['descricao']}")

# Agendamento da função para ser executada diariamente às 9h da manhã
schedule.every().day.at("02:00").do(enviar_lembretes)

# Função para rodar o agendador em uma thread separada
def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(1)

# Iniciar o agendador em uma thread separada
scheduler_thread = threading.Thread(target=run_scheduler)
scheduler_thread.start()

# Iniciar o agendador em uma thread separada
scheduler_thread = threading.Thread(target=run_scheduler)
scheduler_thread.start()
@app.route("/")
def index():

    
    try:
        # Operações de banco de dados aqui
        app.logger.debug('Operações de banco de dados bem-sucedidas!')
        # Restante do código
        return render_template("login.html")
    except Exception as e:
        app.logger.error(f'Erro ao acessar o banco de dados: {e}')
        return 'Erro ao acessar o banco de dados', 500




@app.route('/api/login', methods=['POST'])
def login():
    try:
        if request.is_json:
            dados = request.get_json()
            if "nome" in dados and "senha" in dados:
                usuario = dados["nome"]
                senha = dados["senha"]

                # Verifica se o nome de usuário e a senha correspondem a um registro na tabela pessoas
                pessoa = Pessoa.query.filter_by(nome=usuario, senha=senha).first()

                if pessoa:
                    pessoa_dict = pessoa.as_dict()  # Ou use uma função para converter pessoa em um dicionário
                    ({"autenticado": True, "pessoa": pessoa_dict, "mensagem": "Login bem-sucedido."}), 200

                    return jsonify({"autenticado": True, "pessoa": pessoa_dict, "mensagem": "Login bem-sucedido."})
                else:
                    return jsonify({"autenticado": False, "mensagem": "Credenciais inválidas."})
            else:
                return jsonify({"autenticado": False, "mensagem": "Solicitação inválida, formato JSON esperado."})
        else:
            return jsonify({"autenticado": False, "mensagem": "Solicitação inválida, formato JSON esperado."})

    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({"autenticado": False, "mensagem": "Erro interno do servidor."})
@app.route('/cadastro', methods=['POST'])
def cadastro():
    try:
        if request.is_json:
            dados = request.get_json()
            nome = dados.get('nome')
            email = dados.get('email')
            celular = dados.get('celular')
            senha = dados.get('senha')

            # Validar se o campo 'email' está presente e não é nulo
            if email is None:
                return jsonify(erro='O campo "email" é obrigatório'), 400

            novo_usuario = Pessoa(nome=nome, email=email, celular=celular, senha=senha)
            db.session.add(novo_usuario)
            db.session.commit()

            return jsonify(message='Usuário cadastrado com sucesso!')
        else:
            return jsonify(erro='Solicitação inválida, formato JSON esperado'), 400
    except Exception as e:
        db.session.rollback()
        return jsonify(erro=f'Erro interno do servidor: {str(e)}'), 500
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
        return jsonify({'mensagem': 'Tarefa adicionada com sucesso'})
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












# Lista de exemplo de tarefas@app.route('/editar-tarefa', methods=['POST'])
@app.route('/editar-tarefa', methods=['POST'])
def editar_tarefa():
    try:
        dados = request.get_json()
        print("Dados recebidos do cliente:", dados)

        # Verifica se 'nomeAtual' e 'novoNome' estão presentes nos dados
        if 'nomeAtual' in dados and 'novoNome' in dados:
            nome_atual = dados['nomeAtual'].lower()
            novo_nome = dados['novoNome']
            print("Dados recebidos do cliente:", dados)

            # Encontra a tarefa pelo nomeAtual e atualiza o nome conforme necessário
            for i, tarefa in enumerate(tarefas):
                if isinstance(tarefa, str) and tarefa.lower() == nome_atual:
                    # Atualize o nome da tarefa na lista
                    tarefas[i] = novo_nome
                    print("Tarefa editada com sucesso")
                    return jsonify({"sucesso": True, "mensagem": "Tarefa editada com sucesso"})

            # Se não encontrar a tarefa pelo nomeAtual, retorna um erro 400
            print("Tarefa não encontrada")
            return jsonify({"sucesso": False, "mensagem": "Tarefa não encontrada"}), 400

        # Se 'nomeAtual' ou 'novoNome' não estiverem presentes nos dados, retorna um erro 400
        print("Dados inválidos")
        return jsonify({"sucesso": False, "mensagem": "Dados inválidos"}), 400

    except Exception as e:
        # Retorna um erro 500 em caso de exceção
        print(f"Erro interno do servidor: {str(e)}")
        return jsonify({"sucesso": False, "mensagem": f"Erro interno do servidor: {str(e)}"}), 500


@app.route('/verificar-tarefas-pendentes', methods=['GET'])
def verificar_tarefas_pendentes():
    # Lógica para verificar se há tarefas pendentes no servidor
    # Se houver tarefas pendentes, retorne {"tarefasPendentes": true}
    # Caso contrário, retorne {"tarefasPendentes": false}
    
    # Por exemplo, se você tem uma lista de tarefas, você pode verificar se a lista está vazia ou não
    if len(tarefas) > 0:
        tarefas_pendentes = True
        print(f"Tarefas Pendentes: {tarefas_pendentes}")

    else:
        tarefas_pendentes = False
    
    return jsonify({"tarefasPendentes": tarefas_pendentes})


if __name__ == '__main__':
    app.run(debug=True)
    app.run(host='0.0.0.0', port=8080)
