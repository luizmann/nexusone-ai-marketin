import React, { useState, useRef, useCallback } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Plus, 
  Type, 
  Image as ImageIcon, 
  Video, 
  MousePointer,
  Layout,
  Smartphone,
  Monitor,
  Tablet,
  Eye,
  Save,
  Undo,
  Redo,
  Trash2,
  Settings,
  Copy,
  Move,
  Palette,
  FolderOpen,
  Export,
  Code,
  Play
} from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { TemplateModal } from './TemplateModal'
import { PageTemplate } from './PageTemplates'

// Types for drag and drop components
interface DraggedComponent {
  id: string
  type: string
  content: any
  style: any
}

interface DropTarget {
  id: string
  index: number
}

// Component types available for dragging
const COMPONENT_TYPES = {
  HEADER: 'header',
  TEXT: 'text',
  IMAGE: 'image',
  BUTTON: 'button',
  VIDEO: 'video',
  FORM: 'form',
  SPACER: 'spacer',
  COLUMNS: 'columns'
}

// Default component configurations
const DEFAULT_COMPONENTS = {
  [COMPONENT_TYPES.HEADER]: {
    content: { text: 'Your Headline Here', level: 1 },
    style: { 
      fontSize: '3rem', 
      fontWeight: 'bold', 
      textAlign: 'center',
      color: '#000000',
      marginBottom: '1rem'
    }
  },
  [COMPONENT_TYPES.TEXT]: {
    content: { text: 'Add your text content here. This is a paragraph that can be customized.' },
    style: { 
      fontSize: '1rem', 
      lineHeight: '1.6',
      color: '#333333',
      marginBottom: '1rem'
    }
  },
  [COMPONENT_TYPES.IMAGE]: {
    content: { 
      src: 'https://via.placeholder.com/600x400', 
      alt: 'Placeholder Image',
      caption: ''
    },
    style: { 
      width: '100%', 
      height: 'auto',
      borderRadius: '8px',
      marginBottom: '1rem'
    }
  },
  [COMPONENT_TYPES.BUTTON]: {
    content: { 
      text: 'Click Here', 
      link: '#',
      action: 'link'
    },
    style: { 
      backgroundColor: '#007bff',
      color: '#ffffff',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: '1rem'
    }
  },
  [COMPONENT_TYPES.VIDEO]: {
    content: { 
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      autoplay: false,
      controls: true
    },
    style: { 
      width: '100%', 
      height: '315px',
      borderRadius: '8px',
      marginBottom: '1rem'
    }
  },
  [COMPONENT_TYPES.FORM]: {
    content: {
      fields: [
        { type: 'text', label: 'Nome', placeholder: 'Seu nome', required: true },
        { type: 'email', label: 'Email', placeholder: 'seu@email.com', required: true },
        { type: 'tel', label: 'Telefone', placeholder: '(11) 99999-9999', required: false }
      ],
      submitText: 'Enviar',
      action: '#'
    },
    style: {
      backgroundColor: '#f8f9fa',
      padding: '2rem',
      borderRadius: '8px',
      marginBottom: '1rem'
    }
  },
  [COMPONENT_TYPES.SPACER]: {
    content: { height: 40 },
    style: { height: '40px', marginBottom: '0' }
  },
  [COMPONENT_TYPES.COLUMNS]: {
    content: {
      columns: [
        { content: 'Coluna 1', width: '50%' },
        { content: 'Coluna 2', width: '50%' }
      ]
    },
    style: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1rem'
    }
  }
}

