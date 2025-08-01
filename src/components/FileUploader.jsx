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

  const MAX_FILES = 5 // Limite máximo de arquivos

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
    setError('')

    // Verificar se o limite máximo será excedido
    if (files.length + newFiles.length > MAX_FILES) {
      setError(`Você pode enviar no máximo ${MAX_FILES} arquivos. Remova alguns arquivos antes de adicionar novos.`)
      return
    }

    const validFiles = []
    const errors = []

    Array.from(newFiles).forEach(file => {
      const validationError = validateFile(file)
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`)
      } else {
        // Verificar se o arquivo já foi adicionado
        const isDuplicate = files.some(existingFile =>
          existingFile.name === file.name && existingFile.size === file.size
        )

        if (!isDuplicate) {
          validFiles.push({
            file,
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            uploadedAt: new Date()
          })
        } else {
          errors.push(`${file.name}: Arquivo já foi adicionado`)
        }
      }
    })

    if (errors.length > 0) {
      setError(errors.join('\n'))
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles].slice(0, MAX_FILES) // Garante que não ultrapasse o limite
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
      // Limpar o input para permitir selecionar o mesmo arquivo novamente se necessário
      e.target.value = ''
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
    if (!disabled && fileInputRef.current && files.length < MAX_FILES) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-4">
      {/* Área de Upload */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${dragActive
          ? 'border-primary bg-primary/5'
          : disabled || files.length >= MAX_FILES
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
          <Upload className={`w-12 h-12 mb-4 ${disabled || files.length >= MAX_FILES ? 'text-muted-foreground' : 'text-muted-foreground'}`} />

          <div className="space-y-2">
            <p className={`text-lg font-medium ${disabled || files.length >= MAX_FILES ? 'text-muted-foreground' : ''}`}>
              {disabled
                ? 'Upload desabilitado'
                : files.length >= MAX_FILES
                  ? 'Limite de arquivos atingido'
                  : 'Clique ou arraste arquivos PDF aqui'}
            </p>
            <p className={`text-sm ${disabled || files.length >= MAX_FILES ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
              {disabled
                ? 'Arquivos já foram enviados'
                : files.length >= MAX_FILES
                  ? `Máximo de ${MAX_FILES} arquivos permitidos`
                  : 'Apenas arquivos PDF até 10MB'}
            </p>
          </div>

          {!disabled && files.length < MAX_FILES && (
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
        disabled={disabled || files.length >= MAX_FILES}
      />

      {/* Mensagem de erro */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
        </Alert>
      )}

      {/* Contador de arquivos */}
      <div className="text-sm text-muted-foreground">
        {files.length} de {MAX_FILES} arquivos selecionados
      </div>

      {/* Lista de arquivos */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">
            Arquivos Selecionados
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