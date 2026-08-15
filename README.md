# app-bebe/README.md

# Aplicação de Revelação de Sexo do Bebê

Esta é uma aplicação divertida e interativa para revelar o sexo de um bebê durante reuniões familiares. A experiência é projetada para ser emocionante e cheia de suspense, com um toque de humor relacionado à tecnologia.

## Requisitos

- Node.js (LTS)
- Docker (opcional, para execução em contêiner)

## Instalação

1. Clone o repositório:
   ```
   git clone <URL_DO_REPOSITORIO>
   cd app-bebe
   ```

2. Instale as dependências:
   ```
   npm install
   ```

## Execução Local

Para executar a aplicação localmente, use o seguinte comando:
```
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

## Execução com Docker

Para construir e executar a aplicação usando Docker, siga os passos abaixo:

1. Construa a imagem Docker:
   ```
   docker build -t app-bebe .
   ```

2. Execute o contêiner:
   ```
   docker run -p 3000:3000 app-bebe
   ```

A aplicação estará disponível em `http://localhost:3000`.

## Implantação no Vercel

Para implantar a aplicação no Vercel:

1. Conecte seu repositório GitHub ao Vercel.
2. O Vercel detectará automaticamente a configuração e implantará a aplicação.

## Configuração do Sexo do Bebê

Ao abrir a aplicação pela primeira vez, você verá a tela de configuração. Escolha o resultado da revelação clicando em um dos botões:

- 👦 MENINO
- 👧 MENINA

A escolha será salva no `localStorage`.

## Como Iniciar a Apresentação

Após a configuração, clique no botão "INICIAR REVELAÇÃO" para começar a apresentação. A navegação entre os estágios é feita manualmente, clicando no botão "CONTINUAR".

## Como Redefinir a Configuração

Para redefinir a configuração e permitir uma nova escolha, você pode usar a função de redefinição disponível na interface.

## Como Funciona o localStorage

A aplicação utiliza o `localStorage` para salvar as seguintes informações:

- `sexoBebe`: O sexo escolhido (menino ou menina).
- `somAtivado`: O estado do som (ativado ou desativado).

## Limitações Conhecidas

- A aplicação depende de interações do usuário para iniciar sons devido a restrições de autoplay em navegadores.
- A experiência pode variar em diferentes dispositivos móveis.

## Estrutura do Projeto

```
app-bebe/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── package.json
├── Dockerfile
├── .dockerignore
├── vercel.json
└── README.md
```