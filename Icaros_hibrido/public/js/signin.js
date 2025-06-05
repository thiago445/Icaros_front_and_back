document.addEventListener('DOMContentLoaded', function () {
    const BASE_URL = document.getElementById('config').getAttribute('data-base-url');
    const form = document.getElementById('CadastroForm');
    const select = document.getElementById('flagUserType');
    const cpfField = document.getElementById('cpfField');
    const cnpjField = document.getElementById('cnpjField');
    const cpfInput = document.getElementById('cpf');
    const cnpjInput = document.getElementById('cnpj');
    const generoInput = document.getElementById('generoMusical');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('csenha');

    $(document).ready(function () {
        // Aplicar máscara nos campos
        $('#cel').mask('(00) 00000-0000');
        $('#cpf').mask('000.000.000-00', { reverse: true });
        $('#cnpj').mask('00.000.000/0000-00', { reverse: true });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            validarEEnviarForm();
        });

        select.addEventListener('change', mostrarOpcao);
        mostrarOpcao();
    });

    function mostrarOpcao() {
        cpfField.style.display = 'none';
        cnpjField.style.display = 'none';
        cpfInput.required = false;
        cnpjInput.required = false;
        generoInput.required = false;

        const userType = parseInt(select.value, 10);
        if (userType === 1 || userType === 2) {
            cpfField.style.display = 'block';
            cpfInput.required = true;
            if (userType === 2) {
                generoInput.required = true; // Gênero musical para usuários amantes
            }
        } else if (userType === 3) {
            cnpjField.style.display = 'block';
            cnpjInput.required = true;
        }
    }

    async function obterNomeEmpresa(cnpj) {
        const cnpjFormatado = cnpj.replace(/[^\d]+/g, '');
        const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpjFormatado}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro na requisição');
            const data = await response.json();
            return data.razao_social;
        } catch (error) {
            console.error("Erro ao obter nome da empresa:", error);
            return null;
        }
    }

    function validarEEnviarForm() {
        const nome = $('#name').val();
        const email = $('#email').val();
        const senha = passwordInput.value;
        const csenha = confirmPasswordInput.value;

        // Remover mensagens de erro anteriores
        $('.error-message').remove();
        $('#password, #csenha').removeClass('input-error');

        // Verificar campos obrigatórios
        if (!nome || !email || !senha || !csenha) {
            exibirErro('Preencha todos os campos.');
            return;
        }

        // Verificar se as senhas coincidem
        if (senha !== csenha) {
            $('#password, #csenha').addClass('input-error');
            confirmPasswordInput.value = ''; // Limpar campo de confirmação
            exibirErro('As senhas não coincidem. Por favor, verifique.');
            return;
        }

        const user = {
            name: nome,
            email: email,
            password: senha,
            birthDate: document.getElementById('birthDate').value,
            gender: document.getElementById('gender').value,
            flagUserType: parseInt(select.value, 10),
            telephone: document.getElementById('cel').value,
            musicalGenre: generoInput.value
        };

        let specificUserKey = '';
        let specificUser = {};
        const userType = user.flagUserType;

        if (userType === 1 || userType === 2) {
            specificUser = { cpf: cpfInput.value };
            specificUserKey = userType === 2 ? 'userLover' : 'userMusician';
            enviarDados(user, specificUserKey, specificUser);
        } else if (userType === 3) {
            const cnpj = cnpjInput.value;
            obterNomeEmpresa(cnpj).then(fantasyName => {
                specificUser = { cnpj, fantasyName };
                specificUserKey = 'producerUser';
                enviarDados(user, specificUserKey, specificUser);
            }).catch(error => {
                console.error('Erro ao obter nome da empresa:', error);
                alert('Erro ao obter nome da empresa. Tente novamente.');
            });
        }
    }

    function exibirErro(mensagem) {
        $('<p class="error-message">' + mensagem + '</p>').insertAfter('#csenha');
    }

    function enviarDados(user, specificUserKey, specificUser) {
        const payload = { user };
        payload[specificUserKey] = specificUser;
        fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (!response.ok) throw new Error('Erro na rede');
                return response.json();
            })
            .then(() => {
                reenviar();
            })
            .catch(error => console.error('Erro:', error));
    }

    async function reenviar() {
        const email = document.getElementById('email').value;
        console.log(email);

            fetch(`${BASE_URL}/auth/autentic`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                }),
                credentials: 'include' // Necessário para enviar cookies de sessão
            })
            
                .then(response => {
                    if (!response.ok) throw new Error('Erro em salvar email no baguio');
                    return;
                    console.log('eu sei que ta aqui')
                })
                .then(() => {
                    window.location.href= '/autenticacaoa'
                })
                .catch(error => console.error('Erro:', error));

    }
});

