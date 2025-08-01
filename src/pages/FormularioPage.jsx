import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import FileUploader from '../components/FileUploader'
import CursosFormacoes from '../components/CursosFormacoes'
import { validateCPF, formatCPF, validateEmail, validateCEP, formatCEP, validateVideoURL } from '../utils/validations'
import { fetchAddressByCEP } from '../utils/cepService'
import { User, Mail, MapPin, Briefcase, Video, GraduationCap, Save, RotateCcw, Loader2, Upload, Save as SaveIcon, Menu, X } from 'lucide-react'

// Chave para armazenar o rascunho no localStorage
const DRAFT_KEY = 'formulario_rascunho'

const FormularioPage = ({ userData, onSubmit }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isCepLoading, setIsCepLoading] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [errors, setErrors] = useState({})
  const [activeSection, setActiveSection] = useState('pessoal')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Estado inicial do formulário
  const initialFormData = {
    // Informações Pessoais
    nomeCompleto: '',
    cpf: userData?.cpf || '',
    rg: '',
    dataNascimento: userData?.dataNascimento || '',
    estadoCivil: '',
    nacionalidade: 'Brasileira',

    // Informações de Contato
    telefoneFixo: '',
    celular: '',
    email: '',
    emailAlternativo: '',

    // Endereço
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',

    // Informações Profissionais e Educacionais
    profissao: '',
    empresa: '',
    cargo: '',
    escolaridade: '',
    instituicaoEnsino: '',

    // Link do Vídeo Pessoal
    linkVideo: '',

    // Arquivos PDF
    arquivos: [],

    // Cursos e Formações
    cursos: [{
      id: Date.now(),
      nomeCurso: '',
      instituicao: '',
      dataConclusao: '',
      cargaHoraria: ''
    }]
  }

  const [formData, setFormData] = useState(initialFormData)

  // Carregar rascunho ao montar o componente
  useEffect(() => {
    const loadDraft = () => {
      try {
        const savedDraft = localStorage.getItem(DRAFT_KEY)
        if (savedDraft) {
          const parsedDraft = JSON.parse(savedDraft)

          // Verificar se o CPF do rascunho bate com o usuário atual
          if (userData?.cpf && parsedDraft.cpf !== userData.cpf) {
            localStorage.removeItem(DRAFT_KEY)
            return
          }

          setFormData(parsedDraft)
        }
      } catch (error) {
        console.error('Erro ao carregar rascunho:', error)
        localStorage.removeItem(DRAFT_KEY)
      }
    }

    loadDraft()
  }, [userData?.cpf])

  // Salvar rascunho sempre que o formulário mudar
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft()
    }, 30000) // Debounce de 30 segundos

    return () => clearTimeout(timer)
  }, //[formData]
  )

  const saveDraft = () => {
    setIsSavingDraft(true)
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
      setTimeout(() => setIsSavingDraft(false), 500) // Feedback visual
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error)
      setIsSavingDraft(false)
    }
  }

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    let formattedValue = value

    // Aplicar formatações específicas
    if (name === 'cpf') {
      formattedValue = formatCPF(value)
    } else if (name === 'cep') {
      formattedValue = formatCEP(value)
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }))

    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFilesChange = (files) => {
    setFormData(prev => ({ ...prev, arquivos: files }))
  }

  const handleCursosChange = (cursos) => {
    setFormData(prev => ({ ...prev, cursos }))
  }

  const handleCepBlur = async () => {
    if (formData.cep && validateCEP(formData.cep)) {
      setIsCepLoading(true)

      const result = await fetchAddressByCEP(formData.cep)

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          logradouro: result.data.logradouro,
          bairro: result.data.bairro,
          cidade: result.data.cidade,
          estado: result.data.estado
        }))
      } else {
        setErrors(prev => ({ ...prev, cep: result.error }))
      }

      setIsCepLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validações obrigatórias
    if (!formData.nomeCompleto) newErrors.nomeCompleto = 'Nome completo é obrigatório'
    if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório'
    else if (!validateCPF(formData.cpf)) newErrors.cpf = 'CPF inválido'

    if (!formData.rg) newErrors.rg = 'RG é obrigatório'
    if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória'
    if (!formData.estadoCivil) newErrors.estadoCivil = 'Estado civil é obrigatório'

    if (!formData.celular) newErrors.celular = 'Celular é obrigatório'
    if (!formData.email) newErrors.email = 'Email é obrigatório'
    else if (!validateEmail(formData.email)) newErrors.email = 'Email inválido'

    if (formData.emailAlternativo && !validateEmail(formData.emailAlternativo)) {
      newErrors.emailAlternativo = 'Email alternativo inválido'
    }

    if (!formData.cep) newErrors.cep = 'CEP é obrigatório'
    else if (!validateCEP(formData.cep)) newErrors.cep = 'CEP inválido'

    if (!formData.logradouro) newErrors.logradouro = 'Logradouro é obrigatório'
    if (!formData.numero) newErrors.numero = 'Número é obrigatório'
    if (!formData.bairro) newErrors.bairro = 'Bairro é obrigatório'
    if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatória'
    if (!formData.estado) newErrors.estado = 'Estado é obrigatório'

    if (!formData.profissao) newErrors.profissao = 'Profissão é obrigatória'
    if (!formData.escolaridade) newErrors.escolaridade = 'Escolaridade é obrigatória'
    if (!formData.linkVideo) newErrors.linkVideo = 'Link do vídeo é obrigatória'

    if (formData.linkVideo && !validateVideoURL(formData.linkVideo)) {
      newErrors.linkVideo = 'URL do vídeo inválida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll para o primeiro erro
      const firstErrorField = Object.keys(errors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setIsLoading(true)

    // Simular processamento
    setTimeout(() => {
      onSubmit(formData)
      clearDraft() // Limpar rascunho após envio bem-sucedido
      setIsLoading(false)
      navigate('/sucesso')
    }, 2000)
  }

  const handleClearForm = () => {
    setFormData(initialFormData)
    setErrors({})
    clearDraft()
  }

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    setMobileNavOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleLogout = () => {
    // Limpar dados de autenticação, tokens, etc.
    localStorage.clear();
    window.location.href = '/'; // Redireciona para a página de login
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl md:text-3xl font-bold text-center flex-1">
                Formulário de Cadastro
              </CardTitle>
              <button
                className="md:hidden p-2 rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
              >
                {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
            <p className="text-center text-blue-100 mt-2">
              Preencha todos os campos conforme necessário
            </p>
          </CardHeader>

          {/* Menu de navegação móvel */}
          {mobileNavOpen && (
            <div className="md:hidden bg-white border-b">
              <nav className="p-4 space-y-2">
                <button
                  onClick={() => scrollToSection('pessoal')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer ${activeSection === 'pessoal' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Informações Pessoais
                </button>
                <button
                  onClick={() => scrollToSection('contato')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer ${activeSection === 'contato' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Informações de Contato
                </button>
                <button
                  onClick={() => scrollToSection('endereco')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer ${activeSection === 'endereco' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Endereço
                </button>
                <button
                  onClick={() => scrollToSection('profissional')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer ${activeSection === 'profissional' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Informações Profissionais
                </button>
                <button
                  onClick={() => scrollToSection('video')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer ${activeSection === 'video' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Vídeo Pessoal
                </button>
                <button
                  onClick={() => scrollToSection('cursos')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer ${activeSection === 'cursos' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Cursos e Formações
                </button>
                <button
                  onClick={() => scrollToSection('documentos')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer ${activeSection === 'documentos' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Documentos
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer text-red-600 hover:bg-red-100"
                >
                  Sair
                </button>
              </nav>
            </div>
          )}

          <div className="flex flex-col md:flex-row">
            {/* Navegação lateral para desktop */}
            <div className="hidden md:block w-64 p-4 bg-white border-r overflow-y-auto">
              <h3 className="font-semibold text-lg mb-4 text-gray-700">Navegação</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => scrollToSection('pessoal')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer ${activeSection === 'pessoal' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Informações Pessoais
                </button>
                <button
                  onClick={() => scrollToSection('contato')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer ${activeSection === 'contato' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Informações de Contato
                </button>
                <button
                  onClick={() => scrollToSection('endereco')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer ${activeSection === 'endereco' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Endereço
                </button>
                <button
                  onClick={() => scrollToSection('profissional')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer ${activeSection === 'profissional' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Informações Profissionais
                </button>
                <button
                  onClick={() => scrollToSection('video')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer ${activeSection === 'video' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Vídeo Pessoal
                </button>
                <button
                  onClick={() => scrollToSection('cursos')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer ${activeSection === 'cursos' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Cursos e Formações
                </button>
                <button
                  onClick={() => scrollToSection('documentos')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer ${activeSection === 'documentos' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Documentos
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer text-red-600 hover:bg-red-100"
                >
                  Sair
                </button>

              </nav>
            </div>

            <CardContent className="flex-1 p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Informações Pessoais */}
                <div id="pessoal" className="scroll-mt-20">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Informações Pessoais</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomeCompleto" className="text-gray-700">Nome Completo *</Label>
                      <Input
                        id="nomeCompleto"
                        name="nomeCompleto"
                        value={formData.nomeCompleto}
                        onChange={handleInputChange}
                        className={errors.nomeCompleto ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        placeholder="Digite seu nome completo"
                      />
                      {errors.nomeCompleto && (
                        <p className="text-sm text-red-600">{errors.nomeCompleto}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpf" className="text-gray-700">CPF *</Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        className={errors.cpf ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        maxLength={14}
                        placeholder="000.000.000-00"
                        disabled
                      />
                      {errors.cpf && (
                        <p className="text-sm text-red-600">{errors.cpf}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rg" className="text-gray-700">RG *</Label>
                      <Input
                        id="rg"
                        name="rg"
                        value={formData.rg}
                        onChange={handleInputChange}
                        className={errors.rg ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        placeholder="Digite seu RG"
                      />
                      {errors.rg && (
                        <p className="text-sm text-red-600">{errors.rg}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataNascimento" className="text-gray-700">Data de Nascimento *</Label>
                      <Input
                        id="dataNascimento"
                        name="dataNascimento"
                        type="date"
                        value={formData.dataNascimento}
                        onChange={handleInputChange}
                        className={errors.dataNascimento ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        disabled
                      />
                      {errors.dataNascimento && (
                        <p className="text-sm text-red-600">{errors.dataNascimento}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estadoCivil" className="text-gray-700">Estado Civil *</Label>
                      <Select
                        onValueChange={(value) => handleSelectChange('estadoCivil', value)}
                        value={formData.estadoCivil}
                      >
                        <SelectTrigger className={errors.estadoCivil ? 'border-red-500 focus:ring-red-300' : ''}>
                          <SelectValue placeholder="Selecione o estado civil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                          <SelectItem value="casado">Casado(a)</SelectItem>
                          <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                          <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                          <SelectItem value="uniao-estavel">União Estável</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.estadoCivil && (
                        <p className="text-sm text-red-600">{errors.estadoCivil}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nacionalidade" className="text-gray-700">Nacionalidade</Label>
                      <Input
                        id="nacionalidade"
                        name="nacionalidade"
                        value={formData.nacionalidade}
                        onChange={handleInputChange}
                        placeholder="Digite sua nacionalidade"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Informações de Contato */}
                <div id="contato" className="scroll-mt-20">
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Informações de Contato</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefoneFixo" className="text-gray-700">Telefone Fixo</Label>
                      <Input
                        id="telefoneFixo"
                        name="telefoneFixo"
                        value={formData.telefoneFixo}
                        onChange={handleInputChange}
                        placeholder="(00) 0000-0000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="celular" className="text-gray-700">Celular *</Label>
                      <Input
                        id="celular"
                        name="celular"
                        value={formData.celular}
                        onChange={handleInputChange}
                        className={errors.celular ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        placeholder="(00) 00000-0000"
                      />
                      {errors.celular && (
                        <p className="text-sm text-red-600">{errors.celular}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        placeholder="seu@email.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emailAlternativo" className="text-gray-700">Email Alternativo</Label>
                      <Input
                        id="emailAlternativo"
                        name="emailAlternativo"
                        type="email"
                        value={formData.emailAlternativo}
                        onChange={handleInputChange}
                        className={errors.emailAlternativo ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        placeholder="outro@email.com"
                      />
                      {errors.emailAlternativo && (
                        <p className="text-sm text-red-600">{errors.emailAlternativo}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Endereço */}
                <div id="endereco" className="scroll-mt-20">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Endereço</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep" className="text-gray-700">CEP *</Label>
                      <div className="relative">
                        <Input
                          id="cep"
                          name="cep"
                          value={formData.cep}
                          onChange={handleInputChange}
                          onBlur={handleCepBlur}
                          className={errors.cep ? 'border-red-500 focus-visible:ring-red-300' : ''}
                          placeholder="00000-000"
                          maxLength={9}
                        />
                        {isCepLoading && (
                          <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
                        )}
                      </div>
                      {errors.cep && (
                        <p className="text-sm text-red-600">{errors.cep}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logradouro" className="text-gray-700">Logradouro *</Label>
                      <Input
                        id="logradouro"
                        name="logradouro"
                        value={formData.logradouro}
                        onChange={handleInputChange}
                        className={errors.logradouro ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        placeholder="Rua, Avenida, etc."
                      />
                      {errors.logradouro && (
                        <p className="text-sm text-red-600">{errors.logradouro}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numero" className="text-gray-700">Número *</Label>
                      <Input
                        id="numero"
                        name="numero"
                        value={formData.numero}
                        onChange={handleInputChange}
                        className={errors.numero ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        placeholder="Número ou S/N"
                      />
                      {errors.numero && (
                        <p className="text-sm text-red-600">{errors.numero}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complemento" className="text-gray-700">Complemento</Label>
                      <Input
                        id="complemento"
                        name="complemento"
                        value={formData.complemento}
                        onChange={handleInputChange}
                        placeholder="Apartamento, Bloco, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bairro" className="text-gray-700">Bairro *</Label>
                      <Input
                        id="bairro"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleInputChange}
                        className={errors.bairro ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        placeholder="Nome do bairro"
                      />
                      {errors.bairro && (
                        <p className="text-sm text-red-600">{errors.bairro}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cidade" className="text-gray-700">Cidade *</Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        className={errors.cidade ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        placeholder="Nome da cidade"
                      />
                      {errors.cidade && (
                        <p className="text-sm text-red-600">{errors.cidade}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estado" className="text-gray-700">Estado *</Label>
                      <Input
                        id="estado"
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        className={errors.estado ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        placeholder="UF"
                        maxLength={2}
                      />
                      {errors.estado && (
                        <p className="text-sm text-red-600">{errors.estado}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Informações Profissionais e Educacionais */}
                <div id="profissional" className="scroll-mt-20">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Informações Profissionais e Educacionais</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profissao" className="text-gray-700">Profissão *</Label>
                      <Input
                        id="profissao"
                        name="profissao"
                        value={formData.profissao}
                        onChange={handleInputChange}
                        className={errors.profissao ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        placeholder="Sua profissão"
                      />
                      {errors.profissao && (
                        <p className="text-sm text-red-600">{errors.profissao}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="empresa" className="text-gray-700">Empresa</Label>
                      <Input
                        id="empresa"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleInputChange}
                        placeholder="Nome da empresa"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cargo" className="text-gray-700">Cargo</Label>
                      <Input
                        id="cargo"
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleInputChange}
                        placeholder="Seu cargo atual"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="escolaridade" className="text-gray-700">Escolaridade *</Label>
                      <Select
                        onValueChange={(value) => handleSelectChange('escolaridade', value)}
                        value={formData.escolaridade}
                      >
                        <SelectTrigger className={errors.escolaridade ? 'border-red-500 focus:ring-red-300' : ''}>
                          <SelectValue placeholder="Selecione a escolaridade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="superior-completo">Ensino Superior Completo</SelectItem>
                          <SelectItem value="pos-graduacao">Pós-graduação</SelectItem>
                          <SelectItem value="mestrado">Mestrado</SelectItem>
                          <SelectItem value="doutorado">Doutorado</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.escolaridade && (
                        <p className="text-sm text-red-600">{errors.escolaridade}</p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="instituicaoEnsino" className="text-gray-700">Instituição de Ensino</Label>
                      <Input
                        id="instituicaoEnsino"
                        name="instituicaoEnsino"
                        value={formData.instituicaoEnsino}
                        onChange={handleInputChange}
                        placeholder="Nome da instituição de ensino"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Link do Vídeo Pessoal */}
                <div id="video" className="scroll-mt-20">
                  <div className="flex items-center gap-2 mb-4">
                    <Video className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Link do Vídeo Pessoal</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkVideo" className="text-gray-700">URL do Vídeo (YouTube, Vimeo, etc.) *</Label>
                    <Input
                      id="linkVideo"
                      name="linkVideo"
                      type="url"
                      value={formData.linkVideo}
                      onChange={handleInputChange}
                      className={errors.linkVideo ? 'border-red-500 focus-visible:ring-red-300' : ''}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    {errors.linkVideo && (
                      <p className="text-sm text-red-600">{errors.linkVideo}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      Grave um vídeo de 1-2 minutos se apresentando e falando sobre suas qualificações.
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Cursos e Formações */}
                <div id="cursos" className="scroll-mt-20">
                  <CursosFormacoes
                    cursos={formData.cursos}
                    onCursosChange={handleCursosChange}
                    disabled={false}
                  />
                </div>

                <Separator className="my-6" />

                {/* Upload de Arquivos PDF */}
                <div id="documentos" className="scroll-mt-20">
                  <div className="flex items-center gap-2 mb-4">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Documentos PDF</h3>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">Upload de Arquivos PDF</Label>
                    <p className="text-sm text-gray-500 mb-4">
                      Faça o upload de seus documentos em formato PDF (máx. 5MB cada). Apenas arquivos PDF são aceitos.
                    </p>
                    <FileUploader
                      onFilesChange={handleFilesChange}
                      disabled={false}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <div className="flex-1 flex items-center">
                    {isSavingDraft ? (
                      <div className="flex items-center text-sm text-gray-500">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando rascunho...
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Seu progresso está sendo salvo automaticamente
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearForm}
                    className="flex items-center gap-2 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Limpar Formulário
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={saveDraft}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <SaveIcon className="w-4 h-4" />
                    Salvar Rascunho
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isLoading ? 'Enviando...' : 'Enviar Formulário'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default FormularioPage