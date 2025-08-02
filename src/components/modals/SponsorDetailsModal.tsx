import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  X, 
  ArrowRight, 
  Calendar, 
  DollarSign, 
  Target, 
  Users, 
  Clock,
  CheckCircle2
} from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  industry: string;
  budgetRange: string;
  compatibilityScore: number;
  description: string;
  requirements: string[];
  campaignType: string;
  deadline: string;
}

interface SponsorDetailsModalProps {
  sponsor: Sponsor | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (sponsorId: string) => void;
  onDislike: (sponsorId: string) => void;
  onApply: (sponsorId: string) => void;
}

// Extended mock data for detailed view
const getExtendedSponsorData = (sponsor: Sponsor) => ({
  ...sponsor,
  companySize: '500-1000 employees',
  location: 'San Francisco, CA',
  website: 'https://techflow.com',
  previousCampaigns: 47,
  averageEngagement: '8.5%',
  preferredPlatforms: ['Instagram', 'TikTok', 'YouTube'],
  campaignDuration: '3-4 weeks',
  deliverables: [
    '3 Instagram feed posts',
    '5 Instagram Stories',
    '1 YouTube integration video',
    'Product unboxing content'
  ],
  briefDescription: `We're looking for tech-savvy content creators who can authentically showcase our new productivity app. The ideal creator should have experience with tech reviews and a highly engaged audience interested in productivity tools and software solutions.`,
  brandValues: ['Innovation', 'Authenticity', 'Quality', 'User-Centric'],
  applicationDeadline: '2024-02-15',
  campaignStart: '2024-02-20',
  paymentTerms: 'Net 30 days after content delivery'
});

export function SponsorDetailsModal({ 
  sponsor, 
  isOpen, 
  onClose, 
  onLike, 
  onDislike, 
  onApply 
}: SponsorDetailsModalProps) {
  if (!sponsor) return null;

  const extendedData = getExtendedSponsorData(sponsor);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={sponsor.logo} alt={sponsor.name} />
              <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{sponsor.name}</span>
                <Badge variant="secondary">{sponsor.industry}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{extendedData.location}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Compatibility Score */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {sponsor.compatibilityScore}%
              </div>
              <Badge variant="outline" className={getScoreColor(sponsor.compatibilityScore)}>
                Match Score
              </Badge>
            </CardContent>
          </Card>

          {/* Campaign Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Budget Range</span>
                </div>
                <p className="text-lg font-bold">{sponsor.budgetRange}</p>
                <p className="text-sm text-muted-foreground">{extendedData.paymentTerms}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Campaign Type</span>
                </div>
                <p className="text-lg font-bold">{sponsor.campaignType}</p>
                <p className="text-sm text-muted-foreground">{extendedData.campaignDuration}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">Timeline</span>
                </div>
                <p className="text-sm">Application deadline: <span className="font-medium">{extendedData.applicationDeadline}</span></p>
                <p className="text-sm">Campaign starts: <span className="font-medium">{extendedData.campaignStart}</span></p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">Company Stats</span>
                </div>
                <p className="text-sm">{extendedData.companySize}</p>
                <p className="text-sm">{extendedData.previousCampaigns} previous campaigns</p>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Campaign Description</h3>
            <p className="text-muted-foreground leading-relaxed">{extendedData.briefDescription}</p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Requirements</h3>
            <div className="flex flex-wrap gap-2">
              {sponsor.requirements.map((req, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {req}
                </Badge>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Expected Deliverables</h3>
            <ul className="space-y-2">
              {extendedData.deliverables.map((deliverable, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{deliverable}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Preferred Platforms */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Preferred Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {extendedData.preferredPlatforms.map((platform, index) => (
                <Badge key={index} variant="secondary">{platform}</Badge>
              ))}
            </div>
          </div>

          {/* Brand Values */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Brand Values</h3>
            <div className="flex flex-wrap gap-2">
              {extendedData.brandValues.map((value, index) => (
                <Badge key={index} variant="outline">{value}</Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onDislike(sponsor.id)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="mr-2 h-4 w-4" />
                Not Interested
              </Button>
              <Button
                variant="outline"
                onClick={() => onLike(sponsor.id)}
                className="text-green-600 hover:text-green-700"
              >
                <Heart className="mr-2 h-4 w-4" />
                Like Campaign
              </Button>
            </div>
            
            <Button 
              size="lg"
              onClick={() => onApply(sponsor.id)}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              Apply Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}