import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { validateCPF, formatCPF, validateBirthDate } from '../utils/validations'
import { User, Calendar, LogIn } from 'lucide-react'
import { register } from '../services/authService.js' // Importe apenas o registro

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    cpf: '',
    dataNascimento: '',
    email: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === 'cpf') {
      const formattedCPF = formatCPF(value)
      setFormData(prev => ({ ...prev, [name]: formattedCPF }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // Validar email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setSuccessMessage('');
    
    const cpfLimpo = formData.cpf.replace(/\D/g, '');
    const isoDate = new Date(formData.dataNascimento).toISOString().split('T')[0];

    try {
      console.log('Enviando dados para registro:', {
        cpf: cpfLimpo,
        dataNascimento: isoDate,
        email: formData.email,
      });

      const response = await register({
        cpf: cpfLimpo,
        dataNascimento: isoDate,
        email: formData.email,
        password: isoDate
      });

      console.log('Resposta do servidor:', response);
      setSuccessMessage('Registro realizado com sucesso!');
      
      // Limpar formulário após sucesso
      setFormData({
        cpf: '',
        dataNascimento: '',
        email: ''
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      
      let errorMessage = 'Erro ao registrar. Tente novamente.';
      if (error.response) {
        // Se o backend retornou uma mensagem de erro
        errorMessage = error.response.data?.detail || error.response.data?.message || errorMessage;
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        errorMessage = 'Sem resposta do servidor. Verifique sua conexão.';
      }
      
      setErrors({ cpf: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img
              src="/public/preta.png"
              alt="Logo"
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Sistema de Cadastro</CardTitle>
          <CardDescription>
            Preencha seus dados para realizar o cadastro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
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
              {isLoading ? 'Registrando...' : 'Registrar'}
            </Button>
            
            {successMessage && (
              <Alert variant="success">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
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