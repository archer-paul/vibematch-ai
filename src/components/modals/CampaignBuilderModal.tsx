import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  DollarSign,
  Users,
  Lightbulb,
  BarChart3,
  FileText,
  CheckCircle,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

const campaignTemplates = [
  {
    id: "product-launch",
    name: "Product Launch",
    description: "Comprehensive product launch with multiple creators",
    objectives: ["Brand Awareness", "Sales", "Product Education"],
    suggestedBudget: { min: 15000, max: 50000 },
    duration: { min: 6, max: 8 },
    creators: { min: 5, max: 10 }
  },
  {
    id: "brand-awareness",
    name: "Brand Awareness",
    description: "Build brand recognition and reach new audiences",
    objectives: ["Brand Awareness", "Reach", "Engagement"],
    suggestedBudget: { min: 10000, max: 30000 },
    duration: { min: 4, max: 6 },
    creators: { min: 8, max: 15 }
  },
  {
    id: "event-coverage",
    name: "Event Coverage",
    description: "Real-time event coverage and content creation",
    objectives: ["Event Coverage", "Real-time Engagement", "Content Creation"],
    suggestedBudget: { min: 5000, max: 20000 },
    duration: { min: 1, max: 2 },
    creators: { min: 3, max: 8 }
  }
];

const objectiveOptions = [
  "Brand Awareness", "Sales", "Lead Generation", "App Downloads", 
  "Event Promotion", "Product Education", "Content Creation", "Engagement"
];

const targetAudienceOptions = {
  age: ["18-24", "25-34", "35-44", "45-54", "55+"],
  gender: ["All", "Male", "Female", "Non-binary"],
  interests: ["Fashion", "Beauty", "Tech", "Gaming", "Fitness", "Food", "Travel", "Lifestyle"],
  locations: ["United States", "Canada", "United Kingdom", "Australia", "Global"]
};

const kpiOptions = [
  { name: "Reach", description: "Total number of unique users who see content", unit: "users" },
  { name: "Impressions", description: "Total number of times content is displayed", unit: "views" },
  { name: "Engagement Rate", description: "Percentage of audience that interacts", unit: "%" },
  { name: "Click-through Rate", description: "Percentage of users who click links", unit: "%" },
  { name: "Conversions", description: "Number of desired actions completed", unit: "actions" },
  { name: "Cost per Acquisition", description: "Cost to acquire one customer", unit: "$" }
];

export function CampaignBuilderModal({ isOpen, onClose }: CampaignBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
    objectives: [] as string[],
    budget: 0,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    targetAudience: {
      age: [] as string[],
      gender: "All",
      interests: [] as string[],
      locations: [] as string[]
    },
    creativeBrief: "",
    brandGuidelines: "",
    kpis: [] as string[],
    template: null as any
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTemplateSelect = (template: any) => {
    setCampaignData({
      ...campaignData,
      template,
      objectives: template.objectives,
      budget: template.suggestedBudget.min
    });
    setCurrentStep(2);
  };

  const updateCampaignData = (field: string, value: any) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <Target className="h-5 w-5" />;
      case 2: return <Users className="h-5 w-5" />;
      case 3: return <Lightbulb className="h-5 w-5" />;
      case 4: return <BarChart3 className="h-5 w-5" />;
      case 5: return <CheckCircle className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Rocket className="h-6 w-6 text-blue-500" />
            Campaign Builder
          </DialogTitle>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          </div>

          {/* Step Navigation */}
          <div className="flex items-center justify-between mt-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className={`flex items-center ${i < totalSteps - 1 ? 'flex-1' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep > i + 1 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : currentStep === i + 1 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  {currentStep > i + 1 ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    getStepIcon(i + 1)
                  )}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    currentStep > i + 1 ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Campaign Basics */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Let's start with the basics</h3>
                <p className="text-gray-600">Choose a template or start from scratch</p>
              </div>

              {/* Templates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {campaignTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">{template.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="space-y-2 text-xs">
                        <div>Budget: ${template.suggestedBudget.min.toLocaleString()} - ${template.suggestedBudget.max.toLocaleString()}</div>
                        <div>Duration: {template.duration.min}-{template.duration.max} weeks</div>
                        <div>Creators: {template.creators.min}-{template.creators.max}</div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {template.objectives.map((obj, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{obj}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">Or start from scratch</p>
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Create Custom Campaign
                </Button>
              </div>

              {/* Basic Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input
                      id="campaign-name"
                      placeholder="Enter campaign name..."
                      value={campaignData.name}
                      onChange={(e) => updateCampaignData('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="campaign-description">Description</Label>
                    <Textarea
                      id="campaign-description"
                      placeholder="Describe your campaign goals and vision..."
                      value={campaignData.description}
                      onChange={(e) => updateCampaignData('description', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="budget">Budget</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="10000"
                        value={campaignData.budget}
                        onChange={(e) => updateCampaignData('budget', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !campaignData.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {campaignData.startDate ? format(campaignData.startDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={campaignData.startDate}
                            onSelect={(date) => updateCampaignData('startDate', date)}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !campaignData.endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {campaignData.endDate ? format(campaignData.endDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={campaignData.endDate}
                            onSelect={(date) => updateCampaignData('endDate', date)}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Objectives */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">What are your campaign objectives?</h3>
                <p className="text-gray-600">Select all that apply to help us recommend the best creators</p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {objectiveOptions.map((objective) => (
                      <div
                        key={objective}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          campaignData.objectives.includes(objective)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => updateCampaignData('objectives', toggleArrayItem(campaignData.objectives, objective))}
                      >
                        <div className="text-center">
                          <Target className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                          <div className="text-sm font-medium">{objective}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {campaignData.objectives.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        Based on your objectives, we recommend focusing on creators with high engagement rates 
                        and authentic audiences. Consider micro-influencers for better ROI.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Additional steps would be implemented similarly... */}
          {currentStep > 2 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Step {currentStep} Coming Soon</h3>
              <p className="text-gray-600">
                Advanced campaign configuration features are being developed.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Save Draft
            </Button>
            {currentStep === totalSteps ? (
              <Button className="gap-2">
                <Rocket className="h-4 w-4" />
                Launch Campaign
              </Button>
            ) : (
              <Button onClick={handleNext} className="gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}