import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Download,
  RefreshCw,
  Zap,
  BarChart3,
  AlertCircle
} from "lucide-react";

interface ROISimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const campaignTypes = [
  { value: "product-launch", label: "Product Launch", avgROI: 3.2, confidence: 85 },
  { value: "brand-awareness", label: "Brand Awareness", avgROI: 2.8, confidence: 92 },
  { value: "event-promotion", label: "Event Promotion", avgROI: 4.1, confidence: 78 },
  { value: "content-creation", label: "Content Creation", avgROI: 2.5, confidence: 89 }
];

const industryBenchmarks = [
  { industry: "Fashion", avgROI: 3.5, engagement: 4.2 },
  { industry: "Tech", avgROI: 2.8, engagement: 3.8 },
  { industry: "Beauty", avgROI: 4.1, engagement: 5.1 },
  { industry: "Fitness", avgROI: 3.2, engagement: 4.5 },
  { industry: "Food", avgROI: 3.8, engagement: 4.8 }
];

const scenarioData = [
  { scenario: "Conservative", roi: 2.1, reach: 450000, conversions: 890, cost: 15000 },
  { scenario: "Moderate", roi: 3.2, reach: 750000, conversions: 1450, cost: 25000 },
  { scenario: "Aggressive", roi: 4.8, reach: 1200000, conversions: 2100, cost: 40000 }
];

const projectionData = [
  { month: "Month 1", conservative: 5000, moderate: 8000, aggressive: 12000 },
  { month: "Month 2", conservative: 8500, moderate: 15000, aggressive: 24000 },
  { month: "Month 3", conservative: 12000, moderate: 22000, aggressive: 38000 },
  { month: "Month 4", conservative: 15000, moderate: 28000, aggressive: 48000 },
  { month: "Month 5", conservative: 17500, moderate: 32000, aggressive: 55000 },
  { month: "Month 6", conservative: 20000, moderate: 36000, aggressive: 62000 }
];

export function ROISimulatorModal({ isOpen, onClose }: ROISimulatorProps) {
  const [budget, setBudget] = useState(25000);
  const [campaignType, setCampaignType] = useState("brand-awareness");
  const [creatorTier, setCreatorTier] = useState("mixed");
  const [duration, setDuration] = useState(8);
  const [targetAudience, setTargetAudience] = useState(500000);
  const [selectedScenario, setSelectedScenario] = useState("moderate");

  const calculateROI = () => {
    const baseROI = campaignTypes.find(c => c.value === campaignType)?.avgROI || 3.0;
    const tierMultiplier = creatorTier === "micro" ? 1.2 : creatorTier === "macro" ? 0.9 : 1.0;
    const durationBonus = duration > 6 ? 1.1 : 1.0;
    const audienceMultiplier = targetAudience > 1000000 ? 1.15 : targetAudience > 500000 ? 1.05 : 1.0;
    
    return Math.round((baseROI * tierMultiplier * durationBonus * audienceMultiplier) * 10) / 10;
  };

  const calculateProjections = () => {
    const roi = calculateROI();
    const revenue = budget * roi;
    const reach = Math.round(budget * 30 * (creatorTier === "micro" ? 1.5 : 1.0));
    const conversions = Math.round(reach * 0.002 * (roi / 3.0));
    
    return { revenue, reach, conversions, roi };
  };

  const projections = calculateProjections();

  const getScenarioColor = (scenario: string) => {
    switch (scenario) {
      case "conservative": return "#10b981";
      case "moderate": return "#3b82f6";
      case "aggressive": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Calculator className="h-6 w-6 text-blue-500" />
            ROI Simulator & Predictor
          </DialogTitle>
          <p className="text-gray-600">
            Interactive calculator to predict campaign performance and ROI
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Configuration Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Campaign Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="budget">Budget ($)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Campaign Type</Label>
                    <Select value={campaignType} onValueChange={setCampaignType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Creator Tier</Label>
                    <Select value={creatorTier} onValueChange={setCreatorTier}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="micro">Micro (10K-100K)</SelectItem>
                        <SelectItem value="mixed">Mixed Portfolio</SelectItem>
                        <SelectItem value="macro">Macro (100K+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Duration (weeks): {duration}</Label>
                    <Slider
                      value={[duration]}
                      onValueChange={(value) => setDuration(value[0])}
                      min={2}
                      max={16}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Target Audience Size: {targetAudience.toLocaleString()}</Label>
                    <Slider
                      value={[targetAudience]}
                      onValueChange={(value) => setTargetAudience(value[0])}
                      min={100000}
                      max={2000000}
                      step={50000}
                      className="mt-2"
                    />
                  </div>

                  <Button className="w-full gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Recalculate
                  </Button>
                </CardContent>
              </Card>

              {/* Industry Benchmarks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    Industry Benchmarks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {industryBenchmarks.map((benchmark, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
                        <span className="text-sm font-medium">{benchmark.industry}</span>
                        <div className="text-right text-sm">
                          <div className="text-green-600 font-medium">{benchmark.avgROI}x ROI</div>
                          <div className="text-gray-500">{benchmark.engagement}% eng.</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ${projections.revenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Projected Revenue</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {projections.roi}x
                    </div>
                    <div className="text-sm text-gray-600">ROI Multiplier</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {(projections.reach / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-gray-600">Total Reach</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {projections.conversions.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Conversions</div>
                  </CardContent>
                </Card>
              </div>

              {/* Scenario Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Scenario Comparison</CardTitle>
                  <CardDescription>Compare different investment strategies</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedScenario} onValueChange={setSelectedScenario}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="conservative">Conservative</TabsTrigger>
                      <TabsTrigger value="moderate">Moderate</TabsTrigger>
                      <TabsTrigger value="aggressive">Aggressive</TabsTrigger>
                    </TabsList>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {scenarioData.map((scenario, index) => (
                        <Card 
                          key={index} 
                          className={`cursor-pointer transition-colors ${
                            selectedScenario === scenario.scenario.toLowerCase() 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedScenario(scenario.scenario.toLowerCase())}
                        >
                          <CardContent className="p-4">
                            <div className="text-center">
                              <h4 className="font-medium mb-2">{scenario.scenario}</h4>
                              <div className="space-y-2 text-sm">
                                <div>ROI: <span className="font-bold text-green-600">{scenario.roi}x</span></div>
                                <div>Reach: <span className="font-medium">{(scenario.reach / 1000).toFixed(0)}K</span></div>
                                <div>Conversions: <span className="font-medium">{scenario.conversions}</span></div>
                                <div>Investment: <span className="font-medium">${scenario.cost.toLocaleString()}</span></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Revenue Projection Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">6-Month Revenue Projection</CardTitle>
                  <CardDescription>Projected revenue growth by scenario</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={projectionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]} />
                        <Line 
                          type="monotone" 
                          dataKey="conservative" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Conservative"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="moderate" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="Moderate"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="aggressive" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          name="Aggressive"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg border border-green-200 bg-green-50">
                      <div className="font-medium text-green-800">Low Risk</div>
                      <div className="text-sm text-green-600 mt-1">
                        Established creators, proven track record
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                      <div className="font-medium text-yellow-800">Medium Risk</div>
                      <div className="text-sm text-yellow-600 mt-1">
                        Mixed portfolio, market volatility
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-red-200 bg-red-50">
                      <div className="font-medium text-red-800">High Risk</div>
                      <div className="text-sm text-red-600 mt-1">
                        New creators, unproven metrics
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            * Projections based on historical data and industry benchmarks
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}