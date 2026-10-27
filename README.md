
# 🏃‍♀️ Corrida Solidária

Projeto desenvolvido como parte de uma avaliação prática de front-end utilizando Angular e TypeScript.

A proposta foi criar um sistema para gerenciar as inscrições da **5ª Corrida Solidária da Vila Esperança**, permitindo cadastrar participantes, visualizar suas informações, editar e cancelar inscrições.

## 💻 Tecnologias utilizadas

- Angular 22 (CLI 22.2.4)
- TypeScript
- HTML5 e CSS3
- Angular Signals
- Angular Router
- Vitest
- LocalStorage

## ✨ Funcionalidades

- 📝 Cadastro de participantes nos percursos de 5 km e 10 km
- 👥 Listagem das inscrições realizadas
- 🔎 Pesquisa por nome ou e-mail
- 📋 Visualização dos detalhes de cada inscrição
- ✏️ Edição dos dados dos participantes
- 🗑️ Cancelamento de inscrições com confirmação
- 📊 Contadores de inscritos por percurso
- ✅ Mensagens de sucesso após cadastro e edição
- 📱 Layout responsivo

## 📌 Regras de negócio

Para garantir que as inscrições sejam feitas corretamente, implementei algumas validações:

- O nome precisa ter entre 3 e 100 caracteres;
- O e-mail deve ser válido e não pode estar cadastrado em outra inscrição;
- A idade mínima para participar é de 14 anos;
- Menores de 18 anos só podem participar dos 5 km;
- A idade é calculada considerando a data da corrida, **14/03/2027**;
- A categoria é definida automaticamente de acordo com a idade do participante.

As categorias são: **Juvenil, Adulto, Master e Senior**.

## 🚀 Como executar

Clone o repositório:

    git clone https://github.com/Whoeduma/avaliacao-aptidao-frontend.git

Entre na pasta:

    cd avaliacao-aptidao-frontend

Instale as dependências:

    npm install

Inicie o projeto:

    npm start

Acesse no navegador:

**http://localhost:4200**

## 🧪 Testes

Os testes automatizados são executados com Vitest.

Para rodar os testes:

    npm test -- --watch=false

Para gerar o build de produção:

    npm run build

## 💾 Armazenamento

As inscrições são salvas no **LocalStorage** do navegador.

Como o projeto não utiliza um back-end, os dados ficam armazenados localmente e continuam disponíveis mesmo após atualizar a página.

## 🎨 Sobre o desenvolvimento

Durante o desenvolvimento, procurei organizar o código separando os componentes, serviços, modelos e regras de negócio.

Também dei atenção às validações, à responsividade e à experiência de quem vai utilizar o sistema, principalmente nos formulários e nas ações de edição e cancelamento.

A ideia foi deixar a aplicação simples de usar, mas com as funcionalidades necessárias para gerenciar as inscrições.

---

Feito por **Eduarda Martins** 💜
