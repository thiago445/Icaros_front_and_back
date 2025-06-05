document.addEventListener('DOMContentLoaded', function () {
    const BASE_URL = document.getElementById('config').getAttribute('data-base-url');
    const authButton = document.getElementById('authButton');

    authButton.addEventListener('click', async function () {
        // Captura o e-mail do cookie
        const email = getCookie('email');
        if (!email) {
            console.error('E-mail não encontrado no cookie');
            return;
        }

        // Faz uma requisição para reenviar e-mail
        try {
            const response = await fetch(`${BASE_URL}/auth/reenviar-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
            } else {
                console.error(result.error);
                alert('Erro ao reenviar o e-mail.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
});