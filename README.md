
# 🏃‍♀️ Corrida Solidária

Projeto desenvolvido como parte de uma **avaliação prática de front-end**, utilizando Angular e TypeScript.

A aplicação foi criada para gerenciar as inscrições da **5ª Corrida Solidária da Vila Esperança**, permitindo cadastrar participantes, consultar inscrições, visualizar detalhes, editar dados e cancelar inscrições.

---

## 🚀 Como rodar

### Pré-requisitos

Para executar o projeto, é necessário ter instalado:

- Node.js
- npm

O projeto utiliza **Angular 21**.

### 1. Clone o repositório

```bash
git clone https://github.com/Whoeduma/avaliacao-aptidao-frontend.git
```

### 2. Entre na pasta do projeto

```bash
cd avaliacao-aptidao-frontend
```

### 3. Instale as dependências

```bash
npm ci
```

### 4. Inicie a aplicação

```bash
npm start
```

Depois, acesse:

http://localhost:4200

### 5. Execute os testes

```bash
npm test -- --watch=false
```

### 6. Gere o build de produção

```bash
npm run build
```

---

## 💻 Tecnologias utilizadas

- Angular 21
- TypeScript
- HTML5 e CSS3
- Angular Signals
- Angular Router
- Vitest
- LocalStorage

---

## 📌 Entendimento do problema

A Associação da Vila Esperança precisa gerenciar as inscrições da **5ª Corrida Solidária**, que possui percursos de **5 km e 10 km**.

O sistema permite cadastrar e consultar participantes, visualizar e editar suas informações e cancelar inscrições. Cada e-mail identifica uma única inscrição. A idade e a categoria do participante são calculadas automaticamente com base na data oficial da corrida.

Os dados são armazenados localmente no navegador, sem integração com servidor.

---

## ✨ Funcionalidades

- 📝 Cadastro de participantes nos percursos de 5 km e 10 km
- 👥 Listagem das inscrições realizadas
- 🔎 Pesquisa por nome ou e-mail
- 📋 Visualização dos detalhes de cada inscrição
- ✏️ Edição dos dados dos participantes
- 🗑️ Cancelamento de inscrição com confirmação
- 📊 Contadores de inscritos por percurso
- ✅ Mensagens de sucesso após cadastro e edição
- ⚠️ Tratamento de problemas relacionados ao armazenamento local
- 🚫 Página para rotas não encontradas
- 📱 Layout responsivo

---

## 📋 Regras implementadas

| Regra | Fonte no pedido | Onde foi implementada |
| --- | --- | --- |
| Nome deve possuir entre 3 e 100 caracteres | Enunciado/regulamento | Formulário e validações da inscrição |
| E-mail deve possuir formato válido | Enunciado | Formulário e serviço de inscrição |
| Cada e-mail pode identificar apenas uma inscrição | Enunciado | `InscricaoService` |
| E-mail é normalizado antes da comparação | Decisão de implementação | `InscricaoService` |
| Idade mínima para participação é de 14 anos | Regulamento | Regra de validação de idade |
| Menores de 18 anos só podem participar dos 5 km | Regulamento | Regra de validação do percurso |
| Idade é calculada considerando a data oficial da corrida | Regulamento | Cálculo de idade |
| Data oficial da corrida é 14/03/2027 | Regulamento oficial | Constante `DATA_PROVA` |
| Categoria é definida automaticamente pela idade | Regulamento | Regra de cálculo de categoria |
| E-mail não pode ser alterado durante a edição | Decisão baseada no identificador da inscrição | Fluxo de edição |
| Cancelamento remove somente a inscrição selecionada | Enunciado | `InscricaoService` |
| Inscrições são persistidas no navegador | Requisito da aplicação sem back-end | `LocalStorage` |

### Categorias

A categoria do participante é calculada automaticamente de acordo com sua idade completa na data da prova.

As categorias utilizadas são:

- **Juvenil**
- **Adulto**
- **Master**
- **Senior**

---

## ⚖️ Conflitos encontrados e decisões

Durante a análise do material fornecido, foram identificados alguns pontos que exigiram decisões de implementação.

### 1. Data da corrida

O áudio menciona a data **13/03/2027**, enquanto o regulamento oficial informa **14/03/2027**.

**Decisão:** utilizar **14/03/2027**, por ser a data presente no regulamento oficial.

### 2. Cálculo da idade

A idade poderia ser interpretada apenas pela diferença entre os anos de nascimento e da corrida.

**Decisão:** calcular a **idade completa do participante na data da prova**, considerando dia, mês e ano.

### 3. E-mail compartilhado

Existe uma sugestão de que familiares possam compartilhar o mesmo endereço de e-mail, mas a regra estabelece que cada e-mail identifica uma única inscrição.

