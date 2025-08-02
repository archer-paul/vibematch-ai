import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar?: string;
  type: 'creator' | 'sponsor';
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    lastMessage: 'Great! When can we schedule the campaign review?',
    timestamp: '2 min ago',
    unread: 2,
    type: 'sponsor'
  },
  {
    id: '2',
    name: 'GreenLife Brands',
    lastMessage: 'The collaboration proposal looks interesting',
    timestamp: '1 hour ago',
    unread: 0,
    type: 'sponsor'
  },
  {
    id: '3',
    name: 'FashionForward',
    lastMessage: 'Thank you for your content samples',
    timestamp: '3 hours ago',
    unread: 1,
    type: 'sponsor'
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'TechCorp Solutions',
    content: 'Hi! We reviewed your profile and we\'re very interested in collaborating.',
    timestamp: '10:30 AM'
  },
  {
    id: '2',
    sender: 'You',
    content: 'Thank you for reaching out! I\'d love to hear more about the campaign.',
    timestamp: '10:45 AM'
  },
  {
    id: '3',
    sender: 'TechCorp Solutions',
    content: 'Great! When can we schedule the campaign review?',
    timestamp: '11:15 AM'
  }
];

export default function Messages() {
  const { profile } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: Date.now().toString(),
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage('');
      
      // Update conversation with latest message
      const updatedConversations = conversations.map(conv => 
        conv.id === selectedConversation ? { 
          ...conv, 
          lastMessage: newMessage,
          timestamp: 'now',
          unread: 0 
        } : conv
      );
      setConversations(updatedConversations);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Messages
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b ${
                    selectedConversation === conversation.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>
                        {conversation.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">
                          {conversation.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {conversation.timestamp}
                          </span>
                          {conversation.unread > 0 && (
                            <Badge variant="default" className="w-5 h-5 p-0 flex items-center justify-center text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>TC</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">TechCorp Solutions</CardTitle>
                <p className="text-sm text-muted-foreground">Sponsor • Online</p>
              </div>
            </div>
          </CardHeader>
          
          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === 'You'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'You' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}