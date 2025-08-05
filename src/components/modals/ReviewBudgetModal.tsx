import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface ReviewBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const budgetData = [
  {
    campaign: 'Holiday Beauty Campaign',
    allocated: 50000,
    spent: 38500,
    remaining: 11500,
    status: 'warning',
    endDate: '2024-12-31',
    performance: 'good'
  },
  {
    campaign: 'Tech Review Series',
    allocated: 25000,
    spent: 15000,
    remaining: 10000,
    status: 'good',
    endDate: '2024-11-30',
    performance: 'excellent'
  },
  {
    campaign: 'Fitness Challenge',
    allocated: 30000,
    spent: 31200,
    remaining: -1200,
    status: 'critical',
    endDate: '2024-10-15',
    performance: 'poor'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'good': return 'text-green-500';
    case 'warning': return 'text-yellow-500';
    case 'critical': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'good': return CheckCircle;
    case 'warning': return AlertTriangle;
    case 'critical': return XCircle;
    default: return Target;
  }
};

export function ReviewBudgetModal({ isOpen, onClose }: ReviewBudgetModalProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const { showSuccess } = useNotifications();

  const totalAllocated = budgetData.reduce((sum, item) => sum + item.allocated, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;

  const handleAdjustBudget = (campaign: string) => {
    showSuccess(`Budget adjustment initiated for ${campaign}`);
  };

  const handleOptimizeSpending = () => {
    showSuccess('Budget optimization recommendations generated!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget Review & Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Allocated</span>
                </div>
                <div className="text-2xl font-bold">${totalAllocated.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Spent</span>
                </div>
                <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  {((totalSpent / totalAllocated) * 100).toFixed(1)}% of budget
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Remaining</span>
                </div>
                <div className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${Math.abs(totalRemaining).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {totalRemaining >= 0 ? 'Under budget' : 'Over budget'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Budget Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Budget Breakdown</CardTitle>
              <CardDescription>Review individual campaign spending and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetData.map((campaign, index) => {
                  const spentPercentage = Math.min((campaign.spent / campaign.allocated) * 100, 100);
                  const StatusIcon = getStatusIcon(campaign.status);
                  
                  return (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{campaign.campaign}</h3>
                          <Badge variant={campaign.status === 'good' ? 'default' : campaign.status === 'warning' ? 'secondary' : 'destructive'}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Ends {campaign.endDate}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Allocated:</span>
                          <div className="font-medium">${campaign.allocated.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Spent:</span>
                          <div className="font-medium">${campaign.spent.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Remaining:</span>
                          <div className={`font-medium ${campaign.remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ${Math.abs(campaign.remaining).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Performance:</span>
                          <div className="font-medium capitalize">{campaign.performance}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Budget Progress</span>
                          <span>{spentPercentage.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={spentPercentage} 
                          className={`h-2 ${campaign.status === 'critical' ? 'bg-red-100' : ''}`} 
                        />
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAdjustBudget(campaign.campaign)}
                        >
                          Adjust Budget
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedCampaign(campaign.campaign)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Budget Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Recommendations</CardTitle>
              <CardDescription>AI-powered suggestions to optimize your spending</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <h4 className="font-medium">Reallocation Opportunity</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Consider moving $5,000 from underperforming campaigns to high-ROI initiatives
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <h4 className="font-medium">Cost Efficiency</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your Tech Review Series shows 40% better cost per engagement than average
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <h4 className="font-medium">Budget Alert</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fitness Challenge is 4% over budget with 2 weeks remaining
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <h4 className="font-medium">Optimization</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Focus spending on creators with 6%+ engagement rates for better ROI
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleOptimizeSpending}>
              Generate Optimization Plan
            </Button>
            <Button variant="outline">
              Export Budget Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}