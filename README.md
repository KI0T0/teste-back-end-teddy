<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# URL Shortener API

API para encurtamento de URLs com autenticação opcional e contagem de cliques.

## 🚀 Documentação da API

A documentação completa da API está disponível através do Swagger:

**📚 Swagger UI:** http://localhost:3000/api

## 🛠️ Configuração do Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- PostgreSQL
- pnpm

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd teste-back-end-teddy

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp env.example .env
# Edite o arquivo .env com suas configurações

# Execute as migrações
pnpm run migration:execute

# Inicie o servidor
pnpm run start:dev
```

## 📝 Variáveis de Ambiente

```bash
# App
PORT=3000
LOG_LEVEL=debug  # debug, info, warn, error
BASE_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=changeme
DB_NAME=shortener_dev

# Auth
JWT_SECRET=changeme
JWT_EXPIRES_IN=24h

# URLs
SHORT_CODE_LENGTH=6
ALLOW_CUSTOM_ALIAS=false
```

## 🔍 Logs da Aplicação

A aplicação utiliza logs estruturados para monitoramento e debugging. Exemplos de logs:

### Criação de URL
```json
{
  "event": "create_url:start",
  "longUrl": "https://exemplo.com",
  "userId": 123
}

{
  "event": "create_url:success",
  "urlId": 456,
  "shortCode": "abc123",
  "userId": 123
}
```

### Redirecionamento
```json
{
  "event": "redirect:hit",
  "shortCode": "abc123",
  "urlId": 456
}

{
  "event": "redirect:not_found",
  "shortCode": "invalid"
}
```

### Autenticação
```json
{
  "event": "auth:register",
  "userId": 123
}

{
  "event": "auth:login",
  "userId": 123
}

{
  "event": "auth:login_failed",
  "email": "usuario@exemplo.com"
}
```

## 🏗️ Estrutura do Projeto

```
src/
├── auth/           # Autenticação e autorização
├── urls/           # Gerenciamento de URLs
├── redirect/       # Redirecionamento de URLs
├── users/          # Gerenciamento de usuários
├── database/       # Configuração do banco de dados
└── utils/          # Utilitários e decorators
```

## 🧪 Testes

```bash
# Testes unitários
pnpm run test

# Testes em modo watch
pnpm run test:watch

# Cobertura de testes
pnpm run test:cov

# Testes e2e
pnpm run test:e2e
```

## 🚀 Comandos Disponíveis

```bash
# Desenvolvimento
pnpm run start:dev      # Modo desenvolvimento com hot reload
pnpm run start:debug    # Modo debug

# Produção
pnpm run build          # Compilar o projeto
pnpm run start:prod     # Executar em produção

# Migrações
pnpm run migration:generate  # Gerar nova migração
pnpm run migration:run       # Executar migrações
pnpm run migration:revert    # Reverter última migração

# Qualidade de código
pnpm run lint           # Verificar código
pnpm run lint:fix       # Corrigir problemas automaticamente
pnpm run format         # Formatar código
```

## 📊 Endpoints Principais

- `POST /urls` - Criar URL curta
- `GET /urls` - Listar URLs do usuário (autenticado)
- `PATCH /urls/:id` - Atualizar URL (autenticado)
- `DELETE /urls/:id` - Remover URL (autenticado)
- `GET /:shortCode` - Redirecionar para URL original
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Autenticar usuário

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para endpoints protegidos, inclua o token no header:

```
Authorization: Bearer <seu-token-jwt>
```

## 📈 Monitoramento

Os logs são estruturados e incluem:
- **info**: Eventos de negócio bem-sucedidos
- **warn**: Comportamentos inesperados (não críticos)
- **error**: Falhas inesperadas e erros do sistema

Configure o nível de log através da variável `LOG_LEVEL` no arquivo `.env`.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
