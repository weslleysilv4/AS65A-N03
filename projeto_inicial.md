<div align="center">

**UNIVERSIDADE TECNOLÓGICA FEDERAL DO PARANÁ - UTFPR**
**CURSO SUPERIOR DE TECNOLOGIA EM ANÁLISE E**
**DESENVOLVIMENTO DE SISTEMAS**

<br>
<br>
<br>
<br>
<br>
<br>

DIEGO KIYOSHI MOURA OTANI - RA 2575256
<br>
IGOR LUIZ RIBEIRO SANTOS - RA 2065894
<br>
ITALO PEREIRA VENTURA - RA 2467259
<br>
VICTOR GABRIEL LUCIO - RA 2575302
<br>
WESLLEY SILVA - RA 2410257

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

**CERTIFICADORA DE COMPETÊNCIA IDENTITÁRIA - AS65A - GRUPO 03**

**PROJETO INICIAL**

</div>

<br>
<br>
<br>
<br>
# Sumário

1.  [Descrever o sistema proposto](#1-descrever-o-sistema-proposto)
2.  [Especificar quais seriam os usuários esperados para o sistema](#2-especificar-quais-seriam-os-usuários-esperados-para-o-sistema)
3.  [Elencar o que ele pretende resolver/atender](#3-elencar-o-que-ele-pretende-resolveratender)
4.  [Apresentar quais serão os requisitos a serem implementados](#4-apresentar-quais-serão-os-requisitos-a-serem-implementados)
    *   [4.1 Requisitos Funcionais](#41-requisitos-funcionais)
    *   [4.2 Requisitos de Segurança](#42-requisitos-de-segurança)
    *   [4.3 Requisitos de Usabilidade e Design](#43-requisitos-de-usabilidade-e-design)
5.  [Listar as tecnologias a serem utilizadas](#5-listar-as-tecnologias-a-serem-utilizadas)
6.  [Identificar qual o repositório (link) no GitHub será usado para armazenar os artefatos do projeto](#6-identificar-qual-o-repositório-link-no-github-será-usado-para-armazenar-os-artefatos-do-projeto)
7.  [Explicar como será feita a divisão do desenvolvimento entre os membros do grupo](#7-explicar-como-será-feita-a-divisão-do-desenvolvimento-entre-os-membros-do-grupo)
8.  [Apresentar o Cronograma](#8-apresentar-o-cronograma)
9.  [Considerações Adicionais de Desenvolvimento](#9-considerações-adicionais-de-desenvolvimento)

---

# 1. Sistema proposto

O sistema proposto é uma plataforma de "Cadastro e Distribuição de Notícias". Trata-se de uma aplicação web projetada para permitir o gerenciamento completo do ciclo de vida de notícias, desde sua criação, edição e categorização, até sua publicação e divulgação. O sistema incluirá funcionalidades para upload de diversos tipos de mídia, agendamento de publicações com data de expiração, um fluxo de revisão e aprovação por administradores, além de ferramentas de busca e análise de desempenho das notícias divulgadas. O foco é fornecer uma solução robusta e intuitiva para a gestão de conteúdo informativo, especificamente para o Projeto de Extensão ELLP.

# 2. Usuários esperados para o sistema

Os usuários esperados para o sistema são:

*   **Administradores (ADM Revisor):** Membros do Projeto de Extensão ELLP com permissões totais no sistema, incluindo a capacidade de cadastrar, editar, aprovar/reprovar notícias submetidas por publicadores, gerenciar categorias, e visualizar estatísticas.
*   **Publicadores (Publisher):** Membros do Projeto de Extensão ELLP autorizados a cadastrar e editar notícias. As notícias criadas ou editadas por publicadores necessitarão de aprovação de um Administrador antes de serem publicadas.
*   **Público Geral:** Visitantes da página web que consumirão as notícias publicadas.

# 3. Objetivo do Sistema

O sistema "Cadastro e Distribuição de Notícias" pretende resolver as seguintes necessidades e desafios do Projeto de Extensão ELLP:

*   **Centralização e Padronização:** Oferecer uma plataforma única para o cadastro, armazenamento e gerenciamento de todas as notícias, garantindo um formato consistente e facilitando o acesso à informação.
*   **Eficiência na Criação de Conteúdo:** Simplificar o processo de criação e edição de notícias, permitindo a inclusão de diversos tipos de mídia (texto, imagens, vídeos, links) de forma intuitiva.
*   **Organização e Recuperação da Informação:** Melhorar a organização do conteúdo através de sistemas de categorização (ex: Cursos, Eventos, Contratação) e tags/palavras-chave, facilitando a navegação pelos usuários finais e a busca por notícias específicas (por assunto, categoria, tags, keywords).
*   **Controle de Qualidade:** Implementar um fluxo de revisão e aprovação, onde Administradores validam o conteúdo submetido por Publicadores, garantindo a qualidade, veracidade e adequação do conteúdo antes de sua publicação.
*   **Gestão Estratégica de Publicações:** Permitir o agendamento de publicações com data e hora específicas para entrada no ar (página principal ou página de notícias) e definição de tempo de expiração para as notícias.
*   **Ampla Divulgação:** Disponibilizar as notícias de forma acessível ao público através de uma página web dedicada, com display em formato de lista e links diretos para as notícias.
*   **Análise de Desempenho:** Fornecer dados e estatísticas sobre as notícias mais acessadas, permitindo avaliar o impacto da comunicação.
*   **Segurança e Controle de Acesso:** Garantir que apenas usuários autorizados, com papéis definidos (ADM, Publisher), possam criar, editar e gerenciar o conteúdo do sistema, protegendo a integridade das informações.
*   **Preservação de Dados:** Oferecer um sistema de backup com possibilidade de exportação para mídia física.

# 4. Requisitos a serem implementados

## 4.1 Requisitos Funcionais

**Módulo de Gerenciamento de Conteúdo (Notícias e Categorias):**
*   **RF001:** O sistema deve permitir que usuários com papel de "Publicador" ou "Administrador" cadastrem notícias.
    *   Uma notícia deve conter: título, texto, imagem(ns), vídeo(s) (links ou upload), links externos, data de cadastro da notícia (automática), data de publicação (agendável), tempo de expiração da notícia, identificação de quem cadastrou, identificação de quem revisou (se aplicável), data para entrada no ar na página principal, data para ir para a página de notícias com um link (título da notícia como link).
*   **RF002:** O sistema deve permitir que "Publicadores" e "Administradores" editem notícias existentes.
    *   Se uma notícia publicada for editada por um "Publicador", ela deve retornar ao estado de "pendente de aprovação" e ser revisada por um "Administrador" antes de ser republicada.
    *   "Administradores" podem editar e publicar diretamente.
*   **RF003:** O sistema deve permitir que "Administradores" cadastrem, editem e excluam categorias para as notícias (ex: Cursos, Eventos, Contratação).
*   **RF004:** Ao cadastrar/editar uma notícia, o usuário deve poder associá-la a uma ou mais categorias existentes e adicionar tags/palavras-chave (keywords).
*   **RF005:** O sistema deve permitir o agendamento da publicação de notícias, definindo data e hora para que entrem no ar.
*   **RF006:** O sistema deve permitir a definição de um tempo de expiração para as notícias, após o qual elas podem ser automaticamente arquivadas ou removidas da visualização principal.
*   **RF007:** Notícias criadas por "Publicadores" devem passar por um fluxo de aprovação por um "Administrador" antes de serem publicadas. "Administradores" podem aprovar ou reprovar notícias pendentes.

**Módulo de Divulgação e Acesso às Notícias (Página Web):**
*   **RF008:** O sistema deve exibir as notícias publicadas em uma página web pública.
    *   A exibição das notícias (tanto na página principal quanto na página de listagem de notícias) deve ser em formato de lista, onde cada item pode ser um link (título da notícia) para a visualização completa.
*   **RF009:** O sistema deve prover uma funcionalidade de busca que permita aos usuários encontrar notícias por: assunto (no título ou texto), categoria, tags e palavras-chave (keywords).
*   **RF010:** O sistema deve registrar e exibir para "Administradores" estatísticas sobre as notícias, indicando quais foram as mais acessadas.

## 4.2 Requisitos de Segurança

*   **RS001:** O sistema deve implementar um mecanismo de autenticação de usuários (login/senha) para acesso às áreas administrativas. As senhas devem ser armazenadas utilizando criptografia.
*   **RS002:** O sistema deve implementar um sistema de autorização baseado em papéis:
    *   **Administrador (ADM):** Acesso total a todas as funcionalidades do sistema, incluindo gerenciamento de usuários (se aplicável), gerenciamento de categorias, cadastro, edição, aprovação/reprovação de notícias, e visualização de estatísticas.
    *   **Publicador (Publisher):** Permissão para cadastrar e editar notícias (que irão para aprovação do ADM). Não pode aprovar notícias, nem gerenciar categorias ou usuários.
*   **RS003:** O sistema deve possuir uma funcionalidade de backup dos dados das notícias e configurações.
*   **RS004:** O sistema deve permitir a exportação dos dados de backup para uma mídia física (ex: arquivo para download que pode ser salvo em um PenDrive).

## 4.3 Requisitos de Usabilidade e Design

*   **RU001:** O design da interface da página web pública e do painel administrativo deve seguir as diretrizes de identidade visual do Projeto ELLP, utilizando predominantemente as cores Azul, Branco e Laranja (referência: [https://grupoellp.com.br/](https://grupoellp.com.br/)).
*   **RU002:** (Opcional) O sistema deve ter um design responsivo, adaptando-se a diferentes tamanhos de tela (desktops, tablets, smartphones).
*   **RU003:** A disposição das notícias na página pode considerar um layout em "Quadrantes de Notícias" ou blocos temáticos para melhor organização visual, se definido pela equipe de design.

# 5. Tecnologias a serem utilizadas

As seguintes tecnologias serão utilizadas no desenvolvimento do projeto:

*   **Linguagens de Programação:**
    *   TypeScript
*   **Framework Frontend:**
    *   Next.js
*   **Framework Backend:**
    *   Express.js (Node.js)
*   **Banco de Dados:**
    *   MongoDB (NoSQL)
*   **ORM/ODM:**
    *   PrismaORM
*   **Estilização CSS:**
    *   TailwindCSS
*   **Gerenciamento de Estado e Cache de Dados (Frontend):**
    *   Tanstack Query (anteriormente React Query)
*   **Validação de Dados:**
    *   Zod
*   **IDEs (Ambientes de Desenvolvimento Integrado):**
    *   Visual Studio Code (ou outra de preferência dos membros)
*   **Servidores:**
    *   Ambiente de desenvolvimento local (Node.js)
    *   Plataforma de hospedagem para deploy (ex: Vercel, Netlify, Heroku, AWS, etc. - a ser definido)
*   **Controle de Versão:**
    *   Git

# 6. Repositório GitHub

O repositório no GitHub para armazenamento dos artefatos do projeto é:
[https://github.com/weslleysilv4/AS65A-N03](https://github.com/weslleysilv4/AS65A-N03)

# 7. Divisão do desenvolvimento entre os membros do grupo

A divisão do desenvolvimento entre os membros do grupo será organizada da seguinte forma, visando otimizar a produtividade e aproveitar as habilidades de cada integrante:

*   **Victor Gabriel Lucio & Diego Kiyoshi Moura Otani:**
    *   **Foco Principal:** Desenvolvimento do **Backend**.
    *   **Responsabilidades:** Criação da API RESTful utilizando Express.js e TypeScript; modelagem e interação com o banco de dados MongoDB via PrismaORM (incluindo todos os atributos detalhados para notícias e categorias); implementação das regras de negócio para cadastro, edição, categorização, agendamento com expiração, fluxo de aprovação, busca avançada e estatísticas de notícias; desenvolvimento da lógica de autenticação (com criptografia) e autorização (papéis ADM e Publisher); implementação da funcionalidade de backup e exportação de dados; utilização de Zod para validação de dados de entrada e saída da API.

*   **Italo Pereira Ventura & Igor Luiz Ribeiro Santos:**
    *   **Foco Principal:** Desenvolvimento do **Frontend**.
    *   **Responsabilidades:** Construção da interface do usuário com Next.js e TypeScript; estilização dos componentes e páginas com TailwindCSS, seguindo a identidade visual do ELLP (cores Azul, Branco, Laranja) e considerando o layout em "Quadrantes de Notícias"; integração com a API backend utilizando Tanstack Query para gerenciamento de estado assíncrono e cache; criação de todas as telas necessárias para o fluxo do usuário (login, painel ADM/Publisher, cadastro/edição de notícias com todos os campos, listagem de notícias com filtros, visualização de notícias, gerenciamento de categorias, painel de estatísticas, interface para fluxo de aprovação); implementação da responsividade (opcional).

*   **Weslley Silva:**
    *   **Foco Principal:** **Gerenciamento de Projeto, DevOps e Integração**.
    *   **Responsabilidades:** Configuração inicial e manutenção do repositório no GitHub (gerenciamento de branches, pull requests, issues); auxílio na configuração do ambiente de desenvolvimento; suporte na integração entre Frontend e Backend; pesquisa e implementação de boas práticas de DevOps (como CI/CD, se aplicável ao escopo); atuação como revisor chave para garantir a coesão do código e da arquitetura do projeto; auxílio na documentação técnica geral; coordenação da discussão sobre a "Classe Pessoa Cadastro" com outros grupos.

**Responsabilidades Compartilhadas:**
*   **Testes:** Todos os membros serão responsáveis pela escrita de testes (unitários, de integração, e2e, conforme aplicável) para as funcionalidades que desenvolverem.
*   **Revisão de Código:** Todos os membros participarão ativamente das revisões de código (Pull Requests) dos colegas, visando garantir a qualidade, consistência e aderência aos padrões definidos.
*   **Documentação:** Cada membro será responsável por documentar as partes do sistema que desenvolver, incluindo comentários no código, READMEs de módulos específicos e contribuições para a documentação geral do projeto.
*   **Comunicação e Colaboração:** Todos os membros se comprometem a manter uma comunicação clara e constante, participando das reuniões de planejamento e acompanhamento, e utilizando as ferramentas de comunicação definidas pelo grupo.

Esta divisão busca equilibrar as cargas de trabalho e permitir que os membros se aprofundem em áreas específicas, ao mesmo tempo em que promove a colaboração e o conhecimento compartilhado sobre o projeto como um todo. Ajustes poderão ser feitos conforme a necessidade e o andamento do projeto, sempre em consenso com a equipe.

# 8. Cronograma

O desenvolvimento do projeto será realizado entre 21 de Maio de 2025 e 05 de Julho de 2025. O cronograma estimado é o seguinte:

*   **Semana 1 (21/05/2025 - 27/05/2025): Planejamento Detalhado e Configuração Inicial**
    *   Refinamento dos requisitos detalhados e casos de uso.
    *   Definição da arquitetura do sistema (Frontend e Backend).
    *   Configuração do ambiente de desenvolvimento (repositório, ferramentas, linters, etc.).
    *   Modelagem detalhada do banco de dados (MongoDB com Prisma) incluindo todos os campos de notícia e categorias.
    *   Desenvolvimento dos primeiros endpoints da API (autenticação, CRUD básico de categorias, CRUD inicial de notícias sem fluxos complexos).
    *   Criação da estrutura base do projeto Frontend (Next.js) e setup de TailwindCSS.

*   **Semana 2 (28/05/2025 - 03/06/2025): Desenvolvimento do Core Backend e Frontend Básico**
    *   **Backend:** Implementação das funcionalidades centrais de cadastro e edição de notícias (com todos os campos), incluindo upload de mídia. Desenvolvimento da lógica de autenticação (criptografia) e autorização (papéis ADM/Publisher).
    *   **Frontend:** Desenvolvimento das telas de login/autenticação. Início das telas de cadastro/edição de notícias (formulários completos) e listagem simples. Implementação da identidade visual ELLP.

*   **Semana 3 (04/06/2025 - 10/06/2025): Funcionalidades Avançadas e Integração Inicial**
    *   **Backend:** Implementação de agendamento de publicação, tempo de expiração, e sistema de busca avançada (assunto, categoria, tags, keywords). Desenvolvimento do fluxo de aprovação de notícias.
    *   **Frontend:** Desenvolvimento das funcionalidades de visualização detalhada de notícias, filtros de busca, interface para agendamento/expiração, e interface para o fluxo de aprovação.
    *   Integração contínua entre Frontend e Backend para as funcionalidades desenvolvidas.

*   **Semana 4 (11/06/2025 - 17/06/2025): Estatísticas, Backup e Refinamento UI**
    *   **Backend:** Implementação dos endpoints para estatísticas (notícias mais acessadas). Desenvolvimento da funcionalidade de backup e exportação de dados.
    *   **Frontend:** Implementação do painel de visualização de estatísticas. Refinamento da UI/UX, considerando "Quadrantes de Notícias" se aplicável.
    *   Foco em testes de integração e usabilidade das funcionalidades implementadas.

*   **Semana 5 (18/06/2025 - 24/06/2025): Testes Abrangentes e Refatoração**
    *   Execução de testes unitários, de integração e de interface do usuário.
    *   Identificação e correção de bugs.
    *   Refatoração de código para melhoria de performance, legibilidade e manutenibilidade.
    *   Revisão de segurança (autenticação, autorização, proteção de dados).

*   **Semana 6 (25/06/2025 - 01/07/2025): Finalização e Documentação**
    *   Finalização de todas as funcionalidades pendentes e ajustes (incluindo responsividade, se priorizada).
    *   Ajustes finais de UI/UX com base nos testes e feedback.
    *   Elaboração e revisão da documentação final do projeto (manual do usuário, documentação técnica).
    *   Preparação do ambiente para a entrega/apresentação.

*   **Semana 6.5 (02/07/2025 - 05/07/2025): Revisão Final e Entrega**
    *   Revisão geral do projeto pela equipe.
    *   Últimos ajustes e correções.
    *   Empacotamento e entrega final do projeto até **05/07/2025**.

Este cronograma é uma estimativa e poderá sofrer ajustes conforme o progresso do desenvolvimento e eventuais desafios encontrados. O acompanhamento será realizado através das metodologias ágeis definidas pelo grupo.

# 9. Considerações Adicionais de Desenvolvimento

*   **Colaboração Intergrupos:** Será realizada uma tentativa de colaboração com outros grupos do projeto para criar uma "Classe Pessoa Cadastro" comum ou um modelo de dados de usuário compartilhado, visando padronização e interoperabilidade, se viável e benéfico para os projetos envolvidos. Esta discussão será coordenada por Weslley Silva.
*   **Metodologia Ágil:** O grupo utilizará a metodologia híbrida Scrum/Kanban, conforme detalhado no documento "Planejamento Inicial - Grupo 3", para gerenciamento de tarefas, sprints semanais e acompanhamento contínuo.
