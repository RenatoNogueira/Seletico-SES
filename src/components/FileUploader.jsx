import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'

const FileUploader = ({ onFilesChange, disabled = false }) => {
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    // Verificar se é PDF
    if (file.type !== 'application/pdf') {
      return 'Apenas arquivos PDF são permitidos'
    }
    
    // Verificar tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB em bytes
    if (file.size > maxSize) {
      return 'Arquivo muito grande. Máximo permitido: 10MB'
    }
    
    return null
  }

  const handleFiles = (newFiles) => {
    setError('') // Limpar erros anteriores
    const validFiles = []
    const errors = []

    // Verificar se já atingiu o limite de 5 arquivos
    if (files.length >= 5) {
      setError('Limite máximo de 5 arquivos atingido')
      return
    }

    Array.from(newFiles).forEach(file => {
      // Verificar se ainda há espaço para mais arquivos
      if (files.length + validFiles.length >= 5) {
        errors.push(`Limite máximo de 5 arquivos. Arquivo "${file.name}" não foi adicionado`)
        return
      }

      const validationError = validateFile(file)
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`)
      } else {
        // Verificar se o arquivo já foi adicionado (nome + tamanho + tipo)
        const isDuplicate = files.some(existingFile => 
          existingFile.name === file.name && 
          existingFile.size === file.size &&
          existingFile.file.type === file.type
        )
        
        // Verificar também entre os arquivos que estão sendo adicionados agora
        const isDuplicateInNewFiles = validFiles.some(newFile =>
          newFile.name === file.name &&
          newFile.size === file.size &&
          newFile.file.type === file.type
        )
        
        if (isDuplicate || isDuplicateInNewFiles) {
          errors.push(`"${file.name}": Este arquivo já foi adicionado`)
        } else {
          validFiles.push({
            file,
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            uploadedAt: new Date()
          })
        }
      }
    })

    // Exibir erros se houver
    if (errors.length > 0) {
      setError(errors.join('; '))
      // Manter o erro visível por mais tempo
      setTimeout(() => {
        // Não limpar automaticamente para que o usuário possa ler
      }, 5000)
    }

    // Adicionar arquivos válidos
    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles]
      setFiles(updatedFiles)
      onFilesChange(updatedFiles)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (fileId) => {
    if (disabled) return
    
    const updatedFiles = files.filter(file => file.id !== fileId)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-4">
      {/* Área de Upload */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : disabled 
              ? 'border-muted bg-muted/20 cursor-not-allowed' 
              : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Upload className={`w-12 h-12 mb-4 ${disabled ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
          
          <div className="space-y-2">
            <p className={`text-lg font-medium ${disabled ? 'text-muted-foreground' : ''}`}>
              {disabled ? 'Upload desabilitado' : 'Clique ou arraste arquivos PDF aqui'}
            </p>
            <p className={`text-sm ${disabled ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
              {disabled ? 'Arquivos já foram enviados' : 'Apenas arquivos PDF até 10MB (máximo 5 arquivos)'}
            </p>
          </div>
          
          {!disabled && (
            <Button 
              type="button" 
              variant="outline" 
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation()
                openFileDialog()
              }}
            >
              Selecionar Arquivos
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,application/pdf"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Mensagem de erro */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Lista de arquivos */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">
            Arquivos Selecionados ({files.length}/5)
          </h4>
          
          <div className="space-y-2">
            {files.map((fileData) => (
              <Card key={fileData.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium text-sm">{fileData.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(fileData.size)}
                      </p>
                    </div>
                  </div>
                  
                  {!disabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(fileData.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploader

