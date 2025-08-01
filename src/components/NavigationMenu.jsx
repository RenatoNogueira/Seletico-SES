import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Mail, MapPin, Briefcase, Video, Upload, GraduationCap, ChevronRight } from 'lucide-react'

const NavigationMenu = () => {
  const [activeSection, setActiveSection] = useState('')

  const sections = [
    {
      id: 'informacoes-pessoais',
      title: 'Informações Pessoais',
      icon: User,
      selector: '[data-section="informacoes-pessoais"]'
    },
    {
      id: 'informacoes-contato',
      title: 'Informações de Contato',
      icon: Mail,
      selector: '[data-section="informacoes-contato"]'
    },
    {
      id: 'endereco',
      title: 'Endereço',
      icon: MapPin,
      selector: '[data-section="endereco"]'
    },
    {
      id: 'informacoes-profissionais',
      title: 'Informações Profissionais',
      icon: Briefcase,
      selector: '[data-section="informacoes-profissionais"]'
    },
    {
      id: 'video-pessoal',
      title: 'Vídeo Pessoal',
      icon: Video,
      selector: '[data-section="video-pessoal"]'
    },
    {
      id: 'documentos',
      title: 'Documentos PDF',
      icon: Upload,
      selector: '[data-section="documentos"]'
    },
    {
      id: 'cursos-formacoes',
      title: 'Cursos e Formações',
      icon: GraduationCap,
      selector: '[data-section="cursos-formacoes"]'
    }
  ]

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // Offset para melhor detecção

      for (const section of sections) {
        const element = document.querySelector(section.selector)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + window.scrollY
          const elementBottom = elementTop + rect.height

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Verificar posição inicial

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Card className="sticky top-4 h-fit">
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
          Navegação Rápida
        </h3>
        
        <div className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            
            return (
              <Button
                key={section.id}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(section.id)}
                className={`w-full justify-start text-left h-auto py-2 px-3 ${
                  isActive 
                    ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                    : 'hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-xs leading-tight flex-1">
                  {section.title}
                </span>
                {isActive && (
                  <ChevronRight className="w-3 h-3 ml-1 flex-shrink-0" />
                )}
              </Button>
            )
          })}
        </div>
        
        <div className="mt-4 pt-3 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Clique em uma seção para navegar rapidamente
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default NavigationMenu

