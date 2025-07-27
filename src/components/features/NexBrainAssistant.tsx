import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Send, Loader2, Sparkles, MessageSquare, Copy, Download } from '@phosphor-icons/react';
import { useKV } from '@github/spark/hooks';
import { openaiChatService, type ChatMessage } from '@/lib/openai';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export function NexBrainAssistant() {
  const { t } = useLanguage();
  const [messages, setMessages] = useKV<ChatMessage[]>('nexbrain-messages', []);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useKV<string>('nexbrain-thread', '');
  const [contentType, setContentType] = useState<'marketing' | 'sales' | 'social'>('marketing');
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date(),
      threadId: threadId
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await openaiChatService.sendMessage(
        currentMessage,
        threadId,
        'current-user'
      );

      if (!threadId) {
        setThreadId(response.threadId);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        threadId: response.threadId
      };

      setMessages(prev => [...prev, assistantMessage]);
      toast.success(t('AI response generated successfully'));
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('Failed to get AI response'));
    } finally {
      setIsLoading(false);
    }
  };

  const generateContent = async () => {
    if (!currentMessage.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const content = await openaiChatService.generateContent(currentMessage, contentType);
      setGeneratedContent(content);
      toast.success(t('Content generated successfully'));
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error(t('Failed to generate content'));
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('Copied to clipboard'));
  };

  const clearConversation = () => {
    setMessages([]);
    setThreadId('');
    toast.success(t('Conversation cleared'));
  };

  const exportConversation = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      threadId,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexbrain-conversation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t('Conversation exported'));
  };

  const predefinedPrompts = [
    {
      title: t('Marketing Strategy'),
      prompt: t('Create a complete marketing strategy for my business including target audience, channels, and budget allocation'),
      category: 'marketing'
    },
    {
      title: t('Sales Copy'),
      prompt: t('Write high-converting sales copy for my product landing page that addresses customer pain points'),
      category: 'sales'
    },
    {
      title: t('Social Media Plan'),
      prompt: t('Develop a 30-day social media content calendar with engaging posts for my brand'),
      category: 'social'
    },
    {
      title: t('Campaign Optimization'),
      prompt: t('Analyze my current ad campaigns and suggest improvements to increase ROI and reduce costs'),
      category: 'marketing'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="text-blue-600" weight="fill" />
            {t('NexBrain Assistant')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('Your AI-powered marketing and business advisor')}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowContentGenerator(!showContentGenerator)}
          >
            <Sparkles size={16} />
            {t('Content Generator')}
          </Button>
          <Button variant="outline" onClick={clearConversation}>
            {t('Clear Chat')}
          </Button>
          <Button variant="outline" onClick={exportConversation}>
            <Download size={16} />
            {t('Export')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-none">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare size={20} />
                {t('AI Conversation')}
                {threadId && (
                  <Badge variant="secondary" className="text-xs">
                    {t('Thread')}: {threadId.slice(-8)}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <Brain size={48} className="mx-auto mb-4 text-blue-600" />
                      <p>{t('Start a conversation with NexBrain')}</p>
                      <p className="text-sm">{t('Ask about marketing strategies, content creation, or business advice')}</p>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(message.content)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        {t('NexBrain is thinking...')}
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder={t('Ask NexBrain anything about marketing, sales, or business...')}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    disabled={isLoading}
                  />
                  <Button onClick={sendMessage} disabled={isLoading || !currentMessage.trim()}>
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Prompts */}
          <Card>
            <CardHeader>
              <CardTitle>{t('Quick Prompts')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {predefinedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full text-left justify-start h-auto p-3"
                  onClick={() => setCurrentMessage(prompt.prompt)}
                >
                  <div>
                    <div className="font-medium">{prompt.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {prompt.prompt.slice(0, 60)}...
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Content Generator */}
          {showContentGenerator && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles size={20} />
                  {t('Content Generator')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">{t('Marketing Content')}</SelectItem>
                    <SelectItem value="sales">{t('Sales Copy')}</SelectItem>
                    <SelectItem value="social">{t('Social Media')}</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder={t('Describe what content you need...')}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  rows={3}
                />

                <Button 
                  onClick={generateContent} 
                  disabled={isLoading || !currentMessage.trim()}
                  className="w-full"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {t('Generate Content')}
                </Button>

                {generatedContent && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">{t('Generated Content')}</label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(generatedContent)}
                      >
                        <Copy size={12} />
                      </Button>
                    </div>
                    <Textarea
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      rows={8}
                      className="text-sm"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>{t('Session Stats')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('Messages')}</span>
                  <span>{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('Responses')}</span>
                  <span>{messages.filter(m => m.role === 'assistant').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('Thread ID')}</span>
                  <span className="text-xs">{threadId ? threadId.slice(-8) : t('None')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}