# simple-login

App with vulnerabilities for cybersecurity project 2

## Como rodar (com Docker, recomendado)

Pré-requisitos:
- Docker
- Docker Compose

Em caso de Linux, é necessário instalar o Docker Compose avulso. No Windows, o Docker Desktop vem com os dois, sendo apenas necessário possuir o WSL instalado.

Para executar a aplicação:
- Escreva no terminal na pasta desse mesmo README: `docker compose up -d`

Subirá 3 serviços:
- database: banco de dados MySQL 9.3 com credenciais root:root e porta 3306 aberta (para fins de debug e migração de banco de dados manual)
- backendvuln: back-end vulnerável aberto na porta 8080
- backend: back-end reforçado aberto na porta 8081

Você precisará rodar o script do banco de dados respectivo ao back-end que você irá usar. Nas pastas `./packages/backendvuln` e `./packages/backend` tem um script SQL chamado `database.sql`, conecte no banco de dados com seu explorador de banco de dados preferido e rode o script.

Ambos back-ends possuem front-ends integrados feitos em React com TypeScript, para acessá-los é apenas necessário colocar no navegador: [http://localhost:8080 (vulnerável)](http://localhost:8080) ou [http://localhost:8081 (reforçado)](http://localhost:8081).

## Como rodar (sem Docker)

Pré-requisitos:
- MySQL
- Node 22+
- Yarn (`npm i -g yarn`)

Passo a passo:
- Abra um terminal na pasta do back-end desejado (`./packages/backendvuln` é o vulnerável, `./packages/backend` é o reforçado)
- Execute `yarn` para baixar as dependências
- Copie o `.env.example` para `.env`
- Edite os conteúdos do `.env` para coincidir com seus dados, mantenha o DB_NAME como está
- Entre no seu banco de dados e execute o script SQL `database.sql`
- Execute o servidor com `yarn start`

## Como testar - Postman (ou Hoppscotch Desktop)

Na pasta `./docs/postman`, existe o arquivo de coleção exportado (`simple-login.postman_collection.json`) e o arquivo de ambiente (`simple-login.postman_environment.json`), importe os dois nos Postman (ou no Hoppscotch Desktop) e usufrua dos endpoints.

Para fazer request para os endpoints `POST /register` e `POST /login` do backend reforçado, é necessário chamar a rota `GET /csrf-token` primeiro, pegar o `_csrf` dos cookies e colocar na variável do ambiente `csrfToken`.
