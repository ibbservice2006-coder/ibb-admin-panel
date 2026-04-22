import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Edit, 
  Trash2, 
  MoreVertical,
  Pin,
  Archive,
  Clock,
  User,
  Filter,
  SortAsc,
  SortDesc,
  Star,
  StarOff
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function Notes() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Product Launch Meeting Notes',
      content: 'Discussed Q4 product launch strategy. Key points: target market analysis, pricing strategy, and marketing channels.',
      author: 'John Doe',
      createdAt: '2025-10-05 14:30',
      updatedAt: '2025-10-05 14:30',
      category: 'Meeting',
      isPinned: true,
      isStarred: true,
      comments: [
        { id: 1, author: 'Jane Smith', content: 'Great summary! Can we add competitor analysis?', timestamp: '2025-10-05 15:00' },
        { id: 2, author: 'John Doe', content: 'Sure, I\'ll add that in the next update.', timestamp: '2025-10-05 15:15' }
      ]
    },
    {
      id: 2,
      title: 'Customer Feedback Summary',
      content: 'Compiled feedback from 50+ customers. Main concerns: shipping delays and product quality. Positive feedback on customer service.',
      author: 'Jane Smith',
      createdAt: '2025-10-04 10:15',
      updatedAt: '2025-10-04 16:45',
      category: 'Feedback',
      isPinned: false,
      isStarred: false,
      comments: []
    },
    {
      id: 3,
      title: 'Development Roadmap Q4',
      content: 'Priority features: mobile app improvements, API v2 launch, dashboard redesign. Timeline: 3 months.',
      author: 'Mike Johnson',
      createdAt: '2025-10-03 09:00',
      updatedAt: '2025-10-03 09:00',
      category: 'Development',
      isPinned: true,
      isStarred: false,
      comments: [
        { id: 1, author: 'Sarah Lee', content: 'Should we prioritize the API launch?', timestamp: '2025-10-03 10:30' }
      ]
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('updated')
  const [sortOrder, setSortOrder] = useState('desc')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  
  // Form states
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formCategory, setFormCategory] = useState('General')
  const [commentText, setCommentText] = useState('')

  const categories = ['General', 'Meeting', 'Feedback', 'Development', 'Marketing', 'Sales', 'Support']

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           note.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === 'all' || note.category === filterCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      let comparison = 0
      
      // Pinned notes always come first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      // Then sort by selected criteria
      if (sortBy === 'updated') {
        comparison = new Date(b.updatedAt) - new Date(a.updatedAt)
      } else if (sortBy === 'created') {
        comparison = new Date(b.createdAt) - new Date(a.createdAt)
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title)
      }
      
      return sortOrder === 'desc' ? comparison : -comparison
    })

  const handleCreateNote = () => {
    if (!formTitle.trim() || !formContent.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    const newNote = {
      id: notes.length + 1,
      title: formTitle,
      content: formContent,
      author: 'Current User',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      category: formCategory,
      isPinned: false,
      isStarred: false,
      comments: []
    }

    setNotes([newNote, ...notes])
    setIsCreateDialogOpen(false)
    setFormTitle('')
    setFormContent('')
    setFormCategory('General')
    
    toast({
      title: 'Success',
      description: 'Note created successfully'
    })
  }

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId))
    toast({
      title: 'Success',
      description: 'Note deleted successfully'
    })
  }

  const handleTogglePin = (noteId) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    ))
  }

  const handleToggleStar = (noteId) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, isStarred: !note.isStarred } : note
    ))
  }

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedNote) return

    const newComment = {
      id: selectedNote.comments.length + 1,
      author: 'Current User',
      content: commentText,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
    }

    setNotes(notes.map(note => 
      note.id === selectedNote.id 
        ? { ...note, comments: [...note.comments, newComment], updatedAt: newComment.timestamp }
        : note
    ))

    setSelectedNote({
      ...selectedNote,
      comments: [...selectedNote.comments, newComment]
    })

    setCommentText('')
    
    toast({
      title: 'Success',
      description: 'Comment added successfully'
    })
  }

  const handleViewNote = (note) => {
    setSelectedNote(note)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes & Comments</h1>
          <p className="text-muted-foreground mt-1">
            Manage your notes, ideas, and team discussions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white gap-2">
              <Plus className="h-4 w-4" />
              Create Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
              <DialogDescription>
                Add a new note to keep track of important information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  placeholder="Enter note title" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea 
                  placeholder="Write your note here..." 
                  rows={6}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreateNote}>Create Note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search notes..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            >
              {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Notes</p>
                <p className="text-2xl font-bold">{notes.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pinned</p>
                <p className="text-2xl font-bold">{notes.filter(n => n.isPinned).length}</p>
              </div>
              <Pin className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Starred</p>
                <p className="text-2xl font-bold">{notes.filter(n => n.isStarred).length}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Comments</p>
                <p className="text-2xl font-bold">{notes.reduce((sum, n) => sum + n.comments.length, 0)}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map(note => (
          <Card 
            key={note.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer relative group"
            onClick={() => handleViewNote(note)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {note.isPinned && <Pin className="h-3 w-3 text-orange-500 flex-shrink-0" />}
                    {note.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                    <CardTitle className="text-lg truncate">{note.title}</CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <User className="h-3 w-3" />
                    {note.author}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      handleTogglePin(note.id)
                    }}>
                      <Pin className="h-4 w-4 mr-2" />
                      {note.isPinned ? 'Unpin' : 'Pin'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      handleToggleStar(note.id)
                    }}>
                      {note.isStarred ? <StarOff className="h-4 w-4 mr-2" /> : <Star className="h-4 w-4 mr-2" />}
                      {note.isStarred ? 'Unstar' : 'Star'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteNote(note.id)
                    }}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {note.content}
              </p>
              <div className="flex items-center justify-between pt-2">
                <Badge variant="secondary">{note.category}</Badge>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {note.comments.length}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No notes found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}

      {/* View Note Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
          {selectedNote && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  {selectedNote.isPinned && <Pin className="h-4 w-4 text-orange-500" />}
                  {selectedNote.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                  <DialogTitle>{selectedNote.title}</DialogTitle>
                </div>
                <DialogDescription className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {selectedNote.author}
                  </span>
                  <Badge variant="secondary" className="text-xs">{selectedNote.category}</Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedNote.updatedAt}
                  </span>
                </DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="max-h-[50vh]">
                <div className="space-y-4 py-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Content</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {selectedNote.content}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Comments ({selectedNote.comments.length})
                    </h4>
                    
                    <div className="space-y-3 mb-4">
                      {selectedNote.comments.map(comment => (
                        <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))}
                      
                      {selectedNote.comments.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No comments yet. Be the first to comment!
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Add a comment..." 
                        rows={2}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <Button className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleAddComment} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
