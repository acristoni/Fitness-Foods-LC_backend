<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Open Food Facts Project

Projeto desenvolvido em NestJs, utilizando o Atlas do MongoDB, para persistência de dados, consumindo os dados da Open Food Facts.

## Installation & Running the app

```bash
# Is need API_KEY to access: CHAVE_SECRETA

# production mode
$ sudo docker-compose up  --build
```

## Tests / GET & PUT

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

## Passos do desenvolvimento

1. Configurei o MongoDB Atlas, assim como o projeto NestJs, para poder interagir com a coleção responsável por persistir os dados.
2. Preparei os métodos para baixar os dados das listas, convertê-los para um objeto e salvá-los no modelo requerido. 
3. Preparei endpoint para consulta de todos os produtos salvos, com paginação. E configurei o Swagger para documentar a API pelo modelo da OpenAPI.
4. Preparei endpoint para retornar status da api, conexão com bd, tempo online e uso da memória pela aplicação.
5. Preparei o endpoint para consulta de um produto pelo seu código.
6. Preparei o endpoint para delete deum produto.
7. Desenvolvi o endpoint para atualização de produto pelo cliente.
8. Preparei os métodos para atualizar e configurei o CRON da aplicação.
9. Criada collection para salvar quando os processos da aplicação acontecem e métodos para salvar o horário do CRON e refatoração do endpoint de estado da api para trazer a informação do horpario do último CRON
10. Testes automatizados do controller interaginsdo com o service, mockando todas as interações com o banco de dados.
11. Configuração de um sistema de api key.

## License

Nest is [MIT licensed](LICENSE).

### This is a challenge by Coodesh
