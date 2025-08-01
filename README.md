# Sistema de Formulário React

Sistema completo de formulário com login usando CPF e data de nascimento, validações robustas, preenchimento automático de CEP e upload de arquivos PDF.

## 🚀 Funcionalidades

- ✅ **Login com CPF e Data de Nascimento**
- ✅ **Formulário Completo de Dados Pessoais**
- ✅ **Preenchimento Automático de CEP** (API ViaCEP)
- ✅ **Upload de Arquivos PDF** (Drag & Drop)
- ✅ **Sistema de Múltiplos Cursos e Formações**
- ✅ **Validações Completas em Tempo Real**
- ✅ **Tela de Sucesso com Dados Protegidos**
- ✅ **Interface Responsiva e Moderna**

## 🛠️ Tecnologias

- **React 19** - Framework principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Shadcn/UI** - Componentes de interface
- **React Router** - Navegação
- **Axios** - Requisições HTTP
- **Lucide React** - Ícones

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/sistema-formulario.git
   cd sistema-formulario
   ```

2. **Instale as dependências**
   ```bash
   npm install --force
   # ou
   pnpm install --force
   # ou
   yarn install
   ```

3. **Execute o projeto**
   ```bash
   npm run dev
   # ou
   pnpm run dev
   # ou
   yarn dev
   ```

4. **Acesse no navegador**
   ```
   http://localhost:5173
   ```

## 🎯 Como Usar

### 1. Login
- Digite um **CPF válido** (ex: 123.456.789-09)
- Digite uma **data de nascimento** (idade mínima: 16 anos)
- Clique em **Entrar**

### 2. Preenchimento do Formulário
- **Informações Pessoais**: Nome, RG, estado civil, etc.
- **Contato**: Telefones e emails
- **Endereço**: Digite o CEP e veja o preenchimento automático
- **Profissional**: Profissão, empresa, escolaridade
- **Vídeo**: Link opcional para YouTube/Vimeo
- **Arquivos**: Upload de PDFs (drag & drop)
- **Cursos**: Adicione quantos cursos desejar

### 3. Envio
- Clique em **Enviar Formulário**
- Visualize os dados na **Tela de Sucesso**
- Dados ficam protegidos contra edição

## 📋 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                 # Componentes Shadcn/UI
│   ├── FileUploader.jsx    # Upload de arquivos
│   └── CursosFormacoes.jsx # Gerenciamento de cursos
├── pages/
│   ├── LoginPage.jsx       # Página de login
│   ├── FormularioPage.jsx  # Formulário principal
│   └── SucessoPage.jsx     # Página de sucesso
├── utils/
│   ├── validations.js      # Funções de validação
│   └── cepService.js       # Integração com ViaCEP
├── App.jsx                 # Componente principal
└── main.jsx                # Ponto de entrada
```

## ✨ Destaques

### Validações Implementadas
- **CPF**: Validação matemática completa com dígitos verificadores
- **Email**: Formato de email válido
- **CEP**: Formato brasileiro (XXXXX-XXX)
- **Data**: Idade mínima e datas válidas
- **URL**: Validação de links de vídeo
- **Arquivos**: Apenas PDF, máximo 10MB

### Preenchimento Automático
- **CEP**: Integração com API ViaCEP
- **Endereço**: Logradouro, bairro, cidade e estado preenchidos automaticamente
- **Login**: CPF e data de nascimento passados para o formulário

### Interface Moderna
- **Design Responsivo**: Funciona em desktop e mobile
- **Componentes Profissionais**: Shadcn/UI
- **Animações**: Loading states e transições
- **Feedback Visual**: Campos com erro destacados
- **Ícones**: Lucide React para melhor UX

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview do build
npm run lint     # Verificação de código
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Se você tiver alguma dúvida ou problema, abra uma [issue](https://github.com/seu-usuario/sistema-formulario/issues) no GitHub.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no GitHub!

