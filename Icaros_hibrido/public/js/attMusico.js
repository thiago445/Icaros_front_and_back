document.addEventListener("DOMContentLoaded", function () {
    const BASE_URL = document.getElementById('config').getAttribute('data-base-url');
    async function fetchUserProfile() {
        try {
            const response = await fetch(`${BASE_URL}/profile/info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar o perfil do usuário');
            }

            const userProfile = await response.json();
            displayUserProfile(userProfile);

            // Armazena a imagem existente, se houver
            if (userProfile.user && userProfile.user.IMAGE) {
                perfilForm.dataset.hasImage = "true";
            } else {
                perfilForm.dataset.hasImage = "false";
            }

        } catch (error) {
            console.error('Erro ao buscar o perfil do usuário:', error);
        }
    }

    function displayUserProfile(userProfile) {
        const nomeElement = document.getElementById('nome');
        const descricaoElement = document.getElementById('descricao');
        const opcoesElement = document.getElementById('opcoes');

        if (nomeElement) {
            nomeElement.value = userProfile.user.NOME;
        }

        if (descricaoElement) {
            descricaoElement.value = userProfile.musician.COMENTARIO || '';
        }

        if (opcoesElement) {
            opcoesElement.value = userProfile.user.GENERO_MUSICAL || '';
        }
    }

    const perfilForm = document.getElementById('perfilForm');

    if (perfilForm) {
        perfilForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const comment = document.getElementById('descricao').value;
            const name = document.getElementById('nome').value;
            const musicalGenre = document.getElementById('opcoes').value;

            const userData = JSON.stringify({
                userMusician: {
                    comment: comment
                },
                user: {
                    name: name,
                    musicalGenre: musicalGenre
                }
            });

            fetch(`${BASE_URL}/profile/update_user`, {
                method: 'PUT',
                credentials: 'include',
                body: userData,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao atualizar perfil');
                    }
                    return response.text();
                })
                .then(data => {
                    console.log('Perfil atualizado com sucesso!', data);
                    alert('Perfil atualizado com sucesso!');

                    const imageInput = document.getElementById('imagem');
                    const file = imageInput.files[0];

                    if (file) {
                        const formData = new FormData();
                        formData.append('image', file);

                        // Verifica se o usuário já possui uma imagem salva
                        const method = perfilForm.dataset.hasImage === "true" ? 'PUT' : 'POST';

                        fetch(`${BASE_URL}/pictures`, {
                            method: method,
                            credentials: 'include',
                            body: formData
                        })
                            .then(imageResponse => {
                                if (!imageResponse.ok) {
                                    throw new Error('Erro ao enviar imagem');
                                }
                                return imageResponse.text();
                            })
                            .then(imageData => {
                                console.log('Imagem enviada com sucesso!', imageData);
                                alert('Imagem enviada com sucesso!');
                                window.location.href = '/portifolio-musico';
                            })
                            .catch(imageError => console.error('Erro ao enviar imagem:', imageError));
                    } else {
                        window.location.href = '/portifolio-musico';
                    }
                })
                .catch(error => console.error('Erro ao atualizar perfil:', error));
        });
    }

    fetchUserProfile();
});
