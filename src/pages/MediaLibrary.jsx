import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Search, Upload, Trash2, Image, File, Video, Music, Download, Eye, Grid3x3, List, FileText, FileSpreadsheet, Presentation, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function MediaLibrary() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef = useState(null)

  const [mediaFiles, setMediaFiles] = useState([
    {
      id: 1,
      name: 'product-laptop-1.jpg',
      type: 'image',
      size: '2.4 MB',
      dimensions: '1920x1080',
      url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      uploadedBy: 'John Doe',
      uploadedAt: '2024-10-05 09:30 AM',
      usedIn: ['Products', 'Blog']
    },
    {
      id: 2,
      name: 'banner-sale.png',
      type: 'image',
      size: '1.8 MB',
      dimensions: '1600x900',
      url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400',
      uploadedBy: 'Sarah Smith',
      uploadedAt: '2024-10-04 02:15 PM',
      usedIn: ['Homepage', 'Marketing']
    },
    {
      id: 3,
      name: 'product-headphones.jpg',
      type: 'image',
      size: '3.1 MB',
      dimensions: '2400x1600',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      uploadedBy: 'Mike Johnson',
      uploadedAt: '2024-10-03 11:20 AM',
      usedIn: ['Products']
    },
    {
      id: 4,
      name: 'tutorial-video.mp4',
      type: 'video',
      size: '45.2 MB',
      dimensions: '1920x1080',
      url: null,
      uploadedBy: 'Emily Brown',
      uploadedAt: '2024-10-02 03:45 PM',
      usedIn: ['Support', 'FAQ']
    },
    {
      id: 5,
      name: 'product-catalog.pdf',
      type: 'document',
      size: '8.7 MB',
      dimensions: null,
      url: null,
      uploadedBy: 'David Wilson',
      uploadedAt: '2024-10-01 10:00 AM',
      usedIn: ['Downloads']
    },
    {
      id: 6,
      name: 'background-music.mp3',
      type: 'audio',
      size: '5.3 MB',
      dimensions: null,
      url: null,
      uploadedBy: 'Sarah Smith',
      uploadedAt: '2024-09-30 04:30 PM',
      usedIn: ['Videos']
    },
    {
      id: 7,
      name: 'hero-image.jpg',
      type: 'image',
      size: '4.2 MB',
      dimensions: '2560x1440',
      url: 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=400',
      uploadedBy: 'John Doe',
      uploadedAt: '2024-09-28 09:15 AM',
      usedIn: ['Homepage']
    },
    {
      id: 8,
      name: 'logo-transparent.png',
      type: 'image',
      size: '156 KB',
      dimensions: '512x512',
      url: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=400',
      uploadedBy: 'Mike Johnson',
      uploadedAt: '2024-09-25 01:20 PM',
      usedIn: ['Header', 'Footer', 'Email']
    },
    {
      id: 9,
      name: 'sales-report-q3.xlsx',
      type: 'spreadsheet',
      size: '2.1 MB',
      dimensions: null,
      url: null,
      uploadedBy: 'Sarah Smith',
      uploadedAt: '2024-10-06 11:30 AM',
      usedIn: ['Reports']
    },
    {
      id: 10,
      name: 'presentation-deck.pptx',
      type: 'presentation',
      size: '12.5 MB',
      dimensions: null,
      url: null,
      uploadedBy: 'Emily Brown',
      uploadedAt: '2024-10-05 03:15 PM',
      usedIn: ['Meetings']
    },
    {
      id: 11,
      name: 'contract-template.docx',
      type: 'document',
      size: '456 KB',
      dimensions: null,
      url: null,
      uploadedBy: 'David Wilson',
      uploadedAt: '2024-10-04 09:45 AM',
      usedIn: ['Legal']
    },
    {
      id: 12,
      name: 'database-backup.zip',
      type: 'archive',
      size: '124.8 MB',
      dimensions: null,
      url: null,
      uploadedBy: 'John Doe',
      uploadedAt: '2024-10-03 02:00 AM',
      usedIn: ['Backups']
    },
    {
      id: 13,
      name: 'app-source-code.zip',
      type: 'archive',
      size: '45.3 MB',
      dimensions: null,
      url: null,
      uploadedBy: 'Mike Johnson',
      uploadedAt: '2024-10-02 05:30 PM',
      usedIn: ['Development']
    },
    {
      id: 14,
      name: 'invoice-template.pdf',
      type: 'document',
      size: '234 KB',
      dimensions: null,
      url: null,
      uploadedBy: 'Sarah Smith',
      uploadedAt: '2024-10-01 10:15 AM',
      usedIn: ['Finance']
    }
  ])

  const mediaTypes = [
    { value: 'image', label: 'Images', icon: Image },
    { value: 'video', label: 'Videos', icon: Video },
    { value: 'audio', label: 'Audio', icon: Music },
    { value: 'document', label: 'Documents', icon: File },
    { value: 'spreadsheet', label: 'Spreadsheets', icon: File },
    { value: 'presentation', label: 'Presentations', icon: File },
    { value: 'archive', label: 'Archives', icon: File }
  ]

  const stats = [
    {
      title: 'Total Files',
      value: mediaFiles.length,
      icon: File,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Images & Media',
      value: mediaFiles.filter(m => ['image', 'video', 'audio'].includes(m.type)).length,
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Documents',
      value: mediaFiles.filter(m => ['document', 'spreadsheet', 'presentation'].includes(m.type)).length,
      icon: File,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Storage Used',
      value: '420.5 MB',
      icon: Download,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ]

  const filteredMedia = mediaFiles.filter(media => {
    const matchesSearch = media.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || media.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleViewClick = (media) => {
    setSelectedMedia(media)
    setIsViewDialogOpen(true)
  }

  const handleDeleteClick = (media) => {
    setSelectedMedia(media)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    setMediaFiles(mediaFiles.filter(media => media.id !== selectedMedia.id))
    setIsDeleteDialogOpen(false)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
  }

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to upload')
      return
    }

    // Simulate file upload
    const newFiles = selectedFiles.map((file, index) => {
      const fileType = file.type.split('/')[0] // 'image', 'video', 'audio', etc.
      let type = 'document'
      
      if (fileType === 'image') type = 'image'
      else if (fileType === 'video') type = 'video'
      else if (fileType === 'audio') type = 'audio'
      else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) type = 'spreadsheet'
      else if (file.name.endsWith('.pptx') || file.name.endsWith('.ppt')) type = 'presentation'
      else if (file.name.endsWith('.zip') || file.name.endsWith('.rar')) type = 'archive'

      return {
        id: mediaFiles.length + index + 1,
        name: file.name,
        type: type,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        dimensions: null,
        url: fileType === 'image' ? URL.createObjectURL(file) : null,
        uploadedBy: 'Admin User',
        uploadedAt: new Date().toLocaleString(),
        usedIn: []
      }
    })

    setMediaFiles([...newFiles, ...mediaFiles])
    setSelectedFiles([])
    setIsUploadDialogOpen(false)
    alert(`Successfully uploaded ${newFiles.length} file(s)!`)
  }

  const getMediaIcon = (type) => {
    const icons = {
      'image': Image,
      'video': Video,
      'audio': Music,
      'document': FileText,
      'spreadsheet': FileSpreadsheet,
      'presentation': Presentation,
      'archive': Archive
    }
    return icons[type] || File
  }

  const getMediaColor = (type) => {
    const colors = {
      'image': 'text-purple-600 bg-purple-50',
      'video': 'text-red-600 bg-red-50',
      'audio': 'text-green-600 bg-green-50',
      'document': 'text-blue-600 bg-blue-50',
      'spreadsheet': 'text-emerald-600 bg-emerald-50',
      'presentation': 'text-orange-600 bg-orange-50',
      'archive': 'text-gray-600 bg-gray-50'
    }
    return colors[type] || 'text-gray-600 bg-gray-50'
  }

  const formatFileSize = (size) => {
    return size
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Files & Media</h1>
        <p className="text-muted-foreground">Manage all your files including images, videos, documents, and more</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Media</CardTitle>
              <CardDescription>Browse and manage your media files</CardDescription>
            </div>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and View Toggle */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="File Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {mediaTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Media Grid/List */}
          {filteredMedia.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No media files found</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map((media) => {
                const MediaIcon = getMediaIcon(media.type)
                return (
                  <Card key={media.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                    <div 
                      className="aspect-square bg-muted flex items-center justify-center relative"
                      onClick={() => handleViewClick(media)}
                    >
                      {media.url ? (
                        <img 
                          src={media.url} 
                          alt={media.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`p-8 rounded-full ${getMediaColor(media.type)}`}>
                          <MediaIcon className="h-12 w-12" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="icon" variant="secondary" onClick={(e) => {
                          e.stopPropagation()
                          handleViewClick(media)
                        }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="destructive" onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(media)
                        }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <div className="font-medium text-sm truncate mb-1">{media.name}</div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{media.size}</span>
                        <Badge variant="outline" className="text-xs">
                          {media.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMedia.map((media) => {
                const MediaIcon = getMediaIcon(media.type)
                return (
                  <div 
                    key={media.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => handleViewClick(media)}
                  >
                    <div className={`p-3 rounded-lg ${getMediaColor(media.type)}`}>
                      <MediaIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{media.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {media.size} • Uploaded by {media.uploadedBy} on {media.uploadedAt}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{media.type}</Badge>
                      {media.dimensions && (
                        <Badge variant="secondary">{media.dimensions}</Badge>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(media)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Results Count */}
          {filteredMedia.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredMedia.length} of {mediaFiles.length} files
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>Upload images, videos, documents, and other media files</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer block"
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, GIF, MP4, PDF, MP3, DOCX, XLSX, PPTX, ZIP (Max 50MB)
              </p>
            </label>
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected files ({selectedFiles.length}):</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                      <File className="h-3 w-3" />
                      <span>{file.name}</span>
                      <span className="ml-auto">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              <p>• Images will be automatically optimized</p>
              <p>• Large files may take longer to upload</p>
              <p>• You can upload multiple files at once</p>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => {
              setIsUploadDialogOpen(false)
              setSelectedFiles([])
            }}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleUpload} disabled={selectedFiles.length === 0}>
              Start Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedMedia?.name}</DialogTitle>
            <DialogDescription>File details and information</DialogDescription>
          </DialogHeader>
          {selectedMedia && (
            <div className="space-y-4">
              {/* Preview */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {selectedMedia.url ? (
                  <img 
                    src={selectedMedia.url} 
                    alt={selectedMedia.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className={`p-12 rounded-full ${getMediaColor(selectedMedia.type)}`}>
                    {(() => {
                      const MediaIcon = getMediaIcon(selectedMedia.type)
                      return <MediaIcon className="h-24 w-24" />
                    })()}
                  </div>
                )}
              </div>

              <Separator />

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">File Name</Label>
                  <p className="font-medium">{selectedMedia.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">File Type</Label>
                  <p className="font-medium capitalize">{selectedMedia.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">File Size</Label>
                  <p className="font-medium">{selectedMedia.size}</p>
                </div>
                {selectedMedia.dimensions && (
                  <div>
                    <Label className="text-muted-foreground">Dimensions</Label>
                    <p className="font-medium">{selectedMedia.dimensions}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Uploaded By</Label>
                  <p className="font-medium">{selectedMedia.uploadedBy}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Uploaded At</Label>
                  <p className="font-medium">{selectedMedia.uploadedAt}</p>
                </div>
              </div>

              {selectedMedia.usedIn.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground">Used In</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedMedia.usedIn.map((location, index) => (
                        <Badge key={index} variant="secondary">{location}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => toast({ title: 'Download Started', description: 'Downloading file...' })}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              <strong> {selectedMedia?.name}</strong> from your media library.
              {selectedMedia?.usedIn && selectedMedia.usedIn.length > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                  ⚠️ This file is currently used in: {selectedMedia.usedIn.join(', ')}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
