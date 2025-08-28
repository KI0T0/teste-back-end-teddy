# Sistema de Autenticação

Este módulo implementa um sistema completo de autenticação com JWT para a aplicação.

## Estrutura

```
src/auth/
├── auth.module.ts          # Módulo principal de autenticação
├── auth.controller.ts      # Controller com endpoints de registro e login
├── auth.service.ts         # Serviço com lógica de negócio
├── jwt.strategy.ts         # Estratégia Passport para validação JWT
├── guards/
│   └── jwt-auth.guard.ts  # Guard para proteger rotas
└── dto/
    ├── register.dto.ts     # DTO para registro
    └── login.dto.ts        # DTO para login
```

## Endpoints

### POST /auth/register
Registra um novo usuário.

**Status:** 201 (Created)

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Sucesso):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Response (Erro - Email duplicado):**
```json
{
  "statusCode": 409,
  "message": "User already exists",
  "error": "Conflict"
}
```

### POST /auth/login
Autentica um usuário existente.

**Status:** 200 (OK)

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Sucesso):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Erro - Credenciais inválidas):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

## Proteção de Rotas

Para proteger uma rota, use o decorator `@UseGuards(JwtAuthGuard)`:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('protected')
export class ProtectedController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getProtectedData() {
    return { message: 'This is protected data' };
  }
}
```

## Variáveis de Ambiente

### JWT_SECRET
**Obrigatória** - Chave secreta para assinatura dos tokens JWT.

```env
JWT_SECRET=your-super-secret-key-here
```

**Recomendações de Segurança:**
- Use uma chave com pelo menos 32 caracteres
- Gere uma chave aleatória e única
- Nunca compartilhe ou commite esta chave no repositório
- Use variáveis de ambiente diferentes para cada ambiente (dev, staging, prod)

**Exemplo de geração de chave segura:**
```bash
# Gerar chave aleatória de 64 caracteres
openssl rand -base64 64
```

### Configuração JWT
- **Algoritmo:** HS256 (HMAC SHA-256)
- **Expiração:** 24 horas
- **Formato:** Bearer Token

## Logs

O sistema inclui logs detalhados para todos os eventos principais:

- ✅ Tentativas de registro
- ✅ Registros bem-sucedidos
- ✅ Falhas no registro (email duplicado)
- ✅ Tentativas de login
- ✅ Logins bem-sucedidos
- ✅ Falhas no login (usuário não encontrado, senha inválida)
- ✅ Geração de tokens
- ✅ Hash de senhas

## Funcionalidades

- ✅ Registro de usuários com hash de senha
- ✅ Validação de email único (409 Conflict)
- ✅ Login com validação de credenciais
- ✅ Geração de tokens JWT (HS256)
- ✅ Validação de tokens Bearer
- ✅ Proteção de rotas com guards
- ✅ Validação de DTOs com class-validator
- ✅ Integração com TypeORM e PostgreSQL
- ✅ Sistema de logging completo
- ✅ Status codes HTTP corretos
- ✅ Resposta padronizada para login ({ access_token })
