function getConfirmationEmailTemplate(confirmationToken) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f9f9f9;
                  margin: 0;
                  padding: 0;
                  color: #333;
              }
              .container {
                  max-width: 600px;
                  margin: 30px auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
              .header img {
                  width: 50px;
                  height: auto;
                  margin-bottom: 20px;
              }
              .content {
                  line-height: 1.6;
              }
              .button {
                  display: inline-block;
                  margin: 20px 0;
                  padding: 10px 20px;
                  color: #ffffff;
                  background-color: #007bff;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
              }
              .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #888;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="content">
                  <h1>Confirmação de Cadastro</h1>
                  <p>Obrigado por se cadastrar! Clique no botão abaixo para confirmar seu e-mail.</p>
                  <a href="http://localhost:8081/auth/confirm?token=${confirmationToken}" class="button">Confirmar E-mail</a>
              </div>
              <div class="footer">
                  <p>Se você não requisitou este e-mail, por favor, ignore.</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }
  
  module.exports = getConfirmationEmailTemplate;
  