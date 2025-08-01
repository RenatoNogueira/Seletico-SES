import axios from 'axios'

// Função para buscar endereço pelo CEP usando a API ViaCEP
export const fetchAddressByCEP = async (cep) => {
  try {
    // Remove caracteres não numéricos do CEP
    const cleanCEP = cep.replace(/[^\d]/g, '')
    
    // Verifica se o CEP tem 8 dígitos
    if (cleanCEP.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos')
    }
    
    // Faz a requisição para a API ViaCEP
    const response = await axios.get(`https://viacep.com.br/ws/${cleanCEP}/json/`)
    
    // Verifica se houve erro na resposta
    if (response.data.erro) {
      throw new Error('CEP não encontrado')
    }
    
    return {
      success: true,
      data: {
        logradouro: response.data.logradouro || '',
        bairro: response.data.bairro || '',
        cidade: response.data.localidade || '',
        estado: response.data.uf || '',
        cep: response.data.cep || cep
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Erro ao buscar CEP'
    }
  }
}

