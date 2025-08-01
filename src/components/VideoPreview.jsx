import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Play, ExternalLink, AlertCircle } from 'lucide-react'

const VideoPreview = ({ videoUrl, disabled = false }) => {
  const [videoInfo, setVideoInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Função para extrair informações do vídeo da URL
  const extractVideoInfo = (url) => {
    if (!url) return null

    try {
      const urlObj = new URL(url)
      
      // YouTube
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        let videoId = ''
        
        if (urlObj.hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1)
        } else if (urlObj.pathname === '/watch') {
          videoId = urlObj.searchParams.get('v')
        } else if (urlObj.pathname.startsWith('/embed/')) {
          videoId = urlObj.pathname.split('/embed/')[1]
        }
        
        if (videoId) {
          return {
            platform: 'youtube',
            videoId: videoId,
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            watchUrl: `https://www.youtube.com/watch?v=${videoId}`
          }
        }
      }
      
      // Vimeo
      if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.split('/').pop()
        
        if (videoId && /^\d+$/.test(videoId)) {
          return {
            platform: 'vimeo',
            videoId: videoId,
            embedUrl: `https://player.vimeo.com/video/${videoId}`,
            thumbnailUrl: `https://vumbnail.com/${videoId}.jpg`,
            watchUrl: url
          }
        }
      }
      
      // Outras plataformas (genérico)
      return {
        platform: 'other',
        videoId: null,
        embedUrl: null,
        thumbnailUrl: null,
        watchUrl: url
      }
      
    } catch (e) {
      return null
    }
  }

  useEffect(() => {
    if (!videoUrl || !videoUrl.trim()) {
      setVideoInfo(null)
      setError('')
      return
    }

    setIsLoading(true)
    setError('')

    const info = extractVideoInfo(videoUrl.trim())
    
    if (!info) {
      setError('URL de vídeo inválida. Verifique se a URL está correta.')
      setVideoInfo(null)
      setIsLoading(false)
      return
    }

    setVideoInfo(info)
    setIsLoading(false)
  }, [videoUrl])

  if (!videoUrl || !videoUrl.trim()) {
    return null
  }

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Carregando prévia...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!videoInfo) {
    return null
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">
              Prévia do Vídeo - {videoInfo.platform === 'youtube' ? 'YouTube' : 
                                 videoInfo.platform === 'vimeo' ? 'Vimeo' : 'Outro'}
            </span>
          </div>
          
          {/* Prévia para YouTube e Vimeo */}
          {(videoInfo.platform === 'youtube' || videoInfo.platform === 'vimeo') && videoInfo.embedUrl && (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={videoInfo.embedUrl}
                className="absolute top-0 left-0 w-full h-full rounded-md"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Prévia do Vídeo"
              />
            </div>
          )}
          
          {/* Fallback para outras plataformas */}
          {videoInfo.platform === 'other' && (
            <div className="flex items-center justify-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-md">
              <div className="text-center space-y-2">
                <Play className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Prévia não disponível para esta plataforma
                </p>
                <a 
                  href={videoInfo.watchUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  Abrir vídeo
                </a>
              </div>
            </div>
          )}
          
          {/* Link para abrir o vídeo */}
          {videoInfo.watchUrl && (videoInfo.platform === 'youtube' || videoInfo.platform === 'vimeo') && (
            <div className="flex justify-center">
              <a 
                href={videoInfo.watchUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm"
              >
                <ExternalLink className="w-3 h-3" />
                Abrir no {videoInfo.platform === 'youtube' ? 'YouTube' : 'Vimeo'}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default VideoPreview

