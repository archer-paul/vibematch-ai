import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Bot,
  Sparkles,
  Youtube,
  Users,
  Target,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isDemoMode } from "@/data/demoData";

const DEMO_RECOMMENDATIONS: RecommendedCreator[] = [
  {
    name: "MKBHD",
    handle: "@mkbhd",
    subscribers: "20.7M",
    reason: "Top tech reviewer with 20M+ subscribers. Deep, high-quality iPhone reviews reaching a massive tech-savvy audience.",
    niches: ["Technology", "Reviews"],
  },
  {
    name: "Sara Dietschy",
    handle: "@saradietschy",
    subscribers: "820K",
    reason: "Creative storytelling around tech products. Appeals to a broader lifestyle audience beyond pure tech.",
    niches: ["Technology", "Lifestyle", "Creativity"],
  },
  {
    name: "iJustine",
    handle: "@ijustine",
    subscribers: "7.2M",
    reason: "Long-standing Apple ecosystem creator. Authentic unboxing and first-impression format ideal for launch content.",
    niches: ["Technology", "Lifestyle"],
  },
];

const AVAILABLE_NICHES = [
  "Technology", "Gaming", "Beauty", "Fitness", "Fashion",
  "Food", "Travel", "Education", "Entertainment", "Music",
  "Finance", "Lifestyle", "Science", "Sports", "Sustainability",
];

const AVAILABLE_OBJECTIVES = [
  "Brand Awareness", "Sales", "Engagement",
  "Product Reviews", "Content Creation", "Lead Generation",
];

