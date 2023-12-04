document.addEventListener("DOMContentLoaded", function () {
    const particlesConfig = {
        particles: {
            number: {
                value: 100,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#ffffff"
            }
        }
    };

    particlesJS("particles-js", particlesConfig);

    const botaoLogin = document.getElementById("botao-login");

    if (botaoLogin) {
        botaoLogin.addEventListener("click", function (event) {
            event.preventDefault();
            login();
        });
    }

    function login() {
        const usuario = document.getElementById("nomes").value; // Corrigido para "nomes"
        const senha = document.getElementById("senha").value;

        const dados = {
            nome: usuario,
            senha: senha
        };

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })
        .then(response => response.json())
        .then(data => {
            const mensagemElement = document.getElementById("mensagem");
            mensagemElement.textContent = data.mensagem;
            mensagemElement.style.color = data.autenticado ? "green" : "red";

            if (data.autenticado) {
                console.log("Login bem-sucedido. Redirecionando para /tela-inicial.");
                window.location.href = '/tela-inicial';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            const mensagemElement = document.getElementById("mensagem");
            mensagemElement.textContent = 'Erro ao autenticar usuário. Por favor, tente novamente mais tarde.';
            mensagemElement.style.color = "red";
        });
    }
});


document.addEventListener("DOMContentLoaded", function() {
    // Obtenha referências aos elementos do modal de cadastro
    var abrirModalCadastro = document.getElementById("abrirModalCadastro");
    var modalCadastro = document.getElementById("modalCadastro");
    var fecharModalCadastro = modalCadastro.querySelector(".fechar");
    var formularioCadastro = document.getElementById("cadastroForm");
    var mensagemDivCadastro = document.getElementById("mensagemDivCadastro");

    // Adiciona um evento de clique ao link "Abrir Modal de Cadastro"
    abrirModalCadastro.addEventListener("click", function(event) {
        event.preventDefault(); // Evita que o link redirecione para outra página
        modalCadastro.style.display = "block"; // Exibe o modal
    });

    // Adiciona um evento de clique ao botão de fechar do modal de cadastro
    fecharModalCadastro.addEventListener("click", function() {
        modalCadastro.style.display = "none"; // Oculta o modal ao clicar no botão de fechar
    });

    // Adiciona um evento de envio ao formulário de cadastro
    formularioCadastro.addEventListener("submit", function(event) {
        event.preventDefault(); // Impede o envio do formulário tradicional

        const formData = new FormData(formularioCadastro);
        const dadosCadastro = {
            nome: formData.get("nome"),
            celular: formData.get("celular"),
            email: formData.get("emails"), // Corrigido para "emails"
            senha: formData.get("senhas") // Corrigido para "senhas"
        };
        console.log("Dados enviados para cadastro:", dadosCadastro);
        window.location.href = "/";

        fetch("/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosCadastro)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Erro ao cadastrar usuário.");
            }
        })
        .then(data => {
            mensagemDivCadastro.textContent = data.message;
            if (data.success) {
                console.log("Dados enviados para cadastro:", dadosCadastro);
                window.location.href = "/";
            }
        })
        .catch(error => {
            mensagemDivCadastro.textContent = error.message;
            console.error(error);
        });
    });
});
