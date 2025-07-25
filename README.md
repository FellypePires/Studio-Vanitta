# Vánitta Studio - Sistema de Gestão

Este projeto é uma aplicação web completa para gerenciar as operações de um Studio Beleza), incluindo controle de caixa, gestão de funcionárias, serviços agendados, salários e relatórios financeiros.

## 🌟 Funcionalidades

*   **Login:** Acesso restrito ao sistema (usuário: `admin`, senha: `123456`).
*   **Dashboard:** Visão geral com indicadores-chave como saldo em caixa, entradas, saídas, número de funcionárias e serviços.
*   **Controle de Caixa:** Registro de movimentações financeiras (entradas e saídas) com data, hora, descrição e valor.
*   **Gestão de Funcionárias:** Cadastro, edição e exclusão de funcionárias, incluindo nome, cargo, salário, data de admissão e contato via WhatsApp.
*   **Serviços Agendados:** Registro de serviços prestados ou agendados, com nome do serviço, preço, data, hora e informações do cliente (opcional). Permite dar baixa nos serviços concluídos.
*   **Calendário:** Visualização dos serviços agendados em um calendário mensal.
*   **Relatórios Financeiros:** Geração de relatórios de entradas, saídas e saldo por mês/ano.
*   **Salários:** Visualização dos salários das funcionárias cadastradas.
*   **Tema Claro/Escuro:** Alternância entre temas claro e escuro para melhor conforto visual.
*   **Persistência Local:** Os dados são salvos no `localStorage` do navegador para manter as informações entre sessões.

## 🛠️ Tecnologias Utilizadas

*   **HTML5**
*   **CSS3**
*   **JavaScript (Vanilla)**
*   **Bootstrap 5.3** (para estilização e componentes)
*   **Bootstrap Icons 1.10** (para ícones)

## ▶️ Como Executar

1.  **Clone ou Baixe o Repositório:** Obtenha os arquivos do projeto.
2.  **Abra o Arquivo HTML:** Localize o arquivo `index.html` e abra-o em um navegador web moderno (Chrome, Firefox, Edge, etc.).
3.  **Faça Login:** Utilize o usuário `admin` e a senha `123456`.

## 📝 Estrutura do Projeto

O projeto é composto por um único arquivo HTML que contém todo o código necessário:

*   `index.html`, `styles.css`, `script.js`

## 📚 Documentação das Funcionalidades

### Login
*   Acesso protegido com credenciais fixas.
*   Interface de login responsiva.

### Dashboard
*   Cards com informações resumidas:
    *   Saldo em caixa
    *   Total de entradas
    *   Total de saídas
    *   Número de funcionárias
    *   Serviços agendados
    *   Serviços concluídos

### Controle de Caixa
*   Registro de movimentações financeiras.
*   Tipos: Entrada/Saída.
*   Campos: Valor, descrição, data e hora.
*   Listagem em tabela com opção de exclusão.
*   Valores exibidos com formatação monetária (R$).

### Gestão de Funcionárias
*   Cadastro de novas funcionárias.
*   Edição de informações existentes.
*   Exclusão de funcionárias.
*   Campos: Nome, cargo, salário, data de admissão e WhatsApp.
*   Integração com WhatsApp para contato direto.
*   Exibição em cards com informações detalhadas.

### Serviços Agendados
*   Agendamento de novos serviços.
*   Registro de informações do cliente (opcional).
*   Status: Agendado/Concluído.
*   Ação de "Dar Baixa" que marca o serviço como concluído e gera uma entrada automática no caixa.
*   Exclusão de serviços.
*   Integração com WhatsApp do cliente.
*   Exibição em cards com status destacado.

### Calendário
*   Visualização mensal dos serviços agendados.
*   Navegação entre meses.
*   Destaque para dias com serviços agendados.
*   Informações resumidas diretamente no calendário.

### Relatórios Financeiros
*   Filtros por mês e ano.
*   Exibição de totais de entradas, saídas e saldo.
*   Detalhamento das movimentações filtradas em tabela.

### Salários
*   Listagem dos salários cadastrados das funcionárias.

### Tema
*   Alternância entre tema claro e escuro.
*   Persistência da preferência do usuário durante a sessão.

### Persistência
*   Armazenamento automático a cada 30 segundos.
*   Carregamento dos dados ao iniciar o sistema.
*   Uso do `localStorage` do navegador.

