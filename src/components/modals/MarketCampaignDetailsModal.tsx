import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  Clock, 
  Users, 
  Target, 
  CheckCircle2, 
  Star,
  Calendar,
  BarChart3,
  Shield,
  FileText
} from 'lucide-react';

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
  detailedDescription?: string;
  objectives?: string[];
  deliverables?: string[];
  timeline?: string[];
  targetAudience?: string;
  brandValues?: string[];
  campaignDuration?: string;
  contentGuidelines?: string[];
  exclusivityRequirements?: string;
  performanceMetrics?: string[];
}

interface MarketCampaignDetailsModalProps {
  partnership: Partnership | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (partnership: Partnership) => void;
}

export function MarketCampaignDetailsModal({ partnership, isOpen, onClose, onApply }: MarketCampaignDetailsModalProps) {
  if (!partnership) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div>
              <DialogTitle className="text-2xl">{partnership.campaign}</DialogTitle>
              <p className="text-lg text-muted-foreground">{partnership.brand}</p>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                {partnership.relevance}% match
              </Badge>
              <Badge variant="secondary">{partnership.category}</Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-semibold">{partnership.budget}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="font-semibold">{partnership.deadline}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">{partnership.campaignDuration || '4-6 weeks'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Campaign Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {partnership.detailedDescription || partnership.description}
                </p>
              </div>

              {partnership.objectives && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Campaign Objectives</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {partnership.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {partnership.brandValues && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Brand Values</h3>
                  <div className="flex flex-wrap gap-2">
                    {partnership.brandValues.map((value, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {partnership.deliverables && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Deliverables
                </h3>
                <div className="space-y-2">
                  {partnership.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <span className="text-sm">{deliverable}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {partnership.contentGuidelines && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Content Guidelines
                </h3>
                <div className="space-y-2">
                  {partnership.contentGuidelines.map((guideline, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                      <span className="text-sm">{guideline}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {partnership.targetAudience && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Target Audience
                </h3>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {partnership.targetAudience}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            {partnership.timeline && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Campaign Timeline</h3>
                <div className="space-y-4">
                  {partnership.timeline.map((phase, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        {index < partnership.timeline!.length - 1 && (
                          <div className="w-0.5 h-12 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <p className="text-sm font-medium">{phase}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Basic Requirements</h3>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {partnership.requirements}
                </p>
              </div>

              {partnership.exclusivityRequirements && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Exclusivity Requirements
                  </h3>
                  <p className="text-sm text-muted-foreground bg-red-50 border border-red-200 p-3 rounded-lg">
                    {partnership.exclusivityRequirements}
                  </p>
                </div>
              )}

              {partnership.performanceMetrics && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Performance Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {partnership.performanceMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                        <Star className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button 
            onClick={() => onApply(partnership)} 
            className="flex-1"
          >
            Apply for this Campaign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}