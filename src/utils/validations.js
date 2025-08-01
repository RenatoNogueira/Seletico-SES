// Função para validar CPF
export const validateCPF = (cpf) => {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '')
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false
  
  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.charAt(9))) return false
  
  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.charAt(10))) return false
  
  return true
}

// Função para formatar CPF
export const formatCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '')
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

// Função para validar data de nascimento
export const validateBirthDate = (date) => {
  if (!date) return false
  
  const birthDate = new Date(date)
  const today = new Date()
  
  // Verifica se a data é válida
  if (isNaN(birthDate.getTime())) return false
  
  // Verifica se a data não é futura
  if (birthDate > today) return false
  
  // Verifica se a pessoa tem pelo menos 16 anos
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 16
  }
  
  return age >= 16
}

// Função para validar email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Função para validar CEP
export const validateCEP = (cep) => {
  const cepRegex = /^\d{5}-?\d{3}$/
  return cepRegex.test(cep)
}

// Função para formatar CEP
export const formatCEP = (cep) => {
  cep = cep.replace(/[^\d]/g, '')
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2')
}

// Função para validar URL de vídeo
export const validateVideoURL = (url) => {
  if (!url) return true // Campo opcional
  
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/
  const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/\d+/
  const generalVideoRegex = /^https?:\/\/.+/
  
  return youtubeRegex.test(url) || vimeoRegex.test(url) || generalVideoRegex.test(url)
}

