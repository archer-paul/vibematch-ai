import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Building2 } from 'lucide-react';

interface Partnership {
  id: number;
  brand: string;
  campaign: string;
  budget: string;
  category: string;
  requirements: string;
  deadline: string;
  relevance: number;
  status: string;
  description: string;
  tags: string[];
}

interface SendMessageModalProps {
  partnership: Partnership | null;
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
}

export function SendMessageModal({ partnership, isOpen, onClose, onSend }: SendMessageModalProps) {
  const defaultMessage = partnership ? 
    `Hi there!\n\nI'm interested in your "${partnership.campaign}" campaign. I believe my content style and audience would be a great fit for this collaboration.\n\nI'd love to discuss how we can work together to achieve your campaign goals.\n\nLooking forward to hearing from you!\n\nBest regards` : '';
  
  const [message, setMessage] = useState(defaultMessage);
  const [isSending, setIsSending] = useState(false);

  // Reset message when partnership changes or modal opens
  useEffect(() => {
    if (partnership && isOpen) {
      setMessage(defaultMessage);
    }
  }, [partnership, isOpen, defaultMessage]);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    try {
      await onSend(message);
      setMessage('');
      onClose();
    } finally {
      setIsSending(false);
    }
  };

  if (!partnership) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" alt={partnership.brand} />
              <AvatarFallback>
                <Building2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>Send Message to {partnership.brand}</DialogTitle>
              <p className="text-sm text-muted-foreground">Regarding: {partnership.campaign}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campaign Summary */}
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{partnership.campaign}</h3>
              <Badge variant="outline">{partnership.budget}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{partnership.description}</p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                {partnership.requirements}
              </Badge>
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Message</label>
            <Textarea
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Personalize your message to increase your chances of getting a response
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSend} 
              disabled={!message.trim() || isSending}
              className="flex-1"
            >
              <Send className="mr-2 h-4 w-4" />
              {isSending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}