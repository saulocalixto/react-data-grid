# PROJETO EXEMPLO

Projeto para testar a Grid Wow!

## Ajustes

Após o comando `npm install` ser rodado é criada a pasta *node_modules*. No caso a react-data-grid-wow está com um pequeno defeito, que para funcionar é preciso modificar um arquivo dentro desta pasta.

Então, dentro da pasta *node_modules* encontre a pasta *react-data-grid-wow*. Dentro do arquivo *index.js* substitua a linha existente pel seguinte:

```
module.exports = require('./dist/react-data-grid');

```