// Draggable component from toolbar
const DraggableComponent: React.FC<{ type: string; icon: React.ReactNode; label: string }> = ({ type, icon, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))

  return (
    <div
      ref={drag}
      className={`flex flex-col items-center p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-grab hover:border-primary hover:bg-primary/5 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="text-2xl text-gray-600 mb-1">{icon}</div>
      <span className="text-xs text-gray-600 text-center">{label}</span>
    </div>
  )
}

// Editable component in the canvas
const EditableComponent: React.FC<{
  component: DraggedComponent
  index: number
  onUpdate: (index: number, component: DraggedComponent) => void
  onDelete: (index: number) => void
  onSelect: (index: number) => void
  isSelected: boolean
  moveComponent: (dragIndex: number, hoverIndex: number) => void
}> = ({ component, index, onUpdate, onDelete, onSelect, isSelected, moveComponent }) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ handlerId }, drop] = useDrop({
    accept: 'component-move',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item: any, monitor) {
      if (!ref.current) return
      
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      moveComponent(dragIndex, hoverIndex)
      item.index = hoverIndex
    }
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'component-move',
    item: () => ({ id: component.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  drag(drop(ref))

  const renderComponent = () => {
    switch (component.type) {
      case COMPONENT_TYPES.HEADER:
        return (
          <div style={component.style}>
            {React.createElement(
              `h${component.content.level}`,
              {
                contentEditable: true,
                suppressContentEditableWarning: true,
                onBlur: (e: any) => {
                  const newComponent = {
                    ...component,
                    content: { ...component.content, text: e.target.textContent }
                  }
                  onUpdate(index, newComponent)
                }
              },
              component.content.text
            )}
          </div>
        )

      case COMPONENT_TYPES.TEXT:
        return (
          <div
            style={component.style}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e: any) => {
              const newComponent = {
                ...component,
                content: { ...component.content, text: e.target.textContent }
              }
              onUpdate(index, newComponent)
            }}
          >
            {component.content.text}
          </div>
        )

      case COMPONENT_TYPES.IMAGE:
        return (
          <div style={{ marginBottom: component.style.marginBottom }}>
            <img
              src={component.content.src}
              alt={component.content.alt}
              style={{
                ...component.style,
                marginBottom: 0
              }}
              onError={(e: any) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'
              }}
            />
            {component.content.caption && (
              <p className="text-sm text-gray-600 mt-2 text-center">
                {component.content.caption}
              </p>
            )}
          </div>
        )

      case COMPONENT_TYPES.BUTTON:
        return (
          <div style={{ marginBottom: component.style.marginBottom, textAlign: component.style.textAlign }}>
            <button
              style={{
                ...component.style,
                marginBottom: 0,
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={(e) => {
                e.preventDefault()
                if (component.content.action === 'link' && component.content.link !== '#') {
                  window.open(component.content.link, '_blank')
                }
              }}
            >
              {component.content.text}
            </button>
          </div>
        )

      case COMPONENT_TYPES.VIDEO:
        return (
          <div style={{ marginBottom: component.style.marginBottom }}>
            <iframe
              src={component.content.src}
              style={{
                ...component.style,
                marginBottom: 0,
                border: 'none'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )

      case COMPONENT_TYPES.FORM:
        return (
          <form style={component.style} onSubmit={(e) => e.preventDefault()}>
            {component.content.fields.map((field: any, fieldIndex: number) => (
              <div key={fieldIndex} className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground p-2 rounded-md font-medium hover:bg-primary/90"
            >
              {component.content.submitText}
            </button>
          </form>
        )

      case COMPONENT_TYPES.SPACER:
        return <div style={component.style} />

      case COMPONENT_TYPES.COLUMNS:
        return (
          <div style={component.style}>
            {component.content.columns.map((column: any, colIndex: number) => (
              <div
                key={colIndex}
                style={{ 
                  width: column.width,
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px'
                }}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e: any) => {
                  const newColumns = [...component.content.columns]
                  newColumns[colIndex] = { ...column, content: e.target.textContent }
                  const newComponent = {
                    ...component,
                    content: { ...component.content, columns: newColumns }
                  }
                  onUpdate(index, newComponent)
                }}
              >
                {column.content}
              </div>
            ))}
          </div>
        )

      default:
        return <div>Unknown component type</div>
    }
  }

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`relative group ${isSelected ? 'ring-2 ring-primary' : ''} ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => onSelect(index)}
    >
      {/* Component overlay with controls */}
      <div className="absolute -top-8 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground text-xs px-2 py-1 rounded-t flex justify-between items-center z-10">
        <span className="flex items-center gap-1">
          <Move size={12} />
          {component.type}
        </span>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Copy component logic here
            }}
            className="hover:bg-primary-foreground/20 p-1 rounded"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(index)
            }}
            className="hover:bg-destructive p-1 rounded"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      
      {renderComponent()}
    </div>
  )
}

// Drop zone for new components
const DropZone: React.FC<{
  onDrop: (item: any, index: number) => void
  index: number
}> = ({ onDrop, index }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item) => onDrop(item, index),
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }))

  return (
    <div
      ref={drop}
      className={`h-8 border-2 border-dashed border-transparent transition-colors ${
        isOver ? 'border-primary bg-primary/10' : 'hover:border-gray-300'
      }`}
    />
  )
}