interface RecommendedCreator {
  name: string;
  handle: string;
  subscribers: string;
  reason: string;
  niches: string[];
}

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formName, setFormName] = useState("");
  const [formBudget, setFormBudget] = useState("");
  const [formNiches, setFormNiches] = useState<string[]>([]);
  const [formObjectives, setFormObjectives] = useState<string[]>([]);
  const [formAudience, setFormAudience] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedCreator[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleChip = (value: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const resetForm = () => {
    setFormName("");
    setFormBudget("");
    setFormNiches([]);
    setFormObjectives([]);
    setFormAudience("");
    setRecommendations([]);
    setShowRecommendations(false);
    setError(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    // Don't let the dialog close during demo (the overlay handles closing it)
    if (!nextOpen && isDemoMode()) return;
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  // Pre-fill form with demo data (called by DemoOverlay)
  const demoFillForm = () => {
    setFormName("iPhone 17 Launch");
    setFormBudget("50000");
    setFormNiches(["Technology", "Lifestyle"]);
    setFormObjectives(["Brand Awareness", "Product Reviews"]);
    setFormAudience("Tech-savvy 18-34 year olds interested in smartphones and innovation");
  };

  // Expose for demo auto-fill and close via custom events
  useEffect(() => {
    const fillHandler = () => demoFillForm();
    const closeHandler = () => {
      resetForm();
      onOpenChange(false);
    };
    window.addEventListener("demo-fill-campaign", fillHandler);
    window.addEventListener("demo-close-dialog", closeHandler);
    return () => {
      window.removeEventListener("demo-fill-campaign", fillHandler);
      window.removeEventListener("demo-close-dialog", closeHandler);
    };
  }, [onOpenChange]);

  const handleSubmit = async () => {
    if (!formName.trim()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      // In demo mode, return mock recommendations
      if (isDemoMode()) {
        await new Promise((r) => setTimeout(r, 1500)); // simulate API delay
        setRecommendations(DEMO_RECOMMENDATIONS);
        setShowRecommendations(true);
        toast({
          title: "Campaign created!",
          description: `AI found ${DEMO_RECOMMENDATIONS.length} matching creators for "${formName}"`,
        });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sponsorId: profile?.user_id || "demo",
          name: formName.trim(),
          budget: parseInt(formBudget) || 0,
          niches: formNiches,
          objectives: formObjectives,
          audienceDescription: formAudience.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${response.status})`);
      }

      const data = await response.json();

      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
        setShowRecommendations(true);
        toast({
          title: "Campaign created!",
          description: `AI found ${data.recommendations.length} matching creators for "${formName}"`,
        });
      } else {
        setShowRecommendations(true);
        setRecommendations([]);
        toast({
          variant: "destructive",
          title: "No recommendations",
          description: "AI couldn't find matching creators. Try adjusting your brief.",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast({
        variant: "destructive",
        title: "Campaign creation failed",
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-demo="campaign-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            {showRecommendations ? "Your AI-Matched Creators" : "Find Your Perfect Creators"}
          </DialogTitle>
          <DialogDescription>
            {showRecommendations
              ? `Based on your campaign "${formName}", here are the best creator matches`
              : "Describe your campaign and our AI will match you with the ideal YouTube creators"}
          </DialogDescription>
        </DialogHeader>

        {!showRecommendations ? (
          <div className="space-y-5 mt-2">
            {/* Value prop banner */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-4 flex items-start gap-3">
              <Zap className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">AI-Powered Creator Matching</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Our AI analyzes thousands of YouTube creators to find the ones whose audience,
                  content style, and niches align perfectly with your brand.
                </p>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Name</label>
              <Input
                placeholder="e.g. Summer Product Launch"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Budget (USD)</label>
              <Input
                type="number"
                placeholder="e.g. 25000"
                value={formBudget}
                onChange={(e) => setFormBudget(e.target.value)}
              />
            </div>

            {/* Niches */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Niches</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_NICHES.map((niche) => (
                  <Badge
                    key={niche}
                    variant={formNiches.includes(niche) ? "default" : "outline"}
                    className="cursor-pointer select-none transition-colors"
                    onClick={() => toggleChip(niche, formNiches, setFormNiches)}
                  >
                    {niche}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Objectives</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_OBJECTIVES.map((obj) => (
                  <Badge
                    key={obj}
                    variant={formObjectives.includes(obj) ? "default" : "outline"}
                    className="cursor-pointer select-none transition-colors"
                    onClick={() => toggleChip(obj, formObjectives, setFormObjectives)}
                  >
                    {obj}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Audience Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience Description</label>
              <Textarea
                placeholder="Describe your ideal target audience (age, interests, location...)"
                value={formAudience}
                onChange={(e) => setFormAudience(e.target.value)}
                rows={3}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={handleSubmit}
              disabled={isSubmitting || !formName.trim()}
              size="lg"
              data-demo="campaign-submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Matching you with creators...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4" />
                  Find Matching Creators
                </>
              )}
            </Button>
          </div>
        ) : (
          /* AI Recommendations Panel */
          <div className="space-y-4 mt-2">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-3 text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <span>
                <span className="font-medium">{formName}</span>
                {formNiches.length > 0 && (
                  <span className="text-muted-foreground"> — {formNiches.join(", ")}</span>
                )}
                {formBudget && (
                  <span className="text-muted-foreground">
                    {" "}— ${parseInt(formBudget).toLocaleString()} budget
                  </span>
                )}
              </span>
            </div>

            {recommendations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>No matching creators found. Try adjusting your campaign brief.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setShowRecommendations(false);
                    setRecommendations([]);
                  }}
                >
                  Edit Campaign Brief
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  {recommendations.length} creators matched — click "Analyze" to run our full AI research pipeline
                </p>
                {recommendations.map((creator, index) => (
                  <Card key={index} className="border hover:shadow-md transition-shadow" data-demo={index === 0 ? "first-match" : undefined}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">{creator.name}</h4>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Youtube className="h-3 w-3 text-red-500" />
                                {creator.handle}
                                <span className="mx-1">|</span>
                                <Users className="h-3 w-3" />
                                {creator.subscribers}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 ml-10">
                            {creator.reason}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2 ml-10">
                            {creator.niches.map((niche) => (
                              <Badge key={niche} variant="secondary" className="text-xs">
                                {niche}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-shrink-0 gap-1"
                          data-demo={index === 0 ? "first-match-analyze" : undefined}
                          data-demo-handle={creator.handle}
                          onClick={() => {
                            if (isDemoMode()) {
                              window.dispatchEvent(new Event('demo-close-dialog'));
                            } else {
                              handleOpenChange(false);
                            }
                            navigate(`/discover?handle=${encodeURIComponent(creator.handle)}`);
                          }}
                        >
                          <Bot className="h-3 w-3" />
                          Analyze
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setShowRecommendations(false);
                setRecommendations([]);
              }}
            >
              Create Another Campaign
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
