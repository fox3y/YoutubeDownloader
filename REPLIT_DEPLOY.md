# Deploy com Ngrok - VideoFlow

## 🚀 Como usar Ngrok (Mais simples, sem cadastro)

### Passo 1: Baixar ngrok
1. Acesse https://ngrok.com/download
2. Baixe para Windows
3. Extraia o arquivo zip

### Passo 2: Rodar o projeto localmente
```bash
cd C:\Users\Usuario\VideoFlow
npm run dev
```

### Passo 3: Iniciar ngrok
Em outro terminal:
```bash
cd C:\Users\Usuario\VideoFlow
ngrok http 8083
```

### Passo 4: Usar a URL gerada
O ngrok vai mostrar uma URL tipo:
```
https://abc123-def456.ngrok-free.app
```

Esta URL:
- ✅ É pública e acessível de qualquer lugar
- ✅ Tem HTTPS automático
- ✅ Não precisa de cadastro
- ✅ Usa recursos da sua máquina
- ❌ Precisa da sua máquina ligada

## ⚠️ Limitações
- A URL muda cada vez que você reinicia o ngrok
- Precisa manter o projeto rodando localmente
- Não funciona se desligar o computador

## 💡 Se quiser hosting estável (grátis)
Use Railway (https://railway.app):
1. Login com GitHub
2. New Project → Deploy from GitHub
3. Selecione `fox3y/YoutubeDownloader`
4. Deploy automático
