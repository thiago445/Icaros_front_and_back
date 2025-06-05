let loggedUserProfile = null;
let imageProfile = null;

document.addEventListener("DOMContentLoaded", function () {
    const BASE_URL = document.getElementById('config').getAttribute('data-base-url');
    // Função para buscar os dados do usuário
    async function fetchUserProfile() {
        try {
            const response = await fetch(`${BASE_URL}/profile/info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                
                throw new Error('Erro ao buscar o perfil do usuário');
            }

            const userProfile = await response.json();
            console.log(`esse aqui ${userProfile}`);
            loggedUserProfile = userProfile;

            displayUserProfile(userProfile);

            // Se houver uma imagem, busca a URL da imagem
            if (userProfile.user.IMAGE) {
                const imageResponse = await fetch(`${BASE_URL}/pictures/${userProfile.user.IMAGE}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (imageResponse.ok) {
                    const imageData = await imageResponse.json();
                    displayImageUrl(imageData.url); // Exibe a URL da imagem
                    imageProfile = imageData.url;

                } else {
                    console.error('Erro ao buscar a imagem:', imageResponse.statusText);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar o perfil do usuário:', error);
        }
    }

    // Função para exibir os dados do usuário na tela
    function displayUserProfile(userProfile) {
        const nomeElement = document.getElementById('nome');
        const descricaoElement = document.getElementById('descricao');
        const opcoesElement = document.getElementById('opcoes');
        const emailElement = document.getElementById('email');

        if (nomeElement) {
            nomeElement.innerText = userProfile.user.NOME;
        }

        if (descricaoElement && userProfile.musician.COMENTARIO !== null) {
            descricaoElement.innerText = userProfile.musician.COMENTARIO;
        }
        if (opcoesElement) {
            opcoesElement.innerText = userProfile.user.GENERO_MUSICAL;
        }
        if (emailElement) {
            emailElement.innerText = userProfile.user.EMAIL;
        }
    }

    // Função para exibir a imagem
    function displayImageUrl(url) {
        const imagemElement = document.getElementById('imagem');
        if (imagemElement) {
            // Mudar a URL para que seja uma URL de imagem direta
            const directImageUrl = url.replace('dl=0', 'raw=1');
            imagemElement.src = directImageUrl; // Utiliza a URL ajustada do Dropbox
        }
    }


    fetchUserProfile();
});
document.addEventListener("DOMContentLoaded", function () {
    const BASE_URL = document.getElementById('config').getAttribute('data-base-url');

    // Função para buscar as postagens do usuário
    async function fetchUserPosts() {
        try {
            const response = await fetch(`${BASE_URL}/posts/user-posts`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Erro ao buscar postagens');

            const posts = await response.json();
            displayUserPosts(posts);
        } catch (error) {
            console.error('Erro ao buscar as postagens:', error);
        }
    }

    // Função para exibir as postagens na tela
    function displayUserPosts(posts) {
        const postsContainer = document.querySelector('.posts');
        postsContainer.innerHTML = '';

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>Nenhuma postagem encontrada.</p>';
            return;
        }



        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            console.log(loggedUserProfile);
            console.log(post);
            let nome = loggedUserProfile.user.NOME;

            let date = new Date(post.createdAt).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            let imageUrl = post.imageUrl;
            if (imageUrl && imageUrl.includes('dropbox.com')) {
                imageUrl = imageUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
            }

            // Aqui você pode personalizar a "foto de perfil" do autor do post
            // Caso tenha esses dados. Se não tiver, use algo estático ou omita.
            const authorPhotoUrl = "/imagens/usuario.png";
            // Ajuste para o caminho real ou para a foto do usuário caso queira.

            // Montando a estrutura de “cartão” estilo Instagram
            postElement.innerHTML = `
            <div class="post-header">
              <img class="post-profile-image" src="${imageProfile}" alt="Foto do Autor"/>
              <div class="post-user-info">
                <p class="post-username">${nome}</p>
                <p class="post-date">${date}</p>
              </div>
            </div>
      
            <div class="post-body">
              ${imageUrl ? `<img src="${imageUrl}" alt="Imagem do Post" class="post-image" />` : ''}
              ${post.videoUrl ? `
                <video controls class="post-video">
                  <source src="${post.videoUrl}" type="video/mp4">
                  Seu navegador não suporta vídeos.
                </video>
              ` : ''}
            </div>
      
            <div class="post-footer">
              <p class="post-description">${post.description || ''}</p>
              <div class="post-actions">
                <button class="action-btn like-btn">Curtir</button>
                <button class="action-btn comment-btn">Comentar</button>
                <button class="action-btn share-btn">Compartilhar</button>
              </div>
            </div>
          `;

            postsContainer.appendChild(postElement);
        });
    }

    fetchUserPosts();
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("uploadForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Impede o envio padrão para poder manipular a resposta

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData
            });

            if (response.ok) {
                form.reset(); // Limpa o formulário após o envio
                fetchUserPosts(); // Atualiza os posts sem precisar recarregar a página

            } else {
                console.error("Erro ao criar postagem");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    });
});
