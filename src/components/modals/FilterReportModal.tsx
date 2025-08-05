import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Filter, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';

interface FilterReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const campaignStatuses = [
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'draft', label: 'Draft' },
  { id: 'paused', label: 'Paused' },
];

const industries = [
  'Technology',
  'Fashion',
  'Beauty & Cosmetics',
  'Food & Beverage',
  'Travel',
  'Fitness & Health',
  'Gaming',
  'Education',
  'Finance',
  'Entertainment',
];

const platforms = [
  'Instagram',
  'YouTube',
  'TikTok',
  'Twitter',
  'LinkedIn',
  'Facebook',
];

export function FilterReportModal({ isOpen, onClose, onApplyFilters }: FilterReportModalProps) {
  const [filters, setFilters] = useState({
    statuses: ['active'] as string[],
    industries: [] as string[],
    platforms: [] as string[],
    budgetRange: [0, 100000] as [number, number],
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const { showSuccess } = useNotifications();

  const handleStatusChange = (statusId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      statuses: checked 
        ? [...prev.statuses, statusId]
        : prev.statuses.filter(id => id !== statusId)
    }));
  };

  const handleIndustryChange = (industryId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      industries: checked 
        ? [...prev.industries, industryId]
        : prev.industries.filter(id => id !== industryId)
    }));
  };

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      platforms: checked 
        ? [...prev.platforms, platformId]
        : prev.platforms.filter(id => id !== platformId)
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      statuses: ['active'],
      industries: [],
      platforms: [],
      budgetRange: [0, 100000],
      dateRange: { from: undefined, to: undefined },
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    showSuccess('Filters applied successfully!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Reports
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campaign Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Campaign Status</CardTitle>
                <CardDescription>Filter by campaign status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaignStatuses.map((status) => (
                    <div key={status.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={status.id}
                        checked={filters.statuses.includes(status.id)}
                        onCheckedChange={(checked) => handleStatusChange(status.id, checked as boolean)}
                      />
                      <Label htmlFor={status.id} className="cursor-pointer">
                        {status.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Industries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Industries</CardTitle>
                <CardDescription>Filter by target industries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {industries.map((industry) => (
                    <div key={industry} className="flex items-center space-x-2">
                      <Checkbox
                        id={industry}
                        checked={filters.industries.includes(industry)}
                        onCheckedChange={(checked) => handleIndustryChange(industry, checked as boolean)}
                      />
                      <Label htmlFor={industry} className="cursor-pointer text-sm">
                        {industry}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platforms */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Platforms</CardTitle>
                <CardDescription>Filter by social media platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {platforms.map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform}
                        checked={filters.platforms.includes(platform)}
                        onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
                      />
                      <Label htmlFor={platform} className="cursor-pointer">
                        {platform}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget Range */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Budget Range</CardTitle>
                <CardDescription>Filter by campaign budget</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="px-3">
                  <Slider
                    value={filters.budgetRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, budgetRange: value as [number, number] }))}
                    max={100000}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${filters.budgetRange[0].toLocaleString()}</span>
                  <span>${filters.budgetRange[1].toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Date Range</CardTitle>
              <CardDescription>Filter by campaign dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !filters.dateRange.from && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.from ? format(filters.dateRange.from, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from}
                        onSelect={(date) => setFilters(prev => ({ 
                          ...prev, 
                          dateRange: { ...prev.dateRange, from: date } 
                        }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !filters.dateRange.to && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.to ? format(filters.dateRange.to, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to}
                        onSelect={(date) => setFilters(prev => ({ 
                          ...prev, 
                          dateRange: { ...prev.dateRange, to: date } 
                        }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sorting */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sorting</CardTitle>
              <CardDescription>Choose how to sort the results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select 
                    value={filters.sortBy} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="budget">Budget</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Order</Label>
                  <Select 
                    value={filters.sortOrder} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, sortOrder: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Descending</SelectItem>
                      <SelectItem value="asc">Ascending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleResetFilters}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApplyFilters} className="flex-1">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}