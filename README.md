# Guia para instalar o projeto e rodar no Docker

**Recomendo usar o Github Desktop para envios de commit mais fáceis.**
1. Baixe e instale Git e GitHub Desktop
2. Nesta página, clique em "Code" e depois em "Open with GitHub Desktop".
3. Escolha uma pasta local para os arquivos desse projeto ficarem.
Depois de fazer uma alteração, você pode fazer o commit delas pelo GitHub Desktop.

**Depois de ter feito o anterior, você terá que instalar o projeto na sua própria maquina**

~a pasta node_modules tem muitos arquivos para ser viável enviá-la aqui~

1. Vá para a pasta do frontend para instalar o React
- Abra o terminal (seja por CMD, Docker, ou qualquer outra coisa, funciona de qualquer jeito) e insira as duas linhas de código a seguir:

`cd Desktop\project\frontend`

`npm install`

2. Depois disso retorne para a pasta do projeto como um todo para criar as imagens e contêiners do Docker:

`cd ..`

`docker-compose up --build`

Isso felizmente instalará o projeto de acordo com os arquivos presentes aqui e você poderá nos ajudar a construí-lo!

## A pagina não abre direito
Se por acaso a página do frontend não funcionar, deve ser por algum conflito com a porta 3000, que foi a recomendada para fazer o projeto.
~não sei porque o professor n sugeriu a porta 3001 ou algo assim mas é o que é~

Nesse caso, eu resetaria o conteiner do projeto, o que normalmente resolvia o problema para mim.
![image](https://github.com/user-attachments/assets/dc3a4576-8bbc-4506-b2b7-323d836a0aca)
