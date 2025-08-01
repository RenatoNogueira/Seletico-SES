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

  // Função para obter áreas de formação baseadas no nível
  const getAreasFormacao = (nivel) => {
    if (nivel === 'tecnico') {
      return [
        { value: 'tecnico_administracao', label: 'Técnico em Administração' },
        { value: 'tecnico_enfermagem', label: 'Técnico em Enfermagem' },
        { value: 'tecnico_eletrotecnica', label: 'Técnico em Eletrotécnica' },
        { value: 'tecnico_massoterapia', label: 'Técnico em Massoterapia' }
      ]
    } else if (nivel === 'superior') {
      return [
        { value: 'administracao', label: 'Administração' },
        { value: 'ciencias_contabeis', label: 'Ciências Contábeis' },
        { value: 'ciencias_computacao', label: 'Ciências da Computação' },
        { value: 'ciencias_economicas', label: 'Ciências Econômicas' },
        { value: 'comunicacao_social', label: 'Comunicação Social/Jornalismo' },
        { value: 'direito', label: 'Direito' },
        { value: 'enfermagem', label: 'Enfermagem' },
        { value: 'fisioterapia', label: 'Fisioterapia' },
        { value: 'medicina', label: 'Medicina' },
        { value: 'nutricao', label: 'Nutrição' },
        { value: 'pedagogia', label: 'Pedagogia' },
        { value: 'psicologia', label: 'Psicologia' }
      ]
    }
    return []
  }

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
      dataFormatura: '',
      nivel: '', // 'superior' ou 'tecnico'
      areaFormacao: '' // área específica baseada no nível
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
      info.id === informacaoId ? { ...info, [campo]: valor } : info
    )
    onInformacoesProfissionaisChange(informacoesAtualizadas)

    // Limpar erro do campo
    if (errors[`${campo}_${informacaoId}`]) {
      const novosErros = { ...errors }
      delete novosErros[`${campo}_${informacaoId}`]
      setErrors(novosErros)
    }
  }

  const handleSelectChange = (informacaoId, campo, valor) => {
    if (disabled) return

    const informacoesAtualizadas = informacoesProfissionais.map(info => {
      if (info.id === informacaoId) {
        const infoAtualizada = { ...info, [campo]: valor }

        // Se mudou o tipo, limpar campos específicos
        if (campo === 'tipo') {
          if (valor === 'educacional') {
            // Limpar campos profissionais
            delete infoAtualizada.profissao
            delete infoAtualizada.empresa
            delete infoAtualizada.cargo
            delete infoAtualizada.dataInicio
            delete infoAtualizada.dataFim
            delete infoAtualizada.atual
          } else if (valor === 'profissional') {
            // Limpar campos educacionais
            delete infoAtualizada.nivel
            delete infoAtualizada.areaFormacao
            delete infoAtualizada.instituicao
            delete infoAtualizada.curso
            delete infoAtualizada.dataFormatura
          }
        }

        return infoAtualizada
      }
      return info
    })

    onInformacoesProfissionaisChange(informacoesAtualizadas)

    // Limpar erro do campo
    if (errors[`${campo}_${informacaoId}`]) {
      const novosErros = { ...errors }
      delete novosErros[`${campo}_${informacaoId}`]
      setErrors(novosErros)
    }
  }

  const handleCheckboxChange = (informacaoId, campo, valor) => {
    if (disabled) return

    const informacoesAtualizadas = informacoesProfissionais.map(info =>
      info.id === informacaoId ? { ...info, [campo]: valor } : info
    )
    onInformacoesProfissionaisChange(informacoesAtualizadas)
  }

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
                      <Label htmlFor={`nivel_${info.id}`}>Nível *</Label>
                      <Select
                        onValueChange={(value) => {
                          handleSelectChange(info.id, 'nivel', value)
                          // Limpar área de formação quando mudar o nível
                          // handleSelectChange(info.id, 'areaFormacao', '')
                        }}
                        value={info.nivel || ''}
                        disabled={disabled}
                      >
                        <SelectTrigger className={errors[`nivel_${info.id}`] ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="superior">Superior</SelectItem>
                          <SelectItem value="tecnico">Técnico</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors[`nivel_${info.id}`] && (
                        <Alert variant="destructive">
                          <AlertDescription>{errors[`nivel_${info.id}`]}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {info.nivel && (
                      <div className="space-y-2">
                        <Label htmlFor={`areaFormacao_${info.id}`}>Área de Formação *</Label>
                        <Select
                          onValueChange={(value) => handleSelectChange(info.id, 'areaFormacao', value)}
                          value={info.areaFormacao || ''}
                          disabled={disabled}
                        >
                          <SelectTrigger className={errors[`areaFormacao_${info.id}`] ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Selecione a área de formação" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAreasFormacao(info.nivel).map(area => (
                              <SelectItem key={area.value} value={area.value}>
                                {area.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors[`areaFormacao_${info.id}`] && (
                          <Alert variant="destructive">
                            <AlertDescription>{errors[`areaFormacao_${info.id}`]}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}

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
                        placeholder="Ex: Bacharel em Ciência da Computação"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`dataFormatura_${info.id}`}>Data de Formatura</Label>
                      <Input
                        id={`dataFormatura_${info.id}`}
                        type="date"
                        value={info.dataFormatura || ''}
                        onChange={(e) => handleInputChange(info.id, 'dataFormatura', e.target.value)}
                        disabled={disabled}
                      />
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

