import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { CheckCircle, User, Mail, Upload, Home, FileText, Edit, X, Loader2, LogOut } from 'lucide-react'
import FileUploader from '../components/FileUploader'

const SucessoPage = ({ data: initialData, onSubmit, onLogout }) => {
  const navigate = useNavigate()
  const [data, setData] = useState(initialData)
  const [isEditingDocs, setIsEditingDocs] = useState(false)
  const [editedData, setEditedData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)

  // Função para sair
  const handleLogout = () => {
    if (onLogout) {
      onLogout() // Chama a função de logout passada como prop
    } else {
      // Redireciona para a página de login se nenhuma função for fornecida
      navigate('/formulario')
    }
  }

  // Formatações
  const formatCPF = (cpf) => {
    return cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') || ''
  }

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('pt-BR') : ''
  }

  const getEstadoCivilLabel = (value) => {
    const labels = {
      'solteiro': 'Solteiro(a)',
      'casado': 'Casado(a)',
      'divorciado': 'Divorciado(a)',
      'viuvo': 'Viúvo(a)',
      'uniao-estavel': 'União Estável'
    }
    return labels[value] || value
  }

  // Iniciar edição
  const handleStartEditing = () => {
    setEditedData({ ...data })
    setEditMode(true)
  }

  // Cancelar edição
  const handleCancelEditing = () => {
    setEditMode(false)
    setEditedData({})
  }

  // Salvar edição
  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Atualizar dados locais
      setData(editedData)

      // Chamar função de submissão se existir
      if (onSubmit) {
        await onSubmit(editedData)
      }

      setEditMode(false)
    } catch (error) {
      console.error('Erro ao salvar edição:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Manipular mudanças nos campos editáveis
  const handleFieldChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }))
  }

  // Manipular mudanças nos arquivos
  const handleFilesChange = (files) => {
    setEditedData(prev => ({ ...prev, arquivos: files }))
  }

  // Novo formulário
  const handleNovoFormulario = () => {
    navigate('/formulario')
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p>Nenhum dado encontrado.</p>
            <Button onClick={handleNovoFormulario} className="mt-4">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header de Sucesso */}
        <Card className="mb-6">
          <CardContent className="text-center py-8">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">
              {editMode ? 'Editando Formulário' : 'Formulário Enviado com Sucesso!'}
            </h1>
            <p className="text-muted-foreground">
              {editMode ? 'Faça as alterações necessárias e salve.' : 'Seus dados foram recebidos e processados com sucesso.'}
            </p>
            <Badge variant="secondary" className="mt-4">
              {editMode ? 'Modo Edição' : `Enviado em ${new Date().toLocaleString('pt-BR')}`}
            </Badge>

            {!editMode && (
              <div className="mt-6 flex justify-center gap-3">
                <Button
                  onClick={handleStartEditing}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar Informações
                </Button>
                <Button onClick={handleNovoFormulario} className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Novo Formulário
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dados Enviados */}
        <div className="space-y-6">

          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  <CardTitle>Informações Pessoais</CardTitle>
                </div>
                {editMode && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Editável
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome Completo</p>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedData.nomeCompleto || ''}
                      onChange={(e) => handleFieldChange('nomeCompleto', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="font-medium">{data.nomeCompleto}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{formatCPF(data.cpf)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">RG</p>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedData.rg || ''}
                      onChange={(e) => handleFieldChange('rg', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="font-medium">{data.rg}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="font-medium">{formatDate(data.dataNascimento)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado Civil</p>
                  {editMode ? (
                    <select
                      value={editedData.estadoCivil || ''}
                      onChange={(e) => handleFieldChange('estadoCivil', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="solteiro">Solteiro(a)</option>
                      <option value="casado">Casado(a)</option>
                      <option value="divorciado">Divorciado(a)</option>
                      <option value="viuvo">Viúvo(a)</option>
                      <option value="uniao-estavel">União Estável</option>
                    </select>
                  ) : (
                    <p className="font-medium">{getEstadoCivilLabel(data.estadoCivil)}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nacionalidade</p>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedData.nacionalidade || ''}
                      onChange={(e) => handleFieldChange('nacionalidade', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="font-medium">{data.nacionalidade}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Contato */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <CardTitle>Informações de Contato</CardTitle>
                </div>
                {editMode && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Editável
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Telefone Fixo</p>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedData.telefoneFixo || ''}
                      onChange={(e) => handleFieldChange('telefoneFixo', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="font-medium">{data.telefoneFixo || '-'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Celular</p>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedData.celular || ''}
                      onChange={(e) => handleFieldChange('celular', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="font-medium">{data.celular}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  {editMode ? (
                    <input
                      type="email"
                      value={editedData.email || ''}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="font-medium">{data.email}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Alternativo</p>
                  {editMode ? (
                    <input
                      type="email"
                      value={editedData.emailAlternativo || ''}
                      onChange={(e) => handleFieldChange('emailAlternativo', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="font-medium">{data.emailAlternativo || '-'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Arquivos Enviados */}
          {data.arquivos && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    <CardTitle>Documentos Enviados</CardTitle>
                  </div>
                  {editMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingDocs(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Documentos
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {data.arquivos.length} arquivo(s) enviado(s):
                  </p>
                  {data.arquivos.map((arquivo, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <FileText className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium">{arquivo.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(arquivo.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        Enviado
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botões de Edição */}
          {editMode && (
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleCancelEditing}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Salvar Alterações
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Edição de Documentos */}
      <Dialog open={isEditingDocs} onOpenChange={setIsEditingDocs}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Editar Documentos
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <FileUploader
              initialFiles={editedData.arquivos || []}
              onFilesChange={handleFilesChange}
              disabled={false}
              maxFiles={5}
              maxSize={5 * 1024 * 1024} // 5MB
              accept=".pdf"
            />
            <p className="text-sm text-muted-foreground mt-4">
              Você pode adicionar novos documentos ou substituir os existentes.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditingDocs(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setIsEditingDocs(false)
                // Atualizar visualização dos arquivos
                setData(prev => ({ ...prev, arquivos: editedData.arquivos }))
              }}
            >
              Salvar Documentos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SucessoPage