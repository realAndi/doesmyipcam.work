declare module '@cycjimmy/jsmpeg-player' {
  interface JSMpegOptions {
    canvas?: HTMLElement
    audio?: boolean
    videoBufferSize?: number
    preserveDrawingBuffer?: boolean
    onPlay?: () => void
    onError?: () => void
  }

  class Player {
    constructor(url: string, options?: JSMpegOptions)
    destroy(): void
  }

  export default {
    Player
  }
} 