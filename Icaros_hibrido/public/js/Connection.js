const BASE_URL = document.getElementById('config').getAttribute('data-base-url');

function togglePasswordVisibility() {
    var passwordField = document.getElementById("senha");
    var passwordToggle = document.getElementById("toggleSenha");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        passwordToggle.textContent = "Esconder Senha";
    } else {
        passwordField.type = "password";
        passwordToggle.textContent = "Mostrar Senha";
    }
}


async function loginUser() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("senha").value;

    function exibirErro(mensagem) {
        $('<p class="error-message">' + mensagem + '</p>');
    }

    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
            credentials: 'include' // Necessário para enviar cookies de sessão
        });

        if (response.ok) {
            showToast("#okToast");

            window.location.href = '/prot/redirect'
        } else {
            window.alert("usuario ou email nao encontrado")
        }
    } catch (error) {
        console.error('Erro durante o login:', error);
        showToast("#errorToast");
    }
}

function handleMusicianRedirect(NewUser) {
    if (NewUser) {
        window.setTimeout(() => {
            window.location.href = '/attMusico';
        }, 2000);
    } else {
        window.setTimeout(() => {
            window.location.href = '/portifolio-musico';
        }, 2000);
    }
    // Adapte o URL para o redirecionamento desejado

}

function handleLoverRedirect(NewUser) {
    if (NewUser) {
        window.setTimeout(() => {
            window.location.href = '/attAm';
        }, 2000);
    } else {
        window.setTimeout(() => {
            window.location.href = '/portifolio-am';
        }, 2000);
    }
}


function handleProductorRedirect(NewUser) {
    // Adapte o URL para o redirecionamento desejado
    if (NewUser === true) {
        window.setTimeout(() => {
            window.location.href = '/attProdutor';
        }, 2000);
    } else {
        window.setTimeout(() => {
            window.location.href = '/portifolio-produtor';
        }, 2000);
    }
}

function showToast(id) {
    var toastElList = [].slice.call(document.querySelectorAll(id));
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl);
    });
    toastList.forEach((toast) => toast.show());
}


document.getElementById("SIGNIN").onclick = function() {
    location.href = "/SIGNIN";
};

$('#highlight-btn').on('click', function () {
    // Simula envio para um sistema de métricas
    console.log('Clique no botão CADASTRE-SE registrado.');
    // ou use um endpoint do seu backend
});
