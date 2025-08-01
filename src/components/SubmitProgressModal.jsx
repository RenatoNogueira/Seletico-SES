import { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Upload, FileCheck, Send, Loader2 } from 'lucide-react'

const SubmitProgressModal = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    {
      id: 1,
      label: 'Validando dados do formulário',
      icon: FileCheck,
      duration: 800
    },
    {
      id: 2,
      label: 'Processando arquivos PDF',
      icon: Upload,
      duration: 1200
    },
    {
      id: 3,
      label: 'Enviando informações',
      icon: Send,
      duration: 1000
    },
    {
      id: 4,
      label: 'Finalizando envio',
      icon: CheckCircle,
      duration: 500
    }
  ]

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0)
      setProgress(0)
      return
    }

    let stepIndex = 0
    let progressValue = 0

    const processStep = () => {
      if (stepIndex >= steps.length) {
        setProgress(100)
        setTimeout(() => {
          onComplete()
        }, 500)
        return
      }

      const step = steps[stepIndex]
      setCurrentStep(stepIndex)

      // Simular progresso gradual para o passo atual
      const stepProgress = 100 / steps.length
      const startProgress = stepIndex * stepProgress
      const endProgress = (stepIndex + 1) * stepProgress

      let currentProgress = startProgress
      const increment = (endProgress - startProgress) / (step.duration / 50)

      const progressInterval = setInterval(() => {
        currentProgress += increment
        if (currentProgress >= endProgress) {
          currentProgress = endProgress
          clearInterval(progressInterval)
          
          setProgress(currentProgress)
          stepIndex++
          
          setTimeout(() => {
            processStep()
          }, 200)
        } else {
          setProgress(currentProgress)
        }
      }, 50)
    }

    // Iniciar o processo após um pequeno delay
    setTimeout(() => {
      processStep()
    }, 300)

  }, [isOpen, onComplete])

  if (!isOpen) return null

  const currentStepData = steps[currentStep]
  const CurrentIcon = currentStepData?.icon || Loader2

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" hideClose>
        <div className="flex flex-col items-center space-y-6 py-6">
          {/* Ícone animado */}
          <div className="relative">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CurrentIcon 
                className={`w-8 h-8 text-primary ${
                  currentStepData?.id === 4 ? '' : 'animate-pulse'
                }`} 
              />
            </div>
            {currentStepData?.id !== 4 && (
              <div className="absolute -inset-2 border-2 border-primary/20 rounded-full animate-ping" />
            )}
          </div>

          {/* Texto do passo atual */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">
              {currentStepData?.id === 4 ? 'Envio Concluído!' : 'Enviando Formulário...'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentStepData?.label || 'Processando...'}
            </p>
          </div>

          {/* Barra de progresso */}
          <div className="w-full space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Indicadores de passos */}
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep || (index === currentStep && progress >= (index + 1) * 25)
              const isCurrent = index === currentStep
              const StepIcon = step.icon

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                    ${isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-400'
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`
                      w-8 h-0.5 mx-1
                      ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Mensagem adicional */}
          {currentStepData?.id === 4 ? (
            <p className="text-xs text-center text-muted-foreground">
              Redirecionando para a página de sucesso...
            </p>
          ) : (
            <p className="text-xs text-center text-muted-foreground">
              Por favor, aguarde enquanto processamos suas informações.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SubmitProgressModal

