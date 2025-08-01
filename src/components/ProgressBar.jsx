import { useMemo } from 'react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Circle } from 'lucide-react'

const ProgressBar = ({ formData, className = '' }) => {
  // Definir campos obrigatórios e suas validações
  const requiredFields = useMemo(() => {
    const fields = [
      // Informações Pessoais
      { key: 'nomeCompleto', label: 'Nome Completo', section: 'Informações Pessoais' },
      { key: 'cpf', label: 'CPF', section: 'Informações Pessoais' },
      { key: 'rg', label: 'RG', section: 'Informações Pessoais' },
      { key: 'dataNascimento', label: 'Data de Nascimento', section: 'Informações Pessoais' },
      { key: 'estadoCivil', label: 'Estado Civil', section: 'Informações Pessoais' },

      // Informações de Contato
      { key: 'celular', label: 'Celular', section: 'Informações de Contato' },
      { key: 'email', label: 'Email', section: 'Informações de Contato' },

      // Endereço
      { key: 'cep', label: 'CEP', section: 'Endereço' },
      { key: 'logradouro', label: 'Logradouro', section: 'Endereço' },
      { key: 'numero', label: 'Número', section: 'Endereço' },
      { key: 'bairro', label: 'Bairro', section: 'Endereço' },
      { key: 'cidade', label: 'Cidade', section: 'Endereço' },
      { key: 'estado', label: 'Estado', section: 'Endereço' }
    ]

    return fields
  }, [])

  // Calcular progresso
  const progress = useMemo(() => {
    if (!formData) return { percentage: 0, completed: 0, total: 0, sections: {} }

    let completedFields = 0
    const totalFields = requiredFields.length
    const sections = {}

    // Verificar campos básicos
    requiredFields.forEach(field => {
      const isCompleted = formData[field.key] && formData[field.key].toString().trim() !== ''

      if (isCompleted) {
        completedFields++
      }

      // Agrupar por seção
      if (!sections[field.section]) {
        sections[field.section] = { completed: 0, total: 0 }
      }
      sections[field.section].total++
      if (isCompleted) {
        sections[field.section].completed++
      }
    })

    // Verificar informações profissionais/educacionais
    let profissionalEducacionalCompleted = false
    if (formData.informacoesProfissionaisEducacionais && formData.informacoesProfissionaisEducacionais.length > 0) {
      const info = formData.informacoesProfissionaisEducacionais[0]
      if (info.tipo === 'profissional') {
        profissionalEducacionalCompleted = info.profissao && info.empresa && info.dataInicio
      } else if (info.tipo === 'educacional') {
        profissionalEducacionalCompleted = info.escolaridade && info.instituicao && info.dataFormatura
      }
    }

    // Verificar cursos
    let cursosCompleted = false
    if (formData.cursos && formData.cursos.length > 0) {
      const curso = formData.cursos[0]
      cursosCompleted = curso.nomeCurso && curso.instituicao && curso.dataConclusao
    }

    // Adicionar campos dinâmicos ao total
    const additionalFields = 2 // Profissional/Educacional + Cursos
    const additionalCompleted = (profissionalEducacionalCompleted ? 1 : 0) + (cursosCompleted ? 1 : 0)

    const finalTotal = totalFields + additionalFields
    const finalCompleted = completedFields + additionalCompleted

    // Adicionar seções dinâmicas
    sections['Informações Profissionais/Educacionais'] = {
      completed: profissionalEducacionalCompleted ? 1 : 0,
      total: 1
    }
    // sections['Cursos e Formações'] = {
    //   completed: cursosCompleted ? 1 : 0,
    //   total: 1
    // }

    const percentage = Math.round((finalCompleted / finalTotal) * 100)

    return {
      percentage,
      completed: finalCompleted,
      total: finalTotal,
      sections
    }
  }, [formData, requiredFields])

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-blue-500'
    if (percentage >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getProgressText = (percentage) => {
    if (percentage >= 100) return 'Formulário completo!'
    if (percentage >= 80) return 'Quase pronto!'
    if (percentage >= 60) return 'Bom progresso!'
    if (percentage >= 40) return 'Progredindo...'
    if (percentage >= 20) return 'Começando...'
    return 'Vamos começar!'
  }

  return (
    <Card className={`sticky top-4 ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Barra de progresso principal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso do Formulário</span>
              <span className="text-sm text-muted-foreground">
                {progress.completed}/{progress.total} campos
              </span>
            </div>

            <Progress
              value={progress.percentage}
              className={`h-2 ${getProgressColor(progress.percentage)}`}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {getProgressText(progress.percentage)}
              </span>
              <span className="text-xs font-medium">
                {progress.percentage}%
              </span>
            </div>
          </div>

          {/* Progresso por seção */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Progresso por Seção</span>
            <div className="space-y-1">
              {Object.entries(progress.sections).map(([sectionName, sectionProgress]) => {
                const sectionPercentage = Math.round((sectionProgress.completed / sectionProgress.total) * 100)
                const isCompleted = sectionPercentage === 100

                return (
                  <div key={sectionName} className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs truncate ${isCompleted ? 'text-green-700' : 'text-muted-foreground'}`}>
                          {sectionName}
                        </span>
                        <span className={`text-xs ${isCompleted ? 'text-green-700' : 'text-muted-foreground'}`}>
                          {sectionProgress.completed}/{sectionProgress.total}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Dica */}
          {progress.percentage < 100 && (
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              💡 Preencha todos os campos obrigatórios (*) para completar o formulário
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProgressBar