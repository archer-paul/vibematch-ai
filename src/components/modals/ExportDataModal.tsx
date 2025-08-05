import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const exportTypes = [
  { id: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Comma-separated values' },
  { id: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel format' },
  { id: 'pdf', label: 'PDF', icon: FileText, description: 'Portable document format' },
];

const dataCategories = [
  { id: 'campaigns', label: 'Campaign Data', description: 'Performance metrics, budgets, and results' },
  { id: 'creators', label: 'Creator Analytics', description: 'Creator performance and engagement data' },
  { id: 'audience', label: 'Audience Insights', description: 'Demographics and behavior data' },
  { id: 'financial', label: 'Financial Reports', description: 'Spending, ROI, and cost analysis' },
  { id: 'collaboration', label: 'Collaboration History', description: 'Partnership and communication records' },
];

export function ExportDataModal({ isOpen, onClose }: ExportDataModalProps) {
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['campaigns']);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isExporting, setIsExporting] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    }
  };

  const handleExport = async () => {
    if (selectedCategories.length === 0) {
      showError('Please select at least one data category to export');
      return;
    }

    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const formatName = exportTypes.find(t => t.id === selectedFormat)?.label;
      const filename = `sponsor_data_${format(new Date(), 'yyyy-MM-dd')}.${selectedFormat}`;
      
      showSuccess(`Data exported successfully as ${formatName} format!`);
      
      // In a real implementation, this would trigger a file download
      console.log('Exporting:', {
        format: selectedFormat,
        categories: selectedCategories,
        dateRange,
        filename
      });
      
      onClose();
    } catch (error) {
      showError('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format */}
          <Card>
            <CardHeader>
              <CardTitle>Export Format</CardTitle>
              <CardDescription>Choose the file format for your export</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {exportTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-secondary/50">
                      <RadioGroupItem value={type.id} id={type.id} />
                      <div className="flex items-center gap-3 flex-1">
                        <type.icon className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor={type.id} className="font-medium cursor-pointer">
                            {type.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Data Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Data Categories</CardTitle>
              <CardDescription>Select which data you want to include in the export</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataCategories.map((category) => (
                  <div key={category.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={category.id} className="font-medium cursor-pointer">
                        {category.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle>Date Range</CardTitle>
              <CardDescription>Select the time period for your data export (optional)</CardDescription>
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
                          !dateRange.from && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
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
                          !dateRange.to && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.to ? format(dateRange.to, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Export Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-medium">{exportTypes.find(t => t.id === selectedFormat)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Categories:</span>
                  <span className="font-medium">{selectedCategories.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span>Date Range:</span>
                  <span className="font-medium">
                    {dateRange.from && dateRange.to 
                      ? `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd, yyyy')}`
                      : 'All time'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={selectedCategories.length === 0 || isExporting}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export Data'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}