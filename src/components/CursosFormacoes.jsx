import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Minus, GraduationCap } from 'lucide-react'

const CursosFormacoes = ({ cursos, onCursosChange, disabled = false }) => {
  const [errors, setErrors] = useState({})

  const adicionarCurso = () => {
    if (disabled) return

    const novoCurso = {
      id: Date.now() + Math.random(),
      nomeCurso: '',
      instituicao: '',
      dataConclusao: '',
      cargaHoraria: ''
    }

    const novosCursos = [...cursos, novoCurso]
    onCursosChange(novosCursos)
  }

  const removerCurso = (cursoId) => {
    if (disabled) return

    const cursosAtualizados = cursos.filter(curso => curso.id !== cursoId)
    onCursosChange(cursosAtualizados)

    // Limpar erros do curso removido
    const novosErros = { ...errors }
    Object.keys(novosErros).forEach(key => {
      if (key.includes(`_${cursoId}`)) {
        delete novosErros[key]
      }
    })
    setErrors(novosErros)
  }

  const handleInputChange = (cursoId, campo, valor) => {
    if (disabled) return

    const cursosAtualizados = cursos.map(curso =>
      curso.id === cursoId
        ? { ...curso, [campo]: valor }
        : curso
    )

    onCursosChange(cursosAtualizados)

    // Limpar erro do campo
    const errorKey = `${campo}_${cursoId}`
    if (errors[errorKey]) {
      setErrors(prev => {
        const novosErros = { ...prev }
        delete novosErros[errorKey]
        return novosErros
      })
    }
  }


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Cursos e Formações</h3>
        </div>

        {!disabled && (
          <Button
            type="button"
            onClick={adicionarCurso}
            className="flex items-center gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar Curso
          </Button>
        )}
      </div>

      {cursos.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <GraduationCap className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {disabled
                ? 'Nenhum curso foi adicionado'
                : 'Nenhum curso adicionado ainda. Clique em "Adicionar Curso" para começar.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cursos.map((curso, index) => (
            <Card key={curso.id}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Curso {index + 1}
                  </CardTitle>
                  {!disabled && cursos.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerCurso(curso.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`nomeCurso_${curso.id}`}>Nome do Curso *</Label>
                    <Input
                      id={`nomeCurso_${curso.id}`}
                      value={curso.nomeCurso}
                      onChange={(e) => handleInputChange(curso.id, 'nomeCurso', e.target.value)}
                      className={errors[`nomeCurso_${curso.id}`] ? 'border-destructive' : ''}
                      disabled={disabled}
                      placeholder="Ex: Desenvolvimento Web"
                    />
                    {errors[`nomeCurso_${curso.id}`] && (
                      <Alert variant="destructive">
                        <AlertDescription>{errors[`nomeCurso_${curso.id}`]}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`instituicao_${curso.id}`}>Instituição *</Label>
                    <Input
                      id={`instituicao_${curso.id}`}
                      value={curso.instituicao}
                      onChange={(e) => handleInputChange(curso.id, 'instituicao', e.target.value)}
                      className={errors[`instituicao_${curso.id}`] ? 'border-destructive' : ''}
                      disabled={disabled}
                      placeholder="Ex: Universidade XYZ"
                    />
                    {errors[`instituicao_${curso.id}`] && (
                      <Alert variant="destructive">
                        <AlertDescription>{errors[`instituicao_${curso.id}`]}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`dataConclusao_${curso.id}`}>Data de Conclusão *</Label>
                    <Input
                      id={`dataConclusao_${curso.id}`}
                      type="date"
                      value={curso.dataConclusao}
                      onChange={(e) => handleInputChange(curso.id, 'dataConclusao', e.target.value)}
                      className={errors[`dataConclusao_${curso.id}`] ? 'border-destructive' : ''}
                      disabled={disabled}
                    />
                    {errors[`dataConclusao_${curso.id}`] && (
                      <Alert variant="destructive">
                        <AlertDescription>{errors[`dataConclusao_${curso.id}`]}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`cargaHoraria_${curso.id}`}>Carga Horária (horas)</Label>
                    <Input
                      id={`cargaHoraria_${curso.id}`}
                      type="number"
                      min="1"
                      value={curso.cargaHoraria}
                      onChange={(e) => handleInputChange(curso.id, 'cargaHoraria', e.target.value)}
                      className={errors[`cargaHoraria_${curso.id}`] ? 'border-destructive' : ''}
                      disabled={disabled}
                      placeholder="Ex: 40"
                    />
                    {errors[`cargaHoraria_${curso.id}`] && (
                      <Alert variant="destructive">
                        <AlertDescription>{errors[`cargaHoraria_${curso.id}`]}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!disabled && cursos.length > 0 && (
        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            onClick={adicionarCurso}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Outro Curso
          </Button>
        </div>
      )}
    </div>
  )
}

export default CursosFormacoes

