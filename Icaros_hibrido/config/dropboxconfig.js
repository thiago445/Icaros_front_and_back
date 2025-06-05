const axios = require('axios');
require('dotenv').config();

const DROPBOX_API_URL = 'https://api.dropbox.com/oauth2/token';

// Função para obter um novo access token usando o refresh token
async function refreshDropboxToken() {
  try {
    const response = await axios.post(DROPBOX_API_URL, null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: process.env.DROPBOX_REFRESH_TOKEN,
        client_id: process.env.DROPBOX_CLIENT_ID,
        client_secret: process.env.DROPBOX_CLIENT_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const newAccessToken = response.data.access_token;


    process.env.DROPBOX_ACCESS_TOKEN = newAccessToken;
    console.log('Access token renovado com sucesso!');



  } catch (error) {
    console.error('Erro ao renovar o token:', error.response ? error.response.data : error.message);
  }
}


async function checkAndRefreshToken() {

  // Neste exemplo, vou chamar a função de renovação diretamente
  await refreshDropboxToken();
}

module.exports = {
  checkAndRefreshToken,
};
