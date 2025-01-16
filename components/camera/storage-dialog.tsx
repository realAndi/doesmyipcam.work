import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw } from 'lucide-react'
import { formatBytes } from '@/lib/utils'

interface StorageFile {
  name: string
  size: number
}

interface StorageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  camera: {
    ip: string
    port: string
    username?: string
    password?: string
  }
}

const PAGE_SIZE = 20
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

export function StorageDialog({ open, onOpenChange, camera }: StorageDialogProps) {
  const [files, setFiles] = useState<StorageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  const getCacheKey = useCallback(() => {
    return `storage-files-${camera.ip}-${camera.port}`
  }, [camera.ip, camera.port])

  const getCachedFiles = useCallback(() => {
    const key = getCacheKey()
    const cached = localStorage.getItem(key)
    if (!cached) return null

    try {
      const { files, timestamp } = JSON.parse(cached)
      // Check if cache is expired
      if (Date.now() - timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(key)
        return null
      }
      return files
    } catch {
      localStorage.removeItem(key)
      return null
    }
  }, [getCacheKey])

  const setCachedFiles = useCallback((files: StorageFile[]) => {
    const key = getCacheKey()
    localStorage.setItem(key, JSON.stringify({
      files,
      timestamp: Date.now()
    }))
  }, [getCacheKey])

  const fetchFiles = useCallback(async () => {
    try {
      setError(null)
      const url = `http://${camera.ip}:${camera.port}/form/getStorageFileList`
      const params = new URLSearchParams({
        url: url,
        ...(camera.username && { username: camera.username }),
        ...(camera.password && { password: camera.password })
      })

      const response = await fetch(`/api/storage?${params}`)
      if (!response.ok) throw new Error('Failed to fetch storage files')
      
      const data = await response.json()
      if (!data.success) throw new Error('Failed to get storage files')
      
      // Cache the full list
      setCachedFiles(data.files)
      
      // Update state with paginated results
      setFiles(data.files.slice(0, PAGE_SIZE))
      setHasMore(data.files.length > PAGE_SIZE)
      setPage(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load storage files')
    } finally {
      setLoading(false)
    }
  }, [camera, setCachedFiles])

  const loadMore = useCallback(async () => {
    setLoadingMore(true)
    const cachedFiles = getCachedFiles()
    if (!cachedFiles) {
      console.log('Cache expired during pagination, fetching fresh data')
      await fetchFiles()
      setLoadingMore(false)
      return
    }

    const start = 0
    const end = (page + 1) * PAGE_SIZE
    const newFiles = cachedFiles.slice(start, end)
    
    console.log(`Loading more files: showing first ${end} files`)
    setFiles(newFiles)
    setHasMore(cachedFiles.length > end)
    setPage(prev => prev + 1)
    setLoadingMore(false)
  }, [page, getCachedFiles, fetchFiles])

  const handleDownload = async (fileName: string) => {
    try {
      const url = `http://${camera.ip}:${camera.port}/disk/IPCAMERA_Window/${fileName}`
      const params = new URLSearchParams({
        url: url,
        ...(camera.username && { username: camera.username }),
        ...(camera.password && { password: camera.password })
      })

      const response = await fetch(`/api/proxy?${params}`)
      if (!response.ok) throw new Error('Failed to download file')
      
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = fileName
      
      document.body.appendChild(link)
      link.click()
      
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      console.error('Download error:', err)
      setError(err instanceof Error ? err.message : 'Failed to download file')
    }
  }

  const handleRefresh = useCallback(async () => {
    setLoading(true)
    setPage(0)
    setFiles([])
    await fetchFiles()
  }, [fetchFiles])

  // Initial load
  useEffect(() => {
    if (!open) return

    const loadInitialData = async () => {
      setLoading(true)
      const cachedFiles = getCachedFiles()
      if (cachedFiles) {
        console.log('Using cached files')
        setFiles(cachedFiles.slice(0, PAGE_SIZE))
        setHasMore(cachedFiles.length > PAGE_SIZE)
        setPage(1)
        setLoading(false)
        return
      }

      console.log('Cache miss, fetching files')
      await fetchFiles()
    }

    loadInitialData()
  }, [open, getCachedFiles, fetchFiles])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh files"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <DialogTitle>Camera Storage</DialogTitle>
          </div>
        </DialogHeader>
        
        {loading && <div className="text-center py-4">Loading storage files...</div>}
        {error && <div className="text-center text-red-500 py-4">{error}</div>}
        
        {!loading && !error && (
          <div className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="w-[100px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.name}>
                      <TableCell>{file.name}</TableCell>
                      <TableCell>{formatBytes(file.size)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(file.name)}
                          title="Download file"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {hasMore && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 