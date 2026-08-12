# Deploy no Replit - VideoFlow

## 🚀 Como fazer deploy no Replit (Gratuito com HTTPS)

### Passo 1: Criar conta no Replit

1. Acesse https://replit.com
2. Clique em "Sign up"
3. Crie uma conta gratuita

### Passo 2: Criar novo Repl

1. Clique em "+ Create Repl"
2. Selecione "Import from GitHub"
3. Cole: `https://github.com/fox3y/YoutubeDownloader`
4. Clique em "Import"

### Passo 3: Configurar o Replit

O Replit vai detectar automaticamente os arquivos de configuração:
- `.replit` - Configuração de execução
- `replit.nix` - Dependências do sistema

### Passo 4: Rodar o projeto

1. Clique no botão verde "Run"
2. O Replit vai:
   - Instalar Node.js
   - Instalar FFmpeg
   - Instalar yt-dlp via pip
   - Buildar o projeto TypeScript
   - Iniciar o servidor

### Passo 5: Acessar a aplicação

1. O Replit vai mostrar uma URL tipo:
   `https://youtubedownloader-fox3y.replit.co`

2. Esta URL já tem:
   - ✅ HTTPS automático
   - ✅ Acesso público
   - ✅ Domínio gratuito

### Passo 6: Compartilhar

A URL do Replit pode ser compartilhada diretamente:
- `https://youtubedownloader-fox3y.replit.co`

## ⚠️ Limitações do plano gratuito

- **Recursos**: CPU e RAM limitados
- **Sleep**: O projeto "dorme" após inatividade
- **Reativação**: Demora alguns segundos para acordar
- **Timeout**: Downloads muito longos podem ser interrompidos

## 💡 Alternativa: Ngrok (Mais rápido)

Se quiser algo mais rápido para testar:

### 1. Instalar ngrok
- Baixe de https://ngrok.com/download
- Extraia e rode o executável

### 2. Rodar localmente
```bash
cd VideoFlow
npm run dev
```

### 3. Iniciar ngrok
```bash
ngrok http 8083
```

### 4. Usar a URL
O ngrok vai gerar uma URL tipo:
`https://abc123.ngrok.io`

Esta URL:
- ✅ É gratuita
- ✅ Tem HTTPS
- ✅ Funciona imediatamente
- ✅ Usa os recursos da sua máquina
- ❌ Precisa da sua máquina ligada

## 🎯 Recomendação

**Para testar rápido:** Ngrok (5 minutos)
**Para hosting estável:** Replit (10 minutos)

## 🔧 Solução de problemas

### Se o Replit não iniciar:
1. Verifique o console por erros
2. Tente rodar manualmente no Shell do Replit:
   ```bash
   pip install yt-dlp
   npm install
   npm run build
   npm start
   ```

### Se yt-dlp não funcionar:
No Shell do Replit:
```bash
pip install --user yt-dlp
export PATH=$PATH:~/.local/bin
```

### Se FFmpeg não funcionar:
No Shell do Replit:
```bash
apt-get update
apt-get install -y ffmpeg
```
