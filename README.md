# VideoFlow

Uma aplicação web moderna e segura para download de vídeos usando yt-dlp e FFmpeg.

## 🚀 Funcionalidades

- Interface web moderna com glassmorphism e dark mode
- Download de vídeos em múltiplas qualidades (360p, 480p, 720p, 1080p, 1440p, 4K)
- Extração de áudio em MP3
- Validação robusta de URLs com proteção SSRF
- Rate limiting para prevenir abuso
- Timeout configurável para downloads
- Limite de downloads simultâneos
- Gerenciamento automático de arquivos temporários
- Segurança com headers apropriados
- API REST com Fastify
- TypeScript em modo strict

## 🛠 Tecnologias

### Backend
- Node.js
- TypeScript
- Fastify
- Zod (validação)
- yt-dlp
- FFmpeg

### Frontend
- HTML5
- CSS3 (com glassmorphism e animações)
- JavaScript (ES6+)

### Infraestrutura
- Docker
- Git

## 📋 Pré-requisitos

- Node.js 18+
- npm
- yt-dlp instalado no sistema
- FFmpeg instalado no sistema

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd VideoFlow
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário.

## ⚙️ Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NODE_ENV` | Ambiente (development/production) | `development` |
| `PORT` | Porta do servidor | `8082` |
| `YTDLP_PATH` | Caminho do executável yt-dlp | `yt-dlp` |
| `FFMPEG_PATH` | Caminho do executável FFmpeg | `ffmpeg` |
| `MAX_DOWNLOAD_SIZE_MB` | Tamanho máximo do download (MB) | `500` |
| `MAX_DOWNLOAD_TIME_SECONDS` | Tempo máximo do download (segundos) | `600` |
| `MAX_CONCURRENT_DOWNLOADS` | Downloads simultâneos máximos | `2` |
| `RATE_LIMIT_MAX` | Limite de requisições por janela | `5` |
| `RATE_LIMIT_WINDOW` | Janela de rate limiting (ms) | `60000` |
| `CORS_ORIGIN` | Origem permitida para CORS | `http://localhost:8082` |

## 🚀 Execução Local

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm run start
```

### Testes
```bash
npm run test
```

### Lint
```bash
npm run lint
```

### Formatação
```bash
npm run format
```

## 📡 API

### GET /health
Health check do servidor.

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/download
Inicia um download.

**Request Body:**
```json
{
  "url": "https://example.com/video",
  "quality": "720"
}
```

**Qualidades permitidas:**
- `360` - 360p
- `480` - 480p
- `720` - 720p
- `1080` - 1080p
- `1440` - 1440p
- `2160` - 4K
- `mp3` - Áudio MP3

**Resposta:**
- Success: Retorna o arquivo de vídeo/áudio
- Error: Retorna JSON com erro

**Erro Response:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_URL",
    "message": "Invalid or blocked URL"
  }
}
```

## 🔒 Segurança

### Implementações de Segurança

- **Validação de URL**: Bloqueia localhost, IPs privados e hosts reservados
- **SSRF Protection**: Previne Server-Side Request Forgery
- **Rate Limiting**: 5 requisições por minuto por IP
- **Timeout**: Downloads encerrados após 10 minutos
- **Tamanho Máximo**: Arquivos maiores que 500MB são rejeitados
- **Downloads Simultâneos**: Máximo de 2 downloads por vez
- **Headers de Segurança**: CSP, X-Frame-Options, HSTS
- **CORS Configurável**: Origem específica, não wildcard
- **Execução Segura**: Uso de `spawn()` com argumentos separados
- **Arquivos Temporários**: Diretórios únicos com UUID
- **Limpeza Automática**: Arquivos temporários removidos após uso

### Códigos de Erro

- `INVALID_URL` - URL inválida ou bloqueada
- `INVALID_QUALITY` - Qualidade inválida
- `RATE_LIMITED` - Limite de requisições excedido
- `DOWNLOAD_TIMEOUT` - Tempo limite excedido
- `DOWNLOAD_FAILED` - Falha no download
- `FILE_TOO_LARGE` - Arquivo muito grande
- `SERVER_ERROR` - Erro interno do servidor
- `SSRF_BLOCKED` - URL bloqueada por proteção SSRF

## 🐳 Docker

### Build
```bash
docker build -t videoflow .
```

### Run
```bash
docker run -p 8082:8082 \
  -e YTDLP_PATH=/usr/local/bin/yt-dlp \
  -e FFMPEG_PATH=/usr/bin/ffmpeg \
  videoflow
```

### Docker Compose
```bash
docker-compose up
```

## 📁 Estrutura do Projeto

```
VideoFlow/
├── src/
│   ├── config/
│   │   └── env.ts
│   ├── controllers/
│   │   └── download.controller.ts
│   ├── routes/
│   │   ├── health.routes.ts
│   │   └── download.routes.ts
│   ├── services/
│   │   ├── download.service.ts
│   │   ├── ytdlp.service.ts
│   │   └── ffmpeg.service.ts
│   ├── schemas/
│   │   └── download.schema.ts
│   ├── types/
│   │   └── download.types.ts
│   ├── utils/
│   │   └── logger.ts
│   ├── app.ts
│   └── server.ts
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── downloads/
├── tests/
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

## 🌐 Deploy

### Render

1. Configure as variáveis de ambiente no Render
2. Faça push do código para GitHub
3. Conecte o repositório no Render
4. Configure o build command: `npm run build`
5. Configure o start command: `npm run start`

## ⚠️ Limitações

- Requer yt-dlp e FFmpeg instalados
- Depende da disponibilidade do site de origem
- Downloads podem falhar se o site bloquear bots
- Arquivos muito grandes podem causar timeout

## 📝 Licença

ISC

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## ⚠️ Aviso Legal

Use esta aplicação apenas para baixar conteúdo que você tem autorização para baixar. Respeite os termos de serviço das plataformas e os direitos autorais. Os desenvolvedores não são responsáveis pelo uso indevido desta ferramenta.
