# URL Shortener API

API para encurtamento de URLs com autenticação opcional e contagem de cliques.  
Desenvolvida com **NestJS**, **TypeORM** e **PostgreSQL**, com suporte a **Docker** e **JWT**.

## Funcionalidades
- Criação de URLs encurtadas (autenticadas ou anônimas)  
- Redirecionamento automático para URLs originais  
- Contagem de cliques em tempo real  
- Autenticação JWT para usuários  
- Gerenciamento de URLs por usuário  
- Soft delete para URLs removidas  
- Documentação interativa com Swagger  
- Logs estruturados para auditoria e debugging  

## Stack Tecnológica
- **Node.js** - Runtime JavaScript  
- **NestJS** - Framework para aplicações escaláveis  
- **TypeORM** - ORM para TypeScript com suporte a PostgreSQL  
- **PostgreSQL** - Banco de dados relacional robusto  
- **Docker** - Containerização para banco e aplicação  
- **JWT** - Autenticação stateless  
- **Swagger** - Documentação interativa  
- **Jest** - Testes unitários  

## Instalação e Configuração

### 1. Instalar dependências
```bash
pnpm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
```
> Edite `.env` conforme seu ambiente.

### 3. Subir banco de dados (Docker)
```bash
docker compose up db
```

### 4. Rodar migrations
```bash
pnpm run migration:run
```

### 5. Iniciar a aplicação
```bash
pnpm run start:dev
```

## Variáveis de Ambiente
```bash
# App
PORT=3000
LOG_LEVEL=debug
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

## Endpoints da API

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

## Documentação com Swagger
Acesse:
```
http://localhost:3000/api
```

## Exemplos de Uso

### Criar URL Encurtada
```bash
curl -X POST http://localhost:3000/urls   -H "Authorization: Bearer YOUR_JWT_TOKEN"   -H "Content-Type: application/json"   -d '{"longUrl": "https://exemplo.com/pagina-muito-longa"}'
```

### Redirecionar URL
```bash
curl -L http://localhost:3000/redirect/abc123
```

## Estrutura do Projeto
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

## Testes
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

## Logs Estruturados
A aplicação utiliza logs estruturados para facilitar monitoramento e debugging.

**Exemplo de log de criação:**
```json
{
  "event": "create_url:start",
  "longUrl": "https://exemplo.com",
  "userId": 1
}
```

**Exemplo de log de erro:**
```json
{
  "event": "redirect:not_found",
  "shortCode": "abc123"
}
```

## Docker
### Apenas banco de dados
```bash
docker compose up db
```

### Aplicação completa
```bash
docker compose --profile all up
```

### Parar todos os serviços
```bash
docker compose down
```

## Scripts Disponíveis
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
```