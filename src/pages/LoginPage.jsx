import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { validateCPF, formatCPF, validateBirthDate } from '../utils/validations'
import { User, Calendar, LogIn } from 'lucide-react'
//import {register, login} from '@/services/authService'
import { login, register } from '../services/authService.js'
import {buscarCandidatoPorCPF} from '../services/candidatoService.js'
const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    cpf: '',
    dataNascimento: '',
    email: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === 'cpf') {
      // Formatar CPF automaticamente
      const formattedCPF = formatCPF(value)
      setFormData(prev => ({ ...prev, [name]: formattedCPF }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar CPF
    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório'
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido'
    }

    // Validar data de nascimento
    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória'
    } else if (!validateBirthDate(formData.dataNascimento)) {
      newErrors.dataNascimento = 'Data de nascimento inválida ou idade menor que 16 anos'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  if (!validateForm()) return

  setIsLoading(true)

  try {
    const cpfDigitado = formData.cpf.replace(/\D/g, '')

    // Tenta buscar diretamente pelo CPF
    const candidato = await buscarCandidatoPorCPF(cpfDigitado)

    if (candidato) {
      console.log('Candidato já existe, redirecionando...')
      await login({
      userName: cpfDigitado,
      password: formData.dataNascimento,
})
      navigate('/formulario')
    }
  } catch (error) {
    if (error.response?.status === 404) {
      // Se não achou o candidato, tenta registrar
      try {
        const cadastro = await register({
          cpf: formData.cpf.replace(/\D/g, ''),
          dataNascimento: formData.dataNascimento,
          email: formData.email,
        })

        console.log('Cadastro feito com sucesso:', cadastro)
        onLogin(formData.cpf, formData.dataNascimento)
        navigate('/formulario')

      } catch (cadastroErro) {
        console.error('Erro no cadastro:', cadastroErro.response?.data || cadastroErro.message)
        setErrors({ cpf: 'Erro ao cadastrar usuário.' })
      }
    } else {
      console.error('Erro inesperado:', error.response?.data || error.message)
      setErrors({ cpf: 'Erro ao verificar cadastro.' })
    }
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img
              src="/public/preta.png" // Substitua pelo caminho real da logo
              alt="Logo"
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Sistema de Formulário</CardTitle>
          <CardDescription>
            Entre com seu CPF e data de nascimento para acessar o formulário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cpf"
                  name="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.cpf ? 'border-destructive' : ''}`}
                  maxLength={14}
                />
              </div>
              {errors.cpf && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.cpf}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dataNascimento"
                  name="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.dataNascimento ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.dataNascimento && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.dataNascimento}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <LogIn className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.email && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.email}</AlertDescription>
                </Alert>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Sistema seguro de cadastro de dados pessoais</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage

