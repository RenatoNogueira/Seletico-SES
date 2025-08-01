import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { validateCPF, formatCPF, validateBirthDate } from '../utils/validations'
import { User, Calendar, LogIn } from 'lucide-react'

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    cpf: '',
    dataNascimento: ''
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

    // Simular delay de autenticação
    setTimeout(() => {
      onLogin(formData.cpf, formData.dataNascimento)
      setIsLoading(false)
      navigate('/formulario')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <LogIn className="w-6 h-6 text-primary-foreground" />
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

