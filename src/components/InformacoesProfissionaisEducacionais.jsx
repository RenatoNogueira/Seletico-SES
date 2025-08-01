import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Minus, Briefcase, GraduationCap } from 'lucide-react'

const InformacoesProfissionaisEducacionais = ({ 
  informacoesProfissionais, 
  onInformacoesProfissionaisChange, 
  disabled = false 
}) => {
  const [errors, setErrors] = useState({})

  const adicionarInformacao = () => {
    if (disabled) return
    
    const novaInformacao = {
      id: Date.now() + Math.random(),
      tipo: 'profissional', // 'profissional' ou 'educacional'
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
    }
    
    const novasInformacoes = [...informacoesProfissionais, novaInformacao]
    onInformacoesProfissionaisChange(novasInformacoes)
  }

  const removerInformacao = (informacaoId) => {
    if (disabled) return
    
    const informacoesAtualizadas = informacoesProfissionais.filter(info => info.id !== informacaoId)
    onInformacoesProfissionaisChange(informacoesAtualizadas)
    
    // Limpar erros da informação removida
    const novosErros = { ...errors }
    Object.keys(novosErros).forEach(key => {
      if (key.includes(`_${informacaoId}`)) {
        delete novosErros[key]
      }
    })
    setErrors(novosErros)
  }

  const handleInputChange = (informacaoId, campo, valor) => {
    if (disabled) return
    
    const informacoesAtualizadas = informacoesProfissionais.map(info => 
      info.id === informacaoId 
        ? { ...info, [campo]: valor }
        : info
    )
    
    onInformacoesProfissionaisChange(informacoesAtualizadas)
    
    // Limpar erro do campo
    const errorKey = `${campo}_${informacaoId}`
    if (errors[errorKey]) {
      setErrors(prev => {
        const novosErros = { ...prev }
        delete novosErros[errorKey]
        return novosErros
      })
    }
  }

  const handleSelectChange = (informacaoId, campo, valor) => {
    handleInputChange(informacaoId, campo, valor)
  }

  const handleCheckboxChange = (informacaoId, campo, checked) => {
    if (disabled) return
    
    const informacoesAtualizadas = informacoesProfissionais.map(info => 
      info.id === informacaoId 
        ? { ...info, [campo]: checked, ...(checked ? { dataFim: '' } : {}) }
        : info
    )
    
    onInformacoesProfissionaisChange(informacoesAtualizadas)
  }

  const validarInformacoes = () => {
    const novosErros = {}
    
    informacoesProfissionais.forEach(info => {
      if (!info.tipo) {
        novosErros[`tipo_${info.id}`] = 'Tipo é obrigatório'
      }
      
      if (info.tipo === 'profissional') {
        if (!info.profissao?.trim()) {
          novosErros[`profissao_${info.id}`] = 'Profissão é obrigatória'
        }
        if (!info.empresa?.trim()) {
          novosErros[`empresa_${info.id}`] = 'Empresa é obrigatória'
        }
        if (!info.dataInicio) {
          novosErros[`dataInicio_${info.id}`] = 'Data de início é obrigatória'
        }
        if (!info.atual && !info.dataFim) {
          novosErros[`dataFim_${info.id}`] = 'Data de fim é obrigatória quando não é emprego atual'
        }
      } else if (info.tipo === 'educacional') {
        if (!info.escolaridade) {
          novosErros[`escolaridade_${info.id}`] = 'Escolaridade é obrigatória'
        }
        if (!info.instituicao?.trim()) {
          novosErros[`instituicao_${info.id}`] = 'Instituição é obrigatória'
        }
        if (!info.dataFormatura) {
          novosErros[`dataFormatura_${info.id}`] = 'Data de formatura é obrigatória'
        }
      }
    })
    
    setErrors(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const getEscolaridadeOptions = () => [
    { value: 'fundamental-incompleto', label: 'Ensino Fundamental Incompleto' },
    { value: 'fundamental-completo', label: 'Ensino Fundamental Completo' },
    { value: 'medio-incompleto', label: 'Ensino Médio Incompleto' },
    { value: 'medio-completo', label: 'Ensino Médio Completo' },
    { value: 'superior-incompleto', label: 'Ensino Superior Incompleto' },
    { value: 'superior-completo', label: 'Ensino Superior Completo' },
    { value: 'pos-graduacao', label: 'Pós-graduação' },
    { value: 'mestrado', label: 'Mestrado' },
    { value: 'doutorado', label: 'Doutorado' }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Informações Profissionais e Educacionais</h3>
        </div>
        
        {!disabled && (
          <Button
            type="button"
            onClick={adicionarInformacao}
            className="flex items-center gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar Mais
          </Button>
        )}
      </div>

      {informacoesProfissionais.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {disabled 
                ? 'Nenhuma informação foi adicionada'
                : 'Nenhuma informação adicionada ainda. Clique em "Adicionar Mais" para começar.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {informacoesProfissionais.map((info, index) => (
            <Card key={info.id}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {info.tipo === 'profissional' ? (
                      <Briefcase className="w-4 h-4" />
                    ) : (
                      <GraduationCap className="w-4 h-4" />
                    )}
                    {info.tipo === 'profissional' ? 'Experiência Profissional' : 'Formação Educacional'} {index + 1}
                  </CardTitle>
                  {!disabled && informacoesProfissionais.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerInformacao(info.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Seletor de Tipo */}
                <div className="space-y-2">
                  <Label htmlFor={`tipo_${info.id}`}>Tipo *</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange(info.id, 'tipo', value)}
                    value={info.tipo}
                    disabled={disabled}
                  >
                    <SelectTrigger className={errors[`tipo_${info.id}`] ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="profissional">Experiência Profissional</SelectItem>
                      <SelectItem value="educacional">Formação Educacional</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors[`tipo_${info.id}`] && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors[`tipo_${info.id}`]}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Campos para Experiência Profissional */}
                {info.tipo === 'profissional' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`profissao_${info.id}`}>Profissão *</Label>
                      <Input
                        id={`profissao_${info.id}`}
                        value={info.profissao || ''}
                        onChange={(e) => handleInputChange(info.id, 'profissao', e.target.value)}
                        className={errors[`profissao_${info.id}`] ? 'border-destructive' : ''}
                        disabled={disabled}
                        placeholder="Ex: Desenvolvedor Web"
                      />
                      {errors[`profissao_${info.id}`] && (
                        <Alert variant="destructive">
                          <AlertDescription>{errors[`profissao_${info.id}`]}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`empresa_${info.id}`}>Empresa *</Label>
                      <Input
                        id={`empresa_${info.id}`}
                        value={info.empresa || ''}
                        onChange={(e) => handleInputChange(info.id, 'empresa', e.target.value)}
                        className={errors[`empresa_${info.id}`] ? 'border-destructive' : ''}
                        disabled={disabled}
                        placeholder="Ex: Tech Company Ltd"
                      />
                      {errors[`empresa_${info.id}`] && (
                        <Alert variant="destructive">
                          <AlertDescription>{errors[`empresa_${info.id}`]}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`cargo_${info.id}`}>Cargo</Label>
                      <Input
                        id={`cargo_${info.id}`}
                        value={info.cargo || ''}
                        onChange={(e) => handleInputChange(info.id, 'cargo', e.target.value)}
                        disabled={disabled}
                        placeholder="Ex: Desenvolvedor Sênior"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`dataInicio_${info.id}`}>Data de Início *</Label>
                      <Input
                        id={`dataInicio_${info.id}`}
                        type="date"
                        value={info.dataInicio || ''}
                        onChange={(e) => handleInputChange(info.id, 'dataInicio', e.target.value)}
                        className={errors[`dataInicio_${info.id}`] ? 'border-destructive' : ''}
                        disabled={disabled}
                      />
                      {errors[`dataInicio_${info.id}`] && (
                        <Alert variant="destructive">
                          <AlertDescription>{errors[`dataInicio_${info.id}`]}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`atual_${info.id}`}
                          checked={info.atual || false}
                          onChange={(e) => handleCheckboxChange(info.id, 'atual', e.target.checked)}
                          disabled={disabled}
                          className="rounded"
                        />
                        <Label htmlFor={`atual_${info.id}`}>Emprego atual</Label>
                      </div>
                    </div>
                    
                    {!info.atual && (
                      <div className="space-y-2">
                        <Label htmlFor={`dataFim_${info.id}`}>Data de Fim *</Label>
                        <Input
                          id={`dataFim_${info.id}`}
                          type="date"
                          value={info.dataFim || ''}
                          onChange={(e) => handleInputChange(info.id, 'dataFim', e.target.value)}
                          className={errors[`dataFim_${info.id}`] ? 'border-destructive' : ''}
                          disabled={disabled}
                        />
                        {errors[`dataFim_${info.id}`] && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors[`dataFim_${info.id}`]}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Campos para Formação Educacional */}
                {info.tipo === 'educacional' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`escolaridade_${info.id}`}>Escolaridade *</Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange(info.id, 'escolaridade', value)}
                        value={info.escolaridade || ''}
                        disabled={disabled}
                      >
                        <SelectTrigger className={errors[`escolaridade_${info.id}`] ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Selecione a escolaridade" />
                        </SelectTrigger>
                        <SelectContent>
                          {getEscolaridadeOptions().map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[`escolaridade_${info.id}`] && (
                        <Alert variant="destructive">
                          <AlertDescription>{errors[`escolaridade_${info.id}`]}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`instituicao_${info.id}`}>Instituição *</Label>
                      <Input
                        id={`instituicao_${info.id}`}
                        value={info.instituicao || ''}
                        onChange={(e) => handleInputChange(info.id, 'instituicao', e.target.value)}
                        className={errors[`instituicao_${info.id}`] ? 'border-destructive' : ''}
                        disabled={disabled}
                        placeholder="Ex: Universidade XYZ"
                      />
                      {errors[`instituicao_${info.id}`] && (
                        <Alert variant="destructive">
                          <AlertDescription>{errors[`instituicao_${info.id}`]}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`curso_${info.id}`}>Curso</Label>
                      <Input
                        id={`curso_${info.id}`}
                        value={info.curso || ''}
                        onChange={(e) => handleInputChange(info.id, 'curso', e.target.value)}
                        disabled={disabled}
                        placeholder="Ex: Ciência da Computação"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`dataFormatura_${info.id}`}>Data de Formatura *</Label>
                      <Input
                        id={`dataFormatura_${info.id}`}
                        type="date"
                        value={info.dataFormatura || ''}
                        onChange={(e) => handleInputChange(info.id, 'dataFormatura', e.target.value)}
                        className={errors[`dataFormatura_${info.id}`] ? 'border-destructive' : ''}
                        disabled={disabled}
                      />
                      {errors[`dataFormatura_${info.id}`] && (
                        <Alert variant="destructive">
                          <AlertDescription>{errors[`dataFormatura_${info.id}`]}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {!disabled && informacoesProfissionais.length > 0 && (
        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            onClick={adicionarInformacao}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Mais
          </Button>
        </div>
      )}
    </div>
  )
}

export default InformacoesProfissionaisEducacionais

