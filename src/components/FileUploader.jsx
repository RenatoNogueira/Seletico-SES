import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'

const documentTypes = [
  { id: 'rg', label: 'RG' },
  { id: 'residencia', label: 'Comprovante de Residência' },
  { id: 'diploma', label: 'Diploma' },
  { id: 'registro', label: 'Registro Profissional' },
  { id: 'carta', label: 'Carta Profissional' },
]

const FileUploader = ({ onFilesChange, disabled = false }) => {
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [selectedType, setSelectedType] = useState(documentTypes[0].id)
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    if (file.type !== 'application/pdf') return 'Apenas arquivos PDF são permitidos'
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) return 'Arquivo muito grande. Máximo: 10MB'
    return null
  }

  const handleFiles = (newFiles) => {
    setError('')
    const file = newFiles[0]
    const validationError = validateFile(file)

    if (validationError) {
      setError(`${file.name}: ${validationError}`)
      return
    }

    const alreadyExists = files.find(f => f.type === selectedType)
    if (alreadyExists) {
      setError(`Já existe um arquivo para "${getTypeLabel(selectedType)}". Remova antes de adicionar outro.`)
      return
    }

    const fileData = {
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: selectedType,
      uploadedAt: new Date(),
    }

    const updatedFiles = [...files, fileData]
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const removeFile = (fileId) => {
    if (disabled) return
    const updatedFiles = files.filter(file => file.id !== fileId)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const getTypeLabel = (typeId) =>
    documentTypes.find((d) => d.id === typeId)?.label || 'Desconhecido'

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-4">
      {/* Selecionar tipo de documento */}
      <div>
        <label htmlFor="docType" className="block mb-1 text-sm font-medium">
          Tipo de Documento *
        </label>
        <select
          id="docType"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          disabled={disabled}
          className="border rounded-md px-3 py-2 w-full text-sm"
        >
          {documentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Área de Upload */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${dragActive
          ? 'border-primary bg-primary/5'
          : disabled
            ? 'border-muted bg-muted/20 cursor-not-allowed'
            : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
          }`}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false) }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          if (!disabled && e.dataTransfer.files[0]) handleFiles(e.dataTransfer.files)
        }}
        onClick={openFileDialog}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
          <p className="text-lg font-medium">
            {disabled ? 'Upload desabilitado' : 'Clique ou arraste um arquivo PDF aqui'}
          </p>
          <p className="text-sm text-muted-foreground">
            {disabled
              ? 'Arquivos já enviados'
              : `1 arquivo por tipo. Apenas PDF até 10MB`}
          </p>
          {!disabled && (
            <Button type="button" variant="outline" className="mt-4" onClick={(e) => {
              e.stopPropagation()
              openFileDialog()
            }}>
              Selecionar Arquivo
            </Button>
          )}
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

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
            Documentos Enviados ({files.length}/4)
          </h4>
          {files.map((fileData) => (
            <Card key={fileData.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium text-sm">{fileData.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getTypeLabel(fileData.type)} — {(fileData.size / 1024 / 1024).toFixed(2)} MB
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
      )}
    </div>
  )
}


export default FileUploader

