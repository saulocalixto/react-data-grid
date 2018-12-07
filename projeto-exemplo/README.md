# WOW GROUP MANAGER

O **WoW Group Manager**, como o próprio nome diz, é um gerenciador de grupos para o jogo [World of Warcraft](https://worldofwarcraft.com). O gerenciador é construído sob uma tabela (ou grid) que ajuda jogadores a terem uma visualização das informações que julga relevantes sobre os membros do seu grupo.

## Ajustes

Após o comando `npm install` ser rodado é criada a pasta *node_modules*. No caso a react-data-grid-wow está com um pequeno defeito, que para funcionar é preciso modificar um arquivo dentro desta pasta.

Então, dentro da pasta *node_modules* encontre a pasta *react-data-grid-wow*. Dentro do arquivo *index.js* substitua a linha existente pel seguinte:

```
module.exports = require('./dist/react-data-grid');

```
