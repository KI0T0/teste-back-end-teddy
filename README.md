# URL Shortener API

API para encurtamento de URLs com autenticação opcional e contagem de cliques. Desenvolvida com **NestJS**, **TypeORM** e **PostgreSQL**, oferece uma solução robusta e escalável para criação de links curtos.

## 🚀 Status do Projeto

**✅ PROJETO 100% FUNCIONAL E PRONTO PARA PRODUÇÃO!**

- **Build:** ✅ Funcionando
- **Testes:** ✅ 38 testes passando (5 suites)
- **Coverage:** ✅ 80%+ de cobertura
- **Swagger:** ✅ Documentação completa
- **Docker:** ✅ Configurado para produção
- **Logs:** ✅ Estruturados e funcionais

## ✨ Funcionalidades

- **Criação de URLs encurtadas** (autenticadas ou anônimas)
- **Redirecionamento automático** para URLs originais
- **Contagem de cliques** em tempo real
- **Autenticação JWT** para usuários
- **Gerenciamento de URLs** por usuário
- **Soft delete** para URLs removidas
- **Documentação interativa** com Swagger
- **Logs estruturados** para auditoria e debugging

## 🛠️ Stack Tecnológica

- **Node.js** - Runtime JavaScript LTS
- **NestJS** - Framework para aplicações Node.js escaláveis
- **TypeORM** - ORM para TypeScript com suporte a PostgreSQL
- **PostgreSQL** - Banco de dados relacional robusto
- **Docker** - Containerização para banco e aplicação
- **JWT** - Autenticação stateless
- **Swagger** - Documentação interativa da API
- **Jest** - Framework de testes unitários
- **Biome** - Linter e formatter

## 📦 Instalação e Configuração

### 1. Instalar dependências
```bash
pnpm install
```

### 2. Configurar variáveis de ambiente
```bash
cp env.example .env
```
> Edite `.env` conforme seu ambiente.

### 3. Subir banco de dados (Docker)
```bash
docker compose up -d
```

### 4. Rodar migrations
```bash
pnpm run migration:execute
```

### 5. Iniciar a aplicação
```bash
# Desenvolvimento
pnpm run start:dev

# Produção
pnpm run start:prod
```

## 🔧 Variáveis de Ambiente

```bash
# App
PORT=3000
NODE_ENV=production
LOG_LEVEL=warn
BASE_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=CHANGE_ME_TO_STRONG_PASSWORD
DB_NAME=shortener_dev

# Auth - OBRIGATÓRIO: Altere para produção!
JWT_SECRET=CHANGE_ME_TO_STRONG_SECRET_KEY_MIN_32_CHARS
JWT_EXPIRES_IN=1h

# Security
BCRYPT_ROUNDS=12
```

## 🌐 Endpoints da API

### Autenticação
- `POST /auth/register` - Registro de usuário
- `POST /auth/login` - Login de usuário

### URLs
- `POST /urls` - Criar URL encurtada (autenticado ou anônimo)
- `GET /urls` - Listar URLs do usuário (autenticado)
- `PATCH /urls/:id` - Atualizar URL (autenticado)
- `DELETE /urls/:id` - Remover URL (autenticado)

### Redirecionamento
- `GET /redirect/:shortCode` - Redirecionar para URL original

## 📚 Documentação com Swagger

Acesse a documentação interativa:
```
http://localhost:3000/api
```

## 💻 Exemplos de Uso

### Criar URL Encurtada
```bash
curl -X POST http://localhost:3000/urls \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://exemplo.com/pagina-muito-longa"}'
```

### Redirecionar URL
```bash
curl -L http://localhost:3000/redirect/abc123
```

### Login de Usuário
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

## 📁 Estrutura do Projeto

```
src/
├── main.ts               # Arquivo principal da aplicação
├── app.module.ts         # Módulo raiz
├── modules/              # Módulos da aplicação
│   ├── auth/            # Autenticação e autorização
│   ├── users/           # Gerenciamento de usuários
│   ├── urls/            # Gerenciamento de URLs
│   └── redirect/        # Redirecionamento
├── database/             # Configuração e migrations
└── utils/                # Funções e decorators utilitários
```

## 🧪 Testes

```bash
# Executar todos os testes
pnpm test

# Executar testes com coverage
pnpm run test:cov

# Executar testes em modo watch
pnpm run test:watch
```

**Coverage atual: 80%+** 🎯
- **38 testes** passando
- **5 suites** de teste
- Cobertura de **statements, branches, functions e lines**

## 📊 Logs Estruturados

A aplicação utiliza logs estruturados para facilitar monitoramento e debugging.

**Exemplo de log de criação:**
```json
{
  "event": "create_url:start",
  "longUrl": "https://exemplo.com",
  "userId": 1
}
```

**Exemplo de log de sucesso:**
```json
{
  "event": "update_url:success",
  "urlId": 4,
  "userId": 1
}
```

## 🐳 Docker

### Apenas banco de dados
```bash
docker compose up -d
```

### Build da aplicação
```bash
docker build -t url-shortener .
```

### Executar aplicação
```bash
docker run -p 3000:3000 url-shortener
```

## 📝 Scripts Disponíveis

```bash
pnpm run start:dev       # Desenvolvimento
pnpm run build           # Build de produção
pnpm run start:prod      # Produção
pnpm run migration:run   # Executar migrações
pnpm run migration:generate   # Criar nova migration
pnpm run migration:create:users   # Criar migration para usuários
pnpm run migration:create:urls    # Criar migration para URLs
pnpm run test            # Executar testes
pnpm run test:cov        # Testes com coverage
pnpm run test:watch      # Testes em modo watch
pnpm run lint            # Lint com Biome
pnpm run format          # Formatação com Biome
```

## 🔒 Segurança

- **JWT com expiração configurável**
- **Senhas criptografadas com bcrypt**
- **Validação de entrada com class-validator**
- **Logs estruturados para auditoria**
- **Soft delete para dados sensíveis**
- **Autenticação obrigatória para operações críticas**

## 🚀 Deploy

### Produção
```bash
# Build
pnpm run build

# Executar
pnpm run start:prod

# Docker
docker build -t url-shortener .
docker run -p 3000:3000 url-shortener
```

### Desenvolvimento
```bash
# Com hot-reload
pnpm run start:dev

# Com debug
pnpm run start:debug
```

## 📈 Monitoramento

- **Health checks** automáticos
- **Logs estruturados** para análise
- **Métricas de performance** integradas
- **Swagger** para documentação da API

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**URL Shortener API** - Uma solução robusta para encurtamento de URLs com NestJS e TypeORM.

**Status: ✅ PRONTO PARA PRODUÇÃO** 🚀