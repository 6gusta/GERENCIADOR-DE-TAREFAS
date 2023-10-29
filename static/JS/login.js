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
        const usuario = document.getElementById("usuario").value;
        const senha = document.getElementById("senha").value;

        const dados = {
            usuario: usuario,
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
            mensagemElement.style.color = data.autenticando ? "green" : "red";

            if (data.autenticando) {
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
})








