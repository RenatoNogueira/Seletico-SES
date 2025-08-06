import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import FileUploader from '../components/FileUploader'
// mport CursosFormacoes from '../components/CursosFormacoes'
import InformacoesProfissionaisEducacionais from '../components/InformacoesProfissionaisEducacionais'
import VideoPreview from '../components/VideoPreview'
import NavigationMenu from '../components/NavigationMenu'
// import ProgressBar from '../components/ProgressBar'
import SubmitProgressModal from '../components/SubmitProgressModal'
import { validateCPF, formatCPF, validateEmail, validateCEP, formatCEP, validateVideoURL } from '../utils/validations'
import { fetchAddressByCEP } from '../utils/cepService'
import { User, Mail, MapPin, Briefcase, Video, GraduationCap, Save, RotateCcw, Loader2, Upload, BookmarkPlus, LogOut } from 'lucide-react'
import ConfirmationModal from '../components/ConfirmationModal';

const FormularioPage = ({ userData, onSubmit, onLogout }) => {
  const navigate = useNavigate()
  const [isLoading, //setIsLoading
  ] = useState(false)
  const [showSubmitProgress, setShowSubmitProgress] = useState(false)
  const [isCepLoading, setIsCepLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    // Informações Pessoais
    nomeCompleto: '',
    cpf: userData?.cpf || '',
    rg: '',
    orgaoExpedidor: '',
    ufRg: '',
    emissaoRg: '',
    dataNascimento: userData?.dataNascimento || '',
    estadoCivil: '',
    nacionalidade: 'Brasileira',
    tituloEleitor: '',
    zona: '',
    secao: '',
    carteiraReservista: '',
    serie: '',
    regiao: '',
    pisPasep: '',

    // Seção PcD
    pcd: '',
    tipoDeficiencia: '',

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
    informacoesProfissionaisEducacionais: [{
      id: Date.now(),
      tipo: 'profissional',
      profissao: '',
      empresa: '',
      cargo: '',
      dataInicio: '',
      dataFim: '',
      atual: false,
      escolaridade: '',
      instituicao: '',
      curso: '',
      dataFormatura: ''
    }],

    // Link do Vídeo Pessoal
    linkVideo: '',

    // Arquivos PDF
    arquivos: [],

    // Cursos e Formações
    // cursos: [{
    //   id: Date.now(),
    //   nomeCurso: '',
    //   instituicao: '',
    //   dataConclusao: '',
    //   cargaHoraria: ''
    // }]

  })
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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

  const handleInformacoesProfissionaisEducacionaisChange = (informacoes) => {
    setFormData(prev => ({ ...prev, informacoesProfissionaisEducacionais: informacoes }))
  }

  // const handleCursosChange = (cursos) => {
  //   setFormData(prev => ({ ...prev, cursos }))
  // }

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

    if (formData.linkVideo && !validateVideoURL(formData.linkVideo)) {
      newErrors.linkVideo = 'URL do vídeo inválida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmationModal(true); // Mostra o modal de confirmação em vez de validar direto
  };

  const handleConfirmSubmit = () => {
    setShowConfirmationModal(false);

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setShowSubmitProgress(true);
  };
  const handleSubmitComplete = () => {
    setShowSubmitProgress(false)
    onSubmit(formData)
    navigate('/sucesso')
  }


  const handleSair = () => {
    const confirmSair = window.confirm(
      'Tem certeza que deseja sair? Todos os dados não salvos serão perdidos.\n\nDica: Use "Salvar Rascunho" para não perder seu progresso.'
    )

    if (confirmSair) {
      if (onLogout) {
        onLogout() // Chama função de logout do App
      }
      navigate('/') // Navega para página de login
    }
  }
  {/*
  // Carregar rascunho ao inicializar
  useEffect(() => {
    const rascunhoSalvo = localStorage.getItem('formulario_rascunho')
    if (rascunhoSalvo) {
      try {
        const rascunho = JSON.parse(rascunhoSalvo)
        const confirmCarregar = window.confirm(
          `Encontramos um rascunho salvo em ${new Date(rascunho.dataRascunho).toLocaleString('pt-BR')}.\n\nDeseja carregar os dados salvos?`
        )

        if (confirmCarregar) {
          // Remove a data do rascunho antes de carregar
          const { // dataRascunho,
            ...dadosRascunho } = rascunho
          setFormData(prev => ({ ...prev, ...dadosRascunho }))
        }
      } catch (error) {
        console.error('Erro ao carregar rascunho:', error)
      }
    }
  }, [])*/}

  const handleClearForm = () => {
    setFormData({
      nomeCompleto: '',
      cpf: userData?.cpf || '',
      rg: '',
      dataNascimento: userData?.dataNascimento || '',
      estadoCivil: '',
      nacionalidade: 'Brasileira',
      telefoneFixo: '',
      celular: '',
      email: '',
      emailAlternativo: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      informacoesProfissionaisEducacionais: [{
        id: Date.now(),
        tipo: 'profissional',
        profissao: '',
        empresa: '',
        cargo: '',
        dataInicio: '',
        dataFim: '',
        atual: false,
        escolaridade: '',
        instituicao: '',
        curso: '',
        dataFormatura: ''
      }],
      linkVideo: '',
      arquivos: [],
      cursos: [{
        id: Date.now(),
        nomeCurso: '',
        instituicao: '',
        dataConclusao: '',
        cargaHoraria: ''
      }]
    })
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Barra de Progresso - Sidebar Esquerda
          <div className="lg:col-span-1">
            <ProgressBar formData={formData} />
          </div>*/}

          {/* Formulário Principal */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Formulário de Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* Informações Pessoais */}
                  <div data-section="informacoes-pessoais">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Informações Pessoais</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                        <Input
                          id="nomeCompleto"
                          name="nomeCompleto"
                          value={formData.nomeCompleto}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className={errors.nomeCompleto ? 'border-destructive' : ''}
                        />
                        {errors.nomeCompleto && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors.nomeCompleto}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF *</Label>
                        <Input
                          id="cpf"
                          name="cpf"
                          value={formData.cpf}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className={errors.cpf ? 'border-destructive' : ''}
                          maxLength={14}
                          disabled
                        />
                        {errors.cpf && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors.cpf}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rg">RG *</Label>
                        <Input
                          id="rg"
                          name="rg"
                          value={formData.rg}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className={errors.rg ? 'border-destructive' : ''}
                        />
                        {errors.rg && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors.rg}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="orgaoExpedidor">Órgão Expedidor *</Label>
                        <Input
                          id="orgaoExpedidor"
                          name="orgaoExpedidor"
                          value={formData.orgaoExpedidor}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          placeholder="Ex: SSP"
                          className={errors.orgaoExpedidor ? 'border-destructive' : ''}
                        />
                        {errors.orgaoExpedidor && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors.orgaoExpedidor}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ufRg">UF *</Label>
                        <Select value={formData.ufRg} onValueChange={(value) => handleSelectChange('ufRg', value)}>
                          <SelectTrigger className={errors.ufRg ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Selecione o estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AC">AC</SelectItem>
                            <SelectItem value="AL">AL</SelectItem>
                            <SelectItem value="AP">AP</SelectItem>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="BA">BA</SelectItem>
                            <SelectItem value="CE">CE</SelectItem>
                            <SelectItem value="DF">DF</SelectItem>
                            <SelectItem value="ES">ES</SelectItem>
                            <SelectItem value="GO">GO</SelectItem>
                            <SelectItem value="MA">MA</SelectItem>
                            <SelectItem value="MT">MT</SelectItem>
                            <SelectItem value="MS">MS</SelectItem>
                            <SelectItem value="MG">MG</SelectItem>
                            <SelectItem value="PA">PA</SelectItem>
                            <SelectItem value="PB">PB</SelectItem>
                            <SelectItem value="PR">PR</SelectItem>
                            <SelectItem value="PE">PE</SelectItem>
                            <SelectItem value="PI">PI</SelectItem>
                            <SelectItem value="RJ">RJ</SelectItem>
                            <SelectItem value="RN">RN</SelectItem>
                            <SelectItem value="RS">RS</SelectItem>
                            <SelectItem value="RO">RO</SelectItem>
                            <SelectItem value="RR">RR</SelectItem>
                            <SelectItem value="SC">SC</SelectItem>
                            <SelectItem value="SP">SP</SelectItem>
                            <SelectItem value="SE">SE</SelectItem>
                            <SelectItem value="TO">TO</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.ufRg && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors.ufRg}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emissaoRg">Emissão *</Label>
                        <Input
                          id="emissaoRg"
                          name="emissaoRg"
                          type="date"
                          value={formData.emissaoRg}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className={errors.emissaoRg ? 'border-destructive' : ''}
                        />
                        {errors.emissaoRg && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors.emissaoRg}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                        <Input
                          id="dataNascimento"
                          name="dataNascimento"
                          type="date"
                          value={formData.dataNascimento}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className={errors.dataNascimento ? 'border-destructive' : ''}
                          disabled
                        />
                        {errors.dataNascimento && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors.dataNascimento}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="estadoCivil">Estado Civil *</Label>
                        <Select onValueChange={(value) => handleSelectChange('estadoCivil', value)}>
                          <SelectTrigger className={errors.estadoCivil ? 'border-destructive' : ''}>
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
                          <Alert variant="destructive">
                            <AlertDescription>{errors.estadoCivil}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nacionalidade">Nacionalidade</Label>
                        <Input
                          id="nacionalidade"
                          name="nacionalidade"
                          value={formData.nacionalidade}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                        />
                      </div>


                    </div>
                  </div>

                  <Separator />

                  {/* Seção PcD
                  <div data-section="pcd">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Pessoa com Deficiência (PcD)</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>PcD? *</Label>
                        <div className="flex gap-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="pcd"
                              value="sim"
                              checked={formData.pcd === 'sim'}
                              onChange={handleInputChange}
                              className="w-4 h-4"
                            />
                            <span>Sim</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="pcd"
                              value="nao"
                              checked={formData.pcd === 'nao'}
                              onChange={handleInputChange}
                              className="w-4 h-4"
                            />
                            <span>Não</span>
                          </label>
                        </div>
                      </div>

                      {formData.pcd === 'sim' && (
                        <div className="space-y-2">
                          <Label>Tipo de Deficiência *</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {['Física', 'Visual', 'Auditiva', 'Mental', 'Intelectual'].map((tipo) => (
                              <label key={tipo} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  name="tipoDeficiencia"
                                  value={tipo.toLowerCase()}
                                  checked={formData.tipoDeficiencia.includes(tipo.toLowerCase())}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const currentTypes = formData.tipoDeficiencia.split(',').filter(t => t.trim());
                                    if (e.target.checked) {
                                      setFormData(prev => ({
                                        ...prev,
                                        tipoDeficiencia: [...currentTypes, value].join(',')
                                      }));
                                    } else {
                                      setFormData(prev => ({
                                        ...prev,
                                        tipoDeficiencia: currentTypes.filter(t => t !== value).join(',')
                                      }));
                                    }
                                  }}
                                  className="w-4 h-4"
                                />
                                <span>{tipo}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />*/}

                  {/* Informações de Contato */}
                  <div data-section="informacoes-contato">
                    <div className="flex items-center gap-2 mb-4">
                      <Mail className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Informações de Contato</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefoneFixo">Telefone Fixo</Label>
                        <Input
                          id="telefoneFixo"
                          name="telefoneFixo"
                          value={formData.telefoneFixo}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          placeholder="(11) 1234-5678"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="celular">Celular *</Label>
                        <Input
                          id="celular"
                          name="celular"
                          value={formData.celular}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className={errors.celular ? 'border-destructive' : ''}
                          placeholder="(11) 91234-5678"
                        />
                        {errors.celular && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors.celular}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors.email}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emailAlternativo">Email Alternativo</Label>
                        <Input
                          id="emailAlternativo"
                          name="emailAlternativo"
                          type="email"
                          value={formData.emailAlternativo}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className={errors.emailAlternativo ? 'border-destructive' : ''}
                        />
                        {errors.emailAlternativo && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors.emailAlternativo}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Endereço */}
                  <div data-section="endereco">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Endereço</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP *</Label>
                        <div className="relative flex items-center gap-2">
                          <Input
                            id="cep"
                            name="cep"
                            value={formData.cep}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onBlur={handleCepBlur}
                            className={`flex-1 ${errors.cep ? 'border-destructive' : ''}`}
                            placeholder="00000-000"
                            maxLength={9}
                          />
                          <button
                            type="button"
                            onClick={handleCepBlur} // ou outro handler específico para buscar o CEP
                            className="px-3 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                          >
                            Buscar
                          </button>
                          {isCepLoading && (
                            <Loader2 className="absolute right-12 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                          )}
                        </div>
                        {errors.cep && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors.cep}</AlertDescription>
                          </Alert>
                        )}
                      </div>


                      <div className="space-y-2">
                        <Label htmlFor="logradouro">Logradouro *</Label>
                        <Input
                          id="logradouro"
                          name="logradouro"
                          value={formData.logradouro}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className={errors.logradouro ? 'border-destructive' : ''}
                        />
                        {errors.logradouro && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors.logradouro}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="numero">Número *</Label>
                        <Input
                          id="numero"
                          name="numero"
                          value={formData.numero}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className={errors.numero ? 'border-destructive' : ''}
                        />
                        {errors.numero && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors.numero}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="complemento">Complemento</Label>
                        <Input
                          id="complemento"
                          name="complemento"
                          value={formData.complemento}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bairro">Bairro *</Label>
                        <Input
                          id="bairro"
                          name="bairro"
                          value={formData.bairro}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className={errors.bairro ? 'border-destructive' : ''}
                        />
                        {errors.bairro && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors.bairro}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade *</Label>
                        <Input
                          id="cidade"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className={errors.cidade ? 'border-destructive' : ''}
                        />
                        {errors.cidade && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors.cidade}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado *</Label>
                        <Input
                          id="estado"
                          name="estado"
                          value={formData.estado}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className={errors.estado ? 'border-destructive' : ''}
                        />
                        {errors.estado && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors.estado}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Informações Profissionais e Educacionais */}
                  <div data-section="informacoes-profissionais">
                    <InformacoesProfissionaisEducacionais
                      informacoesProfissionais={formData.informacoesProfissionaisEducacionais}
                      onInformacoesProfissionaisChange={handleInformacoesProfissionaisEducacionaisChange}
                    />
                  </div>

                  <Separator />

                  {/* Link do Vídeo Pessoal */}
                  <div data-section="video-pessoal">
                    <div className="flex items-center gap-2 mb-4">
                      <Video className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Link do Pitch Vídeo</h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkVideo">URL do Vídeo (YouTube, Google Drive, Vimeo, etc.) com no máximo 3 minutos </Label>
                      <Input
                        id="linkVideo"
                        name="linkVideo"
                        type="url"
                        value={formData.linkVideo}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className={errors.linkVideo ? 'border-destructive' : ''}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      {errors.linkVideo && (
                        <Alert variant="destructive">
                          <AlertDescription>{errors.linkVideo}</AlertDescription>
                        </Alert>
                      )}

                      {/* Prévia do Vídeo */}
                      <VideoPreview videoUrl={formData.linkVideo} />
                    </div>
                  </div>

                  <Separator />

                  {/* Upload de Arquivos PDF */}
                  <div data-section="documentos">
                    <div className="flex items-center gap-2 mb-4">
                      <Upload className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Documentos PDF</h3>
                    </div>

                    <div className="space-y-2">
                      <Label>Upload de Arquivos PDF</Label>
                      <p className="text-sm text-muted-foreground">
                        Faça o upload de seus documentos em formato PDF. Apenas arquivos PDF são aceitos.
                      </p>
                      <FileUploader
                        onFilesChange={handleFilesChange}
                        disabled={false}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Cursos e Formações */}
                  {/* <div data-section="cursos-formacoes">
                    <CursosFormacoes
                      cursos={formData.cursos}
                      onCursosChange={handleCursosChange}
                      disabled={false}
                    />
                  </div> */}

                  <Separator />

                  {/* Botões de Ação */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSair}
                        className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair
                      </Button>
                      {/*
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSalvarRascunho}
                        className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <BookmarkPlus className="w-4 h-4" />
                        Salvar Rascunho
                      </Button>*/}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClearForm}
                        className="flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Limpar Formulário
                      </Button>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {isLoading ? 'Enviando...' : 'Enviar Formulário'}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Menu de Navegação - Sidebar Direita */}
          <div className="lg:col-span-1">
            <NavigationMenu />
          </div>
        </div>
      </div>

      {/* ADICIONE AQUI OS MODAIS */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmationModal(false)}
      />

      <SubmitProgressModal
        isOpen={showSubmitProgress}
        onComplete={handleSubmitComplete}
      />
    </div>
  )
}

export default FormularioPage

