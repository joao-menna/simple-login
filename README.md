# simple-login

App with vulnerabilities for cybersecurity project 2

## Como rodar

Pré-requisitos:
- Docker
- Docker Compose

Em caso de Linux, é necessário instalar o Docker Compose avulso. No Windows, o Docker Desktop vem com os dois, sendo apenas necessário possuir o WSL instalado.

Para executar a aplicação:
- Escreva no terminal na pasta desse mesmo README: `docker compose up -d`

Subirá 3 serviços:
- database: banco de dados MySQL 9.3 com credenciais root:root e porta 3306 aberta (para fins de debug)
- backendvuln: back-end vulnerável aberto na porta 8080
- backend: back-end reforçado aberto na porta 8081

Ambos back-ends possuem front-ends integrados feitos em React com TypeScript, para acessá-los é apenas necessário colocar no navegador: [http://localhost:8080 (vulnerável)](http://localhost:8080) ou [http://localhost:8081 (reforçado)](http://localhost:8081).