**Decisão:** manter o **e-mail como identificador único** de cada inscrição.

Na comparação dos endereços, são normalizados apenas:

- Espaços externos;
- Letras maiúsculas e minúsculas.

Não são realizadas alterações específicas de provedores, como remover pontos de endereços Gmail.

### 4. Alteração do e-mail

Como o e-mail funciona como identificador da inscrição, permitir sua alteração poderia comprometer a identificação do registro.

**Decisão:** o e-mail não pode ser alterado durante a edição.

### 5. Dados iniciais

Não foi identificada necessidade de carregar participantes fictícios ou registros de demonstração.

**Decisão:** a aplicação é iniciada sem inscrições cadastradas.

---

## ❓ Perguntas que eu faria ao cliente

Alguns pontos poderiam ser confirmados em uma evolução do sistema:

- Existe necessidade futura de permitir inscrições de familiares utilizando o mesmo e-mail?
- Caso isso seja necessário, cada participante deverá possuir outro identificador único?
- Em uma versão futura com servidor, haverá autenticação ou conta de usuário?
- As inscrições deverão ser sincronizadas entre diferentes dispositivos?
- Haverá necessidade de confirmação da inscrição por e-mail?

Enquanto essas definições não existem, a aplicação considera **um e-mail para cada inscrição** e mantém os dados somente no navegador utilizado.

---

## 🚫 Fora de escopo

Os seguintes recursos não foram implementados por não fazerem parte do escopo atual da avaliação:

- Envio de e-mails;
- Pagamentos ou Pix;
- Autenticação de usuários;
- Integração com API ou servidor;
- Banco de dados remoto;
- Sincronização entre navegadores ou dispositivos.

A aplicação funciona inteiramente no front-end.

---

## 💾 Armazenamento

As inscrições são armazenadas no **LocalStorage** do navegador.

Isso permite que os registros continuem disponíveis mesmo após atualizar ou fechar a página.

Como não existe integração com um servidor, os dados ficam vinculados ao navegador e ao dispositivo onde foram cadastrados.

A aplicação também possui tratamento para situações em que o armazenamento esteja indisponível, corrompido ou apresente falhas.

---

## 🧪 Verificações realizadas

Para validar o funcionamento da aplicação, foram desenvolvidos testes automatizados para os principais fluxos e regras de negócio.

### Testes automatizados

Os testes incluem cenários relacionados a:

- Cadastro de inscrições;
- Edição de participantes;
- Cancelamento de inscrições;
- Validação de e-mail duplicado;
- Normalização de e-mail;
- Cálculo de idade;
- Idade mínima de participação;
- Restrição dos 10 km para menores de 18 anos;
- Cálculo considerando a data da prova;
- Persistência no LocalStorage;
- Armazenamento indisponível ou corrompido;
- Tratamento de erros de armazenamento;
- Configuração das rotas;
- Rotas inexistentes.

Para executar:

```bash
npm test -- --watch=false
```

### Build de produção

Para verificar a compilação da aplicação:

```bash
npm run build
```

### Verificações manuais

Os principais cenários para conferência manual são:

- Cadastro de participante;
- Visualização da inscrição;
- Edição dos dados;
- Tentativa de edição inválida;
- Cancelamento com confirmação;
- Pesquisa por nome e e-mail;
- Atualização da página mantendo os registros;
- Acesso direto às rotas;
- Acesso a uma rota inexistente;
- Comportamento do layout em telas menores;
- Fronteiras de idade das categorias e dos percursos.

---

## 🗂️ Organização do projeto

O código foi organizado buscando separar as responsabilidades da aplicação entre:

- **Componentes:** responsáveis pela interface e interação com o usuário.
- **Serviços:** responsáveis pelas operações e regras relacionadas às inscrições.
- **Modelos:** responsáveis pela estrutura dos dados.
- **Rotas:** responsáveis pela navegação entre as páginas.
- **Regras de negócio:** responsáveis pelas validações e cálculos.

Essa separação facilita a manutenção do projeto e evita concentrar toda a lógica diretamente nos componentes.

---

## 🎨 Sobre o desenvolvimento

Durante o desenvolvimento, procurei manter a aplicação simples de utilizar e, ao mesmo tempo, atender às regras definidas para a corrida.

Dei atenção principalmente às **regras de negócio, validações, persistência dos dados, responsividade e experiência de uso** nos fluxos de cadastro, consulta, edição e cancelamento.

As decisões tomadas em pontos de conflito foram documentadas neste README para deixar claro não apenas **o que foi implementado**, mas também **por que determinadas escolhas foram feitas**.

---

## 👩‍💻 Autoria

Desenvolvido por **Eduarda Martins** como parte da avaliação prática de front-end.
