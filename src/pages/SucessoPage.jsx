import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, User, Mail, MapPin, Briefcase, Video, Upload, GraduationCap, Home, FileText, Edit, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'

const SucessoPage = ({ data, onEdit }) => {
  const navigate = useNavigate()

  const formatCPF = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatCEP = (cep) => {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const getEscolaridadeLabel = (value) => {
    const labels = {
      'fundamental-incompleto': 'Ensino Fundamental Incompleto',
      'fundamental-completo': 'Ensino Fundamental Completo',
      'medio-incompleto': 'Ensino Médio Incompleto',
      'medio-completo': 'Ensino Médio Completo',
      'superior-incompleto': 'Ensino Superior Incompleto',
      'superior-completo': 'Ensino Superior Completo',
      'pos-graduacao': 'Pós-graduação',
      'mestrado': 'Mestrado',
      'doutorado': 'Doutorado'
    }
    return labels[value] || value
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

  const handleNovoFormulario = () => {
    navigate('/')
  }

  const handleEditarFormulario = () => {
    if (onEdit) {
      onEdit(data)
    }
    
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
              Formulário Enviado com Sucesso!
            </h1>
            <p className="text-muted-foreground">
              Seus dados foram recebidos e processados com sucesso. 
              Abaixo você pode visualizar as informações enviadas.
            </p>
            <Badge variant="secondary" className="mt-4">
              Enviado em {new Date().toLocaleString('pt-BR')}
            </Badge>
          </CardContent>
        </Card>

        {/* Alerta de Edição */}
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Encontrou algum erro ou esqueceu de adicionar algo?</strong> 
            <br />
            Você pode editar suas informações clicando no botão "Editar Formulário" abaixo. 
            Suas alterações substituirão os dados enviados anteriormente.
          </AlertDescription>
        </Alert>

        {/* Dados Enviados */}
        <div className="space-y-6">
          
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle>Informações Pessoais</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome Completo</p>
                  <p className="font-medium">{data.nomeCompleto}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{formatCPF(data.cpf)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">RG</p>
                  <p className="font-medium">{data.rg}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="font-medium">{formatDate(data.dataNascimento)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado Civil</p>
                  <p className="font-medium">{getEstadoCivilLabel(data.estadoCivil)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nacionalidade</p>
                  <p className="font-medium">{data.nacionalidade}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Contato */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <CardTitle>Informações de Contato</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.telefoneFixo && (
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone Fixo</p>
                    <p className="font-medium">{data.telefoneFixo}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Celular</p>
                  <p className="font-medium">{data.celular}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{data.email}</p>
                </div>
                {data.emailAlternativo && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email Alternativo</p>
                    <p className="font-medium">{data.emailAlternativo}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <CardTitle>Endereço</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">CEP</p>
                  <p className="font-medium">{formatCEP(data.cep)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Logradouro</p>
                  <p className="font-medium">{data.logradouro}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Número</p>
                  <p className="font-medium">{data.numero}</p>
                </div>
                {data.complemento && (
                  <div>
                    <p className="text-sm text-muted-foreground">Complemento</p>
                    <p className="font-medium">{data.complemento}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Bairro</p>
                  <p className="font-medium">{data.bairro}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cidade</p>
                  <p className="font-medium">{data.cidade}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <p className="font-medium">{data.estado}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Profissionais e Educacionais */}
          {data.informacoesProfissionaisEducacionais && data.informacoesProfissionaisEducacionais.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <CardTitle>Informações Profissionais e Educacionais</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.informacoesProfissionaisEducacionais.map((info, index) => (
                    <div key={info.id} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">
                        {info.tipo === 'profissional' ? 'Experiência Profissional' : 'Formação Educacional'} {index + 1}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {info.tipo === 'profissional' ? (
                          <>
                            <div>
                              <p className="text-sm text-muted-foreground">Profissão</p>
                              <p className="font-medium">{info.profissao}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Empresa</p>
                              <p className="font-medium">{info.empresa}</p>
                            </div>
                            {info.cargo && (
                              <div>
                                <p className="text-sm text-muted-foreground">Cargo</p>
                                <p className="font-medium">{info.cargo}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-muted-foreground">Data de Início</p>
                              <p className="font-medium">{formatDate(info.dataInicio)}</p>
                            </div>
                            {!info.atual && info.dataFim && (
                              <div>
                                <p className="text-sm text-muted-foreground">Data de Fim</p>
                                <p className="font-medium">{formatDate(info.dataFim)}</p>
                              </div>
                            )}
                            {info.atual && (
                              <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge variant="secondary">Emprego Atual</Badge>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div>
                              <p className="text-sm text-muted-foreground">Escolaridade</p>
                              <p className="font-medium">{getEscolaridadeLabel(info.escolaridade)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Instituição</p>
                              <p className="font-medium">{info.instituicao}</p>
                            </div>
                            {info.curso && (
                              <div>
                                <p className="text-sm text-muted-foreground">Curso</p>
                                <p className="font-medium">{info.curso}</p>
                              </div>
                            )}
                            {info.dataFormatura && (
                              <div>
                                <p className="text-sm text-muted-foreground">Data de Formatura</p>
                                <p className="font-medium">{formatDate(info.dataFormatura)}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Link do Vídeo */}
          {data.linkVideo && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" />
                  <CardTitle>Vídeo Pessoal</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm text-muted-foreground">URL do Vídeo</p>
                  <a 
                    href={data.linkVideo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {data.linkVideo}
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Arquivos Enviados */}
          {data.arquivos && data.arquivos.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  <CardTitle>Arquivos Enviados</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {data.arquivos.length} arquivo(s) PDF enviado(s) com sucesso:
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
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Importante:</strong> Os arquivos foram enviados com sucesso. 
                      Se precisar alterar os arquivos, você pode editá-los através do botão "Editar Formulário".
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cursos e Formações */}
          {data.cursos && data.cursos.length > 0 && data.cursos.some(curso => curso.nomeCurso) && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <CardTitle>Cursos e Formações</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.cursos.filter(curso => curso.nomeCurso).map((curso, index) => (
                    <div key={curso.id} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Curso {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Nome do Curso</p>
                          <p className="font-medium">{curso.nomeCurso}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Instituição</p>
                          <p className="font-medium">{curso.instituicao}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Data de Conclusão</p>
                          <p className="font-medium">{formatDate(curso.dataConclusao)}</p>
                        </div>
                        {curso.cargaHoraria && (
                          <div>
                            <p className="text-sm text-muted-foreground">Carga Horária</p>
                            <p className="font-medium">{curso.cargaHoraria} horas</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleEditarFormulario} 
            variant="outline"
            className="flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            <Edit className="w-4 h-4" />
            Editar Formulário
          </Button>
          
          <Button onClick={handleNovoFormulario} className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Preencher Novo Formulário
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SucessoPage

