## Tecnologias utilizadas

- Use TypeScript sempre que possível.
- Prefira React + Vite para o frontend, quando não houver outra tecnologia definida.
- Use ESLint e Prettier para manter o código padronizado.
- Mantenha arquivos, pastas, variáveis e componentes com nomes claros e consistentes.
- Evite adicionar bibliotecas desnecessárias.

## Arquitetura do sistema

- Organize o projeto por responsabilidade, como components, hooks, services, utils e types.
- Separe lógica de interface, regras de negócio e acesso a dados.
- Mantenha componentes pequenos e reutilizáveis.
- Evite lógica complexa dentro do componente; mova para hooks ou utilitários.
- Centralize chamadas de API em services.
- Prefira código simples, legível e fácil de manter.

## Estilização do frontend

- Mantenha uma aparência visual consistente.
- Priorize acessibilidade: contraste, foco visível e navegação clara.
- Use responsividade mobile-first.
- Evite estilos inline quando houver uma solução melhor organizada.
- Mantenha o código visual consistente entre telas e componentes.

## Segurança

- Nunca exponha secrets, tokens ou chaves no frontend.
- Valide entradas do usuário antes de processar ou enviar dados.
- Não confie apenas no cliente para autenticação ou autorização.
- Trate erros sem expor informações sensíveis.
- Sempre use boas práticas de segurança no backend.

## Boas práticas gerais

- Escreva código limpo e fácil de revisar.
- Evite duplicação de código.
- Prefira soluções simples e previsíveis.
- Respeite a convenção já usada no projeto.
- Documente partes complexas apenas quando necessário.