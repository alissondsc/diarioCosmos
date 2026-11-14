# diarioCosmos

Aplicação web para consultar a Astronomy Picture of the Day (APOD) da NASA.

## Requisitos

- Node.js 20.6 ou superior
- Uma chave da API da NASA obtida em https://api.nasa.gov/

## Como executar

1. Copie `.env.example` para `.env` e preencha `NASA_API_KEY` com sua chave.
2. No PowerShell, na pasta do projeto, inicie o servidor:

```powershell
node --env-file=.env server.js
```

Abra http://127.0.0.1:8000 no navegador. O arquivo `.env` é ignorado pelo Git; a chave fica no servidor e não é enviada ao navegador.

## Funcionalidades

- Mostra título, data, imagem ou vídeo e explicação do APOD.
- Permite escolher outra data, sem aceitar datas futuras.
- Informa quando está carregando ou quando ocorre um erro.
- Detecta a resposta de imagem padrão da NASA e orienta a verificar a chave.
- Funciona em celular e desktop.