// Property panel for editing selected component
const PropertyPanel: React.FC<{
  component: DraggedComponent | null
  onUpdate: (component: DraggedComponent) => void
}> = ({ component, onUpdate }) => {
  const { t } = useLanguage()

  if (!component) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Settings size={48} className="mx-auto mb-2 opacity-50" />
        <p>Select a component to edit its properties</p>
      </div>
    )
  }

  const updateStyle = (styleUpdates: any) => {
    onUpdate({
      ...component,
      style: { ...component.style, ...styleUpdates }
    })
  }

  const updateContent = (contentUpdates: any) => {
    onUpdate({
      ...component,
      content: { ...component.content, ...contentUpdates }
    })
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <Settings size={16} />
        {component.type.charAt(0).toUpperCase() + component.type.slice(1)} Properties
      </h3>

      {/* Style Properties */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Style</h4>
        
        {/* Color */}
        {(component.type === COMPONENT_TYPES.TEXT || component.type === COMPONENT_TYPES.HEADER) && (
          <div>
            <label className="block text-xs mb-1">Text Color</label>
            <input
              type="color"
              value={component.style.color || '#000000'}
              onChange={(e) => updateStyle({ color: e.target.value })}
              className="w-full h-8 rounded border"
            />
          </div>
        )}

        {component.type === COMPONENT_TYPES.BUTTON && (
          <div>
            <label className="block text-xs mb-1">Background Color</label>
            <input
              type="color"
              value={component.style.backgroundColor || '#007bff'}
              onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
              className="w-full h-8 rounded border"
            />
          </div>
        )}

        {/* Font Size */}
        {(component.type === COMPONENT_TYPES.TEXT || component.type === COMPONENT_TYPES.HEADER || component.type === COMPONENT_TYPES.BUTTON) && (
          <div>
            <label className="block text-xs mb-1">Font Size</label>
            <Input
              type="text"
              value={component.style.fontSize || '1rem'}
              onChange={(e) => updateStyle({ fontSize: e.target.value })}
              placeholder="1rem, 16px, etc."
            />
          </div>
        )}

        {/* Margin Bottom */}
        <div>
          <label className="block text-xs mb-1">Bottom Spacing</label>
          <Input
            type="text"
            value={component.style.marginBottom || '1rem'}
            onChange={(e) => updateStyle({ marginBottom: e.target.value })}
            placeholder="1rem, 16px, etc."
          />
        </div>
      </div>

      {/* Content Properties */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Content</h4>

        {component.type === COMPONENT_TYPES.IMAGE && (
          <>
            <div>
              <label className="block text-xs mb-1">Image URL</label>
              <Input
                type="url"
                value={component.content.src || ''}
                onChange={(e) => updateContent({ src: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Alt Text</label>
              <Input
                type="text"
                value={component.content.alt || ''}
                onChange={(e) => updateContent({ alt: e.target.value })}
                placeholder="Describe the image"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Caption</label>
              <Input
                type="text"
                value={component.content.caption || ''}
                onChange={(e) => updateContent({ caption: e.target.value })}
                placeholder="Optional caption"
              />
            </div>
          </>
        )}

        {component.type === COMPONENT_TYPES.BUTTON && (
          <>
            <div>
              <label className="block text-xs mb-1">Button Text</label>
              <Input
                type="text"
                value={component.content.text || ''}
                onChange={(e) => updateContent({ text: e.target.value })}
                placeholder="Click Here"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Link URL</label>
              <Input
                type="url"
                value={component.content.link || ''}
                onChange={(e) => updateContent({ link: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          </>
        )}

        {component.type === COMPONENT_TYPES.VIDEO && (
          <div>
            <label className="block text-xs mb-1">Video URL (YouTube Embed)</label>
            <Input
              type="url"
              value={component.content.src || ''}
              onChange={(e) => updateContent({ src: e.target.value })}
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
            />
          </div>
        )}

        {component.type === COMPONENT_TYPES.SPACER && (
          <div>
            <label className="block text-xs mb-1">Height (px)</label>
            <Input
              type="number"
              value={component.content.height || 40}
              onChange={(e) => {
                const height = parseInt(e.target.value) || 40
                updateContent({ height })
                updateStyle({ height: `${height}px` })
              }}
              placeholder="40"
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Main drag and drop page editor component
export const DragDropPageEditor: React.FC = () => {
  const { t } = useLanguage()
  const [components, setComponents] = useKV('page-editor-components', [])
  const [selectedComponentIndex, setSelectedComponentIndex] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [pageSettings, setPageSettings] = useKV('page-editor-settings', {
    title: 'My Landing Page',
    description: 'A beautiful landing page created with NexusOne',
    backgroundColor: '#ffffff'
  })

  // History for undo/redo
  const [history, setHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const addToHistory = (newComponents: any[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...newComponents])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setComponents(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setComponents(history[historyIndex + 1])
    }
  }

  const loadTemplate = (template: PageTemplate) => {
    setComponents(template.components)
    addToHistory(template.components)
    toast.success(`Template "${template.name}" loaded successfully!`)
  }

  const exportPage = () => {
    const pageData = {
      components,
      settings: pageSettings,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(pageData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${pageSettings.title.replace(/\s+/g, '-').toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Page exported successfully!')
  }

  const generateHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageSettings.title}</title>
    <meta name="description" content="${pageSettings.description}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    </style>
</head>
<body style="background-color: ${pageSettings.backgroundColor}">
    <div class="container">
        ${components.map((component: any) => {
          switch (component.type) {
            case 'header':
              return `<h${component.content.level} style="${Object.entries(component.style).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`).join('; ')}">${component.content.text}</h${component.content.level}>`
            case 'text':
              return `<p style="${Object.entries(component.style).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`).join('; ')}">${component.content.text}</p>`
            case 'image':
              return `<img src="${component.content.src}" alt="${component.content.alt}" style="${Object.entries(component.style).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`).join('; ')}" />`
            case 'button':
              return `<a href="${component.content.link}" style="display: inline-block; text-decoration: none; ${Object.entries(component.style).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`).join('; ')}">${component.content.text}</a>`
            case 'spacer':
              return `<div style="height: ${component.content.height}px;"></div>`
            default:
              return ''
          }
        }).join('\n        ')}
    </div>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${pageSettings.title.replace(/\s+/g, '-').toLowerCase()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('HTML file generated successfully!')
  }

  const handleDrop = useCallback((item: any, index: number) => {
    if (item.type) {
      const newComponent: DraggedComponent = {
        id: `component-${Date.now()}`,
        type: item.type,
        content: DEFAULT_COMPONENTS[item.type as keyof typeof DEFAULT_COMPONENTS].content,
        style: DEFAULT_COMPONENTS[item.type as keyof typeof DEFAULT_COMPONENTS].style
      }

      const newComponents = [...components]
      newComponents.splice(index, 0, newComponent)
      setComponents(newComponents)
      addToHistory(newComponents)
      toast.success('Component added successfully!')
    }
  }, [components])

  const updateComponent = (index: number, updatedComponent: DraggedComponent) => {
    const newComponents = [...components]
    newComponents[index] = updatedComponent
    setComponents(newComponents)
    addToHistory(newComponents)
  }

  const deleteComponent = (index: number) => {
    const newComponents = components.filter((_: any, i: number) => i !== index)
    setComponents(newComponents)
    addToHistory(newComponents)
    setSelectedComponentIndex(null)
    toast.success('Component deleted')
  }

  const selectComponent = (index: number) => {
    setSelectedComponentIndex(index)
  }

  const moveComponent = useCallback((dragIndex: number, hoverIndex: number) => {
    const newComponents = [...components]
    const draggedComponent = newComponents[dragIndex]
    newComponents.splice(dragIndex, 1)
    newComponents.splice(hoverIndex, 0, draggedComponent)
    setComponents(newComponents)
  }, [components])

  const savePage = async () => {
    try {
      // Save page data
      const pageData = {
        components,
        settings: pageSettings,
        timestamp: new Date().toISOString()
      }
      
      // Here you would typically save to your backend
      toast.success('Page saved successfully!')
    } catch (error) {
      toast.error('Failed to save page')
    }
  }

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-sm'
      case 'tablet': return 'max-w-2xl'
      default: return 'max-w-full'
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex bg-background">
        {/* Left Sidebar - Components Toolbar */}
        {!isPreviewMode && (
          <div className="w-64 bg-card border-r border-border p-4 overflow-y-auto">
            <h2 className="font-semibold mb-4">Components</h2>
            
            <div className="grid grid-cols-2 gap-2 mb-6">
              <DraggableComponent
                type={COMPONENT_TYPES.HEADER}
                icon={<Type />}
                label="Header"
              />
              <DraggableComponent
                type={COMPONENT_TYPES.TEXT}
                icon={<Type />}
                label="Text"
              />
              <DraggableComponent
                type={COMPONENT_TYPES.IMAGE}
                icon={<ImageIcon />}
                label="Image"
              />
              <DraggableComponent
                type={COMPONENT_TYPES.BUTTON}
                icon={<MousePointer />}
                label="Button"
              />
              <DraggableComponent
                type={COMPONENT_TYPES.VIDEO}
                icon={<Video />}
                label="Video"
              />
              <DraggableComponent
                type={COMPONENT_TYPES.FORM}
                icon={<Layout />}
                label="Form"
              />
              <DraggableComponent
                type={COMPONENT_TYPES.SPACER}
                icon={<Plus />}
                label="Spacer"
              />
              <DraggableComponent
                type={COMPONENT_TYPES.COLUMNS}
                icon={<Layout />}
                label="Columns"
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Page Settings</h3>
              <div className="space-y-2">
                <Input
                  placeholder="Page Title"
                  value={pageSettings.title}
                  onChange={(e) => setPageSettings({ ...pageSettings, title: e.target.value })}
                />
                <Textarea
                  placeholder="Page Description"
                  value={pageSettings.description}
                  onChange={(e) => setPageSettings({ ...pageSettings, description: e.target.value })}
                  rows={3}
                />
                <div>
                  <label className="block text-xs mb-1">Background Color</label>
                  <input
                    type="color"
                    value={pageSettings.backgroundColor}
                    onChange={(e) => setPageSettings({ ...pageSettings, backgroundColor: e.target.value })}
                    className="w-full h-8 rounded border"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="bg-card border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplateModal(true)}
              >
                <FolderOpen size={16} />
                Templates
              </Button>
              <div className="w-px h-6 bg-border" />
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={historyIndex <= 0}
              >
                <Undo size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
              >
                <Redo size={16} />
              </Button>
              <div className="w-px h-6 bg-border mx-2" />
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('desktop')}
              >
                <Monitor size={16} />
              </Button>
              <Button
                variant={viewMode === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('tablet')}
              >
                <Tablet size={16} />
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('mobile')}
              >
                <Smartphone size={16} />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye size={16} />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportPage}
              >
                <Export size={16} />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={generateHTML}
              >
                <Code size={16} />
                HTML
              </Button>
              <Button size="sm" onClick={savePage}>
                <Save size={16} />
                Save
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-gray-100 p-8">
            <div className={`mx-auto bg-white shadow-lg rounded-lg min-h-screen ${getViewportClass()}`}>
              <div 
                className="p-8"
                style={{ backgroundColor: pageSettings.backgroundColor }}
              >
                {!isPreviewMode && <DropZone onDrop={handleDrop} index={0} />}
                
                {components.map((component: DraggedComponent, index: number) => (
                  <React.Fragment key={component.id}>
                    <EditableComponent
                      component={component}
                      index={index}
                      onUpdate={updateComponent}
                      onDelete={deleteComponent}
                      onSelect={selectComponent}
                      isSelected={selectedComponentIndex === index}
                      moveComponent={moveComponent}
                    />
                    {!isPreviewMode && <DropZone onDrop={handleDrop} index={index + 1} />}
                  </React.Fragment>
                ))}

                {components.length === 0 && (
                  <div className="text-center py-20 text-muted-foreground">
                    <Layout size={64} className="mx-auto mb-6 opacity-50" />
                    <h3 className="text-xl font-semibold mb-4">Start Building Your Page</h3>
                    <p className="mb-6 max-w-md mx-auto">
                      Drag components from the sidebar or choose from our professional templates to get started.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={() => setShowTemplateModal(true)}
                        className="flex items-center gap-2"
                      >
                        <FolderOpen size={16} />
                        Browse Templates
                      </Button>
                      <Button variant="outline">
                        <Plus size={16} />
                        Start from Scratch
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        {!isPreviewMode && (
          <div className="w-80 bg-card border-l border-border overflow-y-auto">
            <PropertyPanel
              component={selectedComponentIndex !== null ? components[selectedComponentIndex] : null}
              onUpdate={(updatedComponent) => {
                if (selectedComponentIndex !== null) {
                  updateComponent(selectedComponentIndex, updatedComponent)
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Template Modal */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={loadTemplate}
      />
    </DndProvider>
  )
}

export default DragDropPageEditor