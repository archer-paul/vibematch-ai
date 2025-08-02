import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Send, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationToast } from '@/components/ui/notification-toast';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  read_at?: string;
  created_at: string;
  sender_name?: string;
}

interface Conversation {
  id: string;
  creator_id: string;
  sponsor_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  other_user_name?: string;
  other_user_avatar?: string;
  last_message?: string;
  unread_count?: number;
}

export default function Messages() {
  const { profile } = useAuth();
  const { notifications, removeNotification, showError, showSuccess } = useNotifications();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, [profile]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    if (!profile) return;
    
    try {
      setIsLoading(true);
      
      // Get conversations where user is either creator or sponsor
      const { data: conversationData, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`creator_id.eq.${profile.user_id},sponsor_id.eq.${profile.user_id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // For each conversation, get the other user's profile
      const transformedConversations = await Promise.all(
        (conversationData || []).map(async (conv) => {
          const isCreator = conv.creator_id === profile.user_id;
          const otherUserId = isCreator ? conv.sponsor_id : conv.creator_id;
          
          // Get other user's profile
          const { data: otherUserProfile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('user_id', otherUserId)
            .single();
          
          return {
            ...conv,
            other_user_name: otherUserProfile?.full_name || 'Unknown User',
            other_user_avatar: otherUserProfile?.avatar_url,
            unread_count: 0 // TODO: Implement unread count
          };
        })
      );

      setConversations(transformedConversations);
      
      // If no conversation is selected, select the first one
      if (transformedConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(transformedConversations[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      showError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data: messageData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // For each message, get sender's name
      const transformedMessages = await Promise.all(
        (messageData || []).map(async (msg) => {
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', msg.sender_id)
            .single();
          
          return {
            ...msg,
            sender_name: senderProfile?.full_name || 'Unknown'
          };
        })
      );

      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      showError('Failed to load messages');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !profile) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation,
          sender_id: profile.user_id,
          content: newMessage.trim(),
          message_type: 'text'
        });

      if (error) throw error;

      // Reload messages to show the new one
      await loadMessages(selectedConversation);
      await loadConversations(); // Refresh conversation list to update timestamps
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm">Start matching to begin conversations!</p>
              </div>
            ) : (
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
                        <AvatarImage src={conversation.other_user_avatar} />
                        <AvatarFallback>
                          {conversation.other_user_name?.charAt(0)?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">
                            {conversation.other_user_name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(conversation.updated_at).toLocaleDateString()}
                            </span>
                            {conversation.unread_count && conversation.unread_count > 0 && (
                              <Badge variant="default" className="w-5 h-5 p-0 flex items-center justify-center text-xs">
                                {conversation.unread_count}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conversation.last_message || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversationData ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedConversationData.other_user_avatar} />
                    <AvatarFallback>
                      {selectedConversationData.other_user_name?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedConversationData.other_user_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {profile.user_type === 'creator' ? 'Sponsor' : 'Creator'} • Online
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === profile.user_id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender_id === profile.user_id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_id === profile.user_id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {new Date(message.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
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
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon" disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p>Choose a conversation from the left to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Notifications */}
      <NotificationToast 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}