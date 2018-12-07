# WOW GROUP MANAGER

O **WoW Group Manager**, como o próprio nome diz, é um gerenciador de grupos para o jogo [World of Warcraft](https://worldofwarcraft.com). O gerenciador é construído sob uma tabela (ou grid) que ajuda jogadores a terem uma visualização das informações que julga relevantes sobre os membros do seu grupo.

Com ele, é possível criar diferentes grupos, onde cada um possui uma lista de personagens e que, ao ser preenchida, faz requisições à API oficial do jogo para popular os diversos campos da tabela com informações de cada personagem (como os itens, a classe e até mesmo uma foto).
![Tela de personagens do grupo](https://i.imgur.com/3oVQYcv.png)

## Live demo
Para acessar um site de demonstração do WoW Group Manager, clique [aqui](https://wow-group-manager-demo.netlify.com/).

## Instalação

 1. Clone o repositório do projeto.
 2. Após clonar o repositório, navegue
    até o diretório "*/react-data-grid-wow/projeto-exemplo/*" e execute
    o comando **npm install**.
 3. Em seguida, para que o WoW Group Manager funcione corretamente, é necessário
    modificar o arquivo ***index.js*** que foi gerado dentro do diretório ***react-data-grid- wow***, que por sua vez foi gerado dentro do diretório ***node_modules***.
    diretório. Abra o arquivo com um editor de texto/código e substitua o seu conteúdo pelo seguinte:
    ```
    module.exports = require('./dist/react-data-grid');
    ```
 4. Por fim, depois que as dependências do projeto foram obtidas, ainda dentro
    do diretório acima, execute o comando **npm start**.

## Ajustes
Após o comando `npm install` ser rodado é criada a pasta *node_modules*. No caso a react-data-grid-wow está com um pequeno defeito, que para funcionar é preciso modificar um arquivo dentro desta pasta.

Então, dentro da pasta *node_modules* encontre a pasta *react-data-grid-wow*. Dentro do arquivo *index.js* substitua a linha existente pelo seguinte:

```
module.exports = require('./dist/react-data-grid');

```
