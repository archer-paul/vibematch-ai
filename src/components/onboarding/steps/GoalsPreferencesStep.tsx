import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '../MultiSelect';
import { Separator } from '@/components/ui/separator';

interface GoalsPreferencesData {
  collaboration_types: string[];
  rate_range?: { min: number; max: number };
  preferred_sectors: string[];
  avoided_sectors: string[];
  availability_hours: string;
  geographic_scope: string;
  prefer_to_discuss_rates: boolean;
}

interface GoalsPreferencesStepProps {
  data: GoalsPreferencesData;
  onChange: (data: Partial<GoalsPreferencesData>) => void;
}

const collaborationOptions = [
  { value: 'sponsored_posts', label: 'Sponsored Posts' },
  { value: 'product_placement', label: 'Product Placement' },
  { value: 'long_term_campaigns', label: 'Long-term Campaigns' },
  { value: 'event_partnerships', label: 'Event Partnerships' },
  { value: 'affiliate_marketing', label: 'Affiliate Marketing' },
  { value: 'brand_ambassador', label: 'Brand Ambassador' }
];

const sectorOptions = [
  { value: 'tech', label: 'Technology' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'finance', label: 'Finance' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'travel', label: 'Travel' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'sports', label: 'Sports' },
  { value: 'automotive', label: 'Automotive' }
];

const availabilityOptions = [
  { value: '1-5', label: '1-5 hours per week' },
  { value: '5-15', label: '5-15 hours per week' },
  { value: '15-30', label: '15-30 hours per week' },
  { value: '30+', label: '30+ hours per week' }
];

const geographicOptions = [
  { value: 'local', label: 'Local only' },
  { value: 'national', label: 'National' },
  { value: 'international', label: 'International' }
];

const rateRanges = [
  { min: 100, max: 500, label: '100€ - 500€' },
  { min: 500, max: 1000, label: '500€ - 1000€' },
  { min: 1000, max: 2500, label: '1000€ - 2500€' },
  { min: 2500, max: 5000, label: '2500€ - 5000€' },
  { min: 5000, max: 10000, label: '5000€ - 10000€' },
  { min: 10000, max: 50000, label: '10000€+' }
];

export function GoalsPreferencesStep({ data, onChange }: GoalsPreferencesStepProps) {
  const [rateSliderValue, setRateSliderValue] = useState([
    data.rate_range?.min || 500,
    data.rate_range?.max || 2000
  ]);

  const handleRateChange = (values: number[]) => {
    setRateSliderValue(values);
    if (!data.prefer_to_discuss_rates) {
      onChange({ 
        rate_range: { 
          min: values[0], 
          max: values[1] 
        } 
      });
    }
  };

  const handlePreferDiscussChange = (checked: boolean) => {
    onChange({ 
      prefer_to_discuss_rates: checked,
      rate_range: checked ? undefined : { min: rateSliderValue[0], max: rateSliderValue[1] }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Your Collaboration Goals
        </h2>
        <p className="text-muted-foreground mt-2">
          Let's define your preferences for successful partnerships
        </p>
      </div>

      {/* Collaboration Types */}
      <div className="space-y-3">
        <Label>Types of Collaborations Sought *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {collaborationOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={(data.collaboration_types || []).includes(option.value)}
                onCheckedChange={(checked) => {
                  const current = data.collaboration_types || [];
                  const updated = checked
                    ? [...current, option.value]
                    : current.filter(type => type !== option.value);
                  onChange({ collaboration_types: updated });
                }}
              />
              <Label 
                htmlFor={option.value} 
                className="text-sm font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rate Range */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Rate Range per Collaboration</Label>
          <p className="text-sm text-muted-foreground">
            Help brands understand your collaboration budget
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="prefer-discuss"
              checked={data.prefer_to_discuss_rates || false}
              onCheckedChange={handlePreferDiscussChange}
            />
            <Label htmlFor="prefer-discuss" className="text-sm">
              Prefer to discuss rates case by case
            </Label>
          </div>

          {!data.prefer_to_discuss_rates && (
            <div className="space-y-4">
              <Slider
                value={rateSliderValue}
                onValueChange={handleRateChange}
                min={100}
                max={10000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span className="font-medium">{rateSliderValue[0]}€</span>
                <span className="text-muted-foreground">to</span>
                <span className="font-medium">{rateSliderValue[1]}€</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Sector Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Preferred Sectors</Label>
          <MultiSelect
            options={sectorOptions}
            value={data.preferred_sectors || []}
            onChange={(value) => onChange({ preferred_sectors: value })}
            placeholder="Sectors that interest you"
          />
        </div>

        <div className="space-y-2">
          <Label>Sectors to Avoid</Label>
          <MultiSelect
            options={sectorOptions}
            value={data.avoided_sectors || []}
            onChange={(value) => onChange({ avoided_sectors: value })}
            placeholder="Incompatible sectors"
          />
        </div>
      </div>

      <Separator />

      {/* Availability & Geographic Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="availability">Availability *</Label>
          <Select 
            value={data.availability_hours || ''} 
            onValueChange={(value) => onChange({ availability_hours: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Available hours per week" />
            </SelectTrigger>
            <SelectContent>
              {availabilityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="geographic">Geographic Scope *</Label>
          <Select 
            value={data.geographic_scope || ''} 
            onValueChange={(value) => onChange({ geographic_scope: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Geographic preference" />
            </SelectTrigger>
            <SelectContent>
              {geographicOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <p className="text-sm text-green-800 dark:text-green-200">
          🎯 <strong>Final step!</strong> This information will allow us to offer you 
          the most relevant collaborations. You can modify these preferences at any time 
          from your dashboard.
        </p>
      </div>
    </div>
  );
}