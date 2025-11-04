import { useCallback, useEffect, useRef } from 'react'
import { createYouTubeController, type YouTubeController } from './videofunction'

export function useVideoControl(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
  const controllerRef = useRef<YouTubeController | null>(null)

  useEffect(() => {
    if (iframeRef.current) {
      controllerRef.current = createYouTubeController(iframeRef.current)
    }
  }, [iframeRef])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const startVideo = useCallback(() => {
    try {
      if (!controllerRef.current && iframeRef.current) {
        controllerRef.current = createYouTubeController(iframeRef.current)
      }
      controllerRef.current?.seekTo(0, true)
      controllerRef.current?.mute()
      controllerRef.current?.play()
      // Retry a few times in case the iframe isn't fully ready yet
      let attempts = 0
      const maxAttempts = 10
      const retry = () => {
        attempts += 1
        if (attempts >= maxAttempts) return
        controllerRef.current?.play()
        setTimeout(retry, 300)
      }
      setTimeout(retry, 300)
      // Unmute shortly after playback begins
      setTimeout(() => controllerRef.current?.unmute(), 400)
    } catch (error) {
      console.error('Error starting video:', error)
    }
  }, [])

  const restartVideo = useCallback(() => {
    try {
      if (!controllerRef.current && iframeRef.current) {
        controllerRef.current = createYouTubeController(iframeRef.current)
      }
      controllerRef.current?.seekTo(0, true)
      controllerRef.current?.pause()
    } catch (error) {
      console.error('Error restarting video:', error)
    }
  }, [])

  const pauseVideo = useCallback(() => {
    try {
      controllerRef.current?.pause()
    } catch {
      // Ignore errors on pause
    }
  }, [])

  return { startVideo, restartVideo, pauseVideo }
}

