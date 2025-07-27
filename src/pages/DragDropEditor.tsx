import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { Palette, Type, Image as Images, Video, Save, Eye, Download, Trash2 } from '@phosphor-icons/react';

interface DragDropElement {
  id: string;
  type: 'text' | 'image' | 'video';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style: {g;

    <div className="min-h-screen bg-background">
      <div className="flex">
          <h2 className="font-semibold text-lg">Elements</h2>
              className="w-full justify-start gap-2"
              className="w-full justify-start gap-2"
              onClick={() => addElement('image')}
const DragDropEditor = () => {
  const [elements, setElements] = useState<DragDropElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<DragDropElement | null>(null);
n>
  const addElement = (type: 'text' | 'image' | 'video') => {
    const newElement: DragDropElement = {
      id: `element-${Date.now()}`,
      type,ement('video')}
      content: type === 'text' ? 'Sample Text' : type === 'image' ? '/api/placeholder/300/200' : '/api/placeholder/video',
      x: 50," />
      y: 50,d Video
      width: type === 'text' ? 200 : 300,
      height: type === 'text' ? 50 : 200,
      style: {
        fontSize: '16px',
        color: '#000000',
        backgroundColor: type === 'text' ? 'transparent' : '#f0f0f0',
        borderRadius: '8px'nded-lg min-h-[600px] relative">
    setElements([...elements, newElement]);    <div className="min-h-screen bg-background">      <div className="flex">        {/* Sidebar */}        <div className="w-64 bg-card border-r p-4 space-y-4">          <h2 className="font-semibold text-lg">Elements</h2>          <div className="space-y-2">            <Button               variant="outline"               className="w-full justify-start gap-2"              onClick={() => addElement('text')}            >              <Type className="w-4 h-4" />              Add Text            </Button>            <Button               variant="outline"               className="w-full justify-start gap-2"              onClick={() => addElement('image')}            >              <Images className="w-4 h-4" />              Add Image            </Button>            <Button               variant="outline"               className="w-full justify-start gap-2"              onClick={() => addElement('video')}            >              <Video className="w-4 h-4" />              Add Video            </Button>        <div className="flex-1 p-4">          <div className="bg-white border rounded-lg min-h-[600px] relative">            {elements.map((element) => (              <div                key={element.id}                className={`absolute border ${selectedElement?.id === element.id ? 'border-blue-500' : 'border-gray-300'} rounded cursor-move`}                style={{                  left: element.x,                  top: element.y,                  width: element.width,                  height: element.height,                  ...element.style                onClick={() => setSelectedElement(element)}                {element.type === 'text' && (                  <div className="p-2">{element.content}</div>                )}                {element.type === 'image' && (                  <img src={element.content} alt="Element" className="w-full h-full object-cover rounded" />                )}                {element.type === 'video' && (                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">                    <Video className="w-8 h-8 text-gray-500" />            ))}};