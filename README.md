
# 🏃‍♀️ Corrida Solidária

Projeto desenvolvido como parte de uma avaliação prática de front-end utilizando Angular e TypeScript.

A proposta foi criar um sistema para gerenciar as inscrições da **5ª Corrida Solidária da Vila Esperança**, permitindo cadastrar participantes, visualizar suas informações, editar e cancelar inscrições.

## 💻 Tecnologias utilizadas

- Angular 21
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

    npm ci

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

## Entendimento do problema

O sistema gerencia localmente inscrições para a 5ª Corrida Solidária da Vila Esperança. Cada e-mail identifica uma única inscrição. Nome, nascimento e percurso podem ser alterados; idade e categoria são sempre calculadas. O cancelamento remove apenas a inscrição selecionada. Não há integração com servidor.

## Fontes, conflitos e decisões

- Fontes: enunciado da avaliação, pacote do cliente e regulamento oficial incluídos no material fornecido.
- A data oficial da prova é **14/03/2027**. A menção a 13/03/2027 no áudio não prevalece sobre o regulamento.
- A categoria é calculada pela idade completa na data da prova, não apenas pelo ano de nascimento.
- A regra de e-mail único prevalece sobre a sugestão de compartilhar e-mail entre familiares. Normalizamos apenas espaços externos e maiúsculas/minúsculas; não removemos pontos de endereços Gmail.
- O e-mail é o identificador e não pode ser alterado na edição. A aplicação começa sem registros de demonstração.

## Perguntas ao cliente

- Há necessidade futura de inscrições familiares com e-mails próprios ou identificador adicional?
- Em uma futura versão com servidor, haverá conta de usuário e sincronização entre dispositivos?

## Fora de escopo

Envio de e-mails, pagamento/Pix, autenticação, integração com servidor e sincronização entre navegadores.

## Verificações realizadas

Executar `npm ci`, `npm run build` e `npm test -- --watch=false`. Os testes incluem regras de idade e percurso, CRUD, armazenamento corrompido/falho e configuração das rotas. Conferir também manualmente a navegação direta, atualização de página e layout em telas pequenas.
