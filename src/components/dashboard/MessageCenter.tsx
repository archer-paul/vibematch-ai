import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter,
  MoreHorizontal,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderType: 'creator' | 'sponsor';
  subject: string;
  preview: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  archived: boolean;
  messages: {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    attachments?: string[];
  }[];
}

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "brand-1",
    senderName: "Nike Marketing Team",
    senderAvatar: "/placeholder.svg",
    senderType: "sponsor",
    subject: "Summer Campaign Collaboration Opportunity",
    preview: "Hi Sarah! We're launching our summer athletic wear collection and would love to collaborate...",
    timestamp: "2 hours ago",
    read: false,
    starred: true,
    archived: false,
    messages: [
      {
        id: "msg-1",
        senderId: "brand-1",
        content: "Hi Sarah! We're launching our summer athletic wear collection and would love to collaborate with you. Your fitness content aligns perfectly with our brand values. We're offering $3,500 for a series of 3 Instagram posts and 2 stories. Are you interested in discussing this further?",
        timestamp: "2 hours ago"
      }
    ]
  },
  {
    id: "2",
    senderId: "creator-1",
    senderName: "Marcus Rodriguez",
    senderAvatar: "/placeholder.svg",
    senderType: "creator",
    subject: "Cross-promotion Opportunity",
    preview: "Hey! I saw your tech content and thought we could do a cross-promotion...",
    timestamp: "5 hours ago",
    read: true,
    starred: false,
    archived: false,
    messages: [
      {
        id: "msg-2",
        senderId: "creator-1",
        content: "Hey! I saw your tech content and thought we could do a cross-promotion. I have a gaming channel with 90K subscribers. Want to collaborate on some tech reviews?",
        timestamp: "5 hours ago"
      }
    ]
  },
  {
    id: "3",
    senderId: "brand-2",
    senderName: "TechCorp Solutions",
    senderAvatar: "/placeholder.svg",
    senderType: "sponsor",
    subject: "Product Review Partnership",
    preview: "We'd like to send you our latest smartphone for an honest review...",
    timestamp: "1 day ago",
    read: true,
    starred: false,
    archived: false,
    messages: [
      {
        id: "msg-3",
        senderId: "brand-2",
        content: "We'd like to send you our latest smartphone for an honest review. We're offering $1,800 plus you keep the device. Timeline is flexible. Let us know your thoughts!",
        timestamp: "1 day ago"
      }
    ]
  }
];

export function MessageCenter() {
  const [messages, setMessages] = useState(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.senderName.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filter) {
      case 'unread': return matchesSearch && !message.read;
      case 'starred': return matchesSearch && message.starred;
      default: return matchesSearch && !message.archived;
    }
  });

  const unreadCount = messages.filter(m => !m.read && !m.archived).length;

  const markAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  const toggleStar = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
      )
    );
  };

  const archiveMessage = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, archived: true } : msg
      )
    );
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
  };

  const sendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;

    const newReply = {
      id: `reply-${Date.now()}`,
      senderId: "current-user",
      content: replyText,
      timestamp: "Just now"
    };

    setMessages(prev =>
      prev.map(msg =>
        msg.id === selectedMessage.id
          ? { ...msg, messages: [...msg.messages, newReply] }
          : msg
      )
    );

    setSelectedMessage(prev =>
      prev ? { ...prev, messages: [...prev.messages, newReply] } : null
    );

    setReplyText("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
      {/* Messages List */}
      <Card className="border border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-corporate-gray-dark flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="bg-corporate-danger text-white">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Collaborate with brands and creators</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-corporate-gray" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-1">
            {(['all', 'unread', 'starred'] as const).map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(filterType)}
              >
                {filterType === 'all' && 'All'}
                {filterType === 'unread' && 'Unread'}
                {filterType === 'starred' && 'Starred'}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-96">
            {filteredMessages.length === 0 ? (
              <div className="p-6 text-center text-corporate-gray">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages found</p>
              </div>
            ) : (
              <div className="space-y-0">
                {filteredMessages.map((message, index) => (
                  <div key={message.id}>
                    <div 
                      className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                        !message.read ? 'bg-muted/30 border-l-4 border-l-corporate-blue' : ''
                      } ${selectedMessage?.id === message.id ? 'bg-accent' : ''}`}
                      onClick={() => {
                        setSelectedMessage(message);
                        markAsRead(message.id);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={message.senderAvatar} />
                          <AvatarFallback>
                            {message.senderName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${!message.read ? 'text-corporate-gray-dark' : 'text-corporate-gray'}`}>
                              {message.senderName}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-corporate-gray">
                                {message.timestamp}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStar(message.id);
                                }}
                              >
                                <Star className={`h-3 w-3 ${message.starred ? 'fill-corporate-warning text-corporate-warning' : ''}`} />
                              </Button>
                            </div>
                          </div>
                          
                          <h5 className={`text-sm ${!message.read ? 'font-medium text-corporate-gray-dark' : 'text-corporate-gray'} truncate`}>
                            {message.subject}
                          </h5>
                          
                          <p className="text-sm text-corporate-gray mt-1 truncate">
                            {message.preview}
                          </p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {message.senderType === 'sponsor' ? 'Brand' : 'Creator'}
                            </Badge>
                            {!message.read && (
                              <div className="w-2 h-2 bg-corporate-blue rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < filteredMessages.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Message Detail */}
      <Card className="border border-border">
        <CardHeader>
          {selectedMessage ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedMessage.senderAvatar} />
                  <AvatarFallback>
                    {selectedMessage.senderName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base text-corporate-gray-dark">
                    {selectedMessage.subject}
                  </CardTitle>
                  <CardDescription>
                    {selectedMessage.senderName} • {selectedMessage.timestamp}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => toggleStar(selectedMessage.id)}>
                  <Star className={`h-4 w-4 ${selectedMessage.starred ? 'fill-corporate-warning text-corporate-warning' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => archiveMessage(selectedMessage.id)}>
                  <Archive className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <CardTitle className="text-corporate-gray-dark">Select a Message</CardTitle>
              <CardDescription>Choose a message to view the conversation</CardDescription>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {selectedMessage ? (
            <div className="space-y-4">
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {selectedMessage.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        msg.senderId === 'current-user' 
                          ? 'bg-corporate-blue text-white' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.senderId === 'current-user' ? 'text-white/70' : 'text-corporate-gray'
                        }`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <Separator />
              
              <div className="space-y-3">
                <Textarea
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Reply className="h-4 w-4" />
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Forward className="h-4 w-4" />
                      Forward
                    </Button>
                  </div>
                  <Button onClick={sendReply} disabled={!replyText.trim()} className="gap-2">
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-corporate-gray opacity-50" />
              <p className="text-corporate-gray">Select a message to start the conversation</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}