import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type PaywallTrigger = 'habit_limit' | 'journal_history' | 'theme_locked' | 'export_locked' | 'insights_locked' | 'general';

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  trigger?: PaywallTrigger;
}

const PAYWALL_CONTENT: Record<PaywallTrigger, { headline: string; subhead: string; benefits: string[] }> = {
  general: {
    headline: 'Unlock Pro',
    subhead: 'Keep Roya calm and complete — unlock unlimited habits, full history, and deeper reviews.',
    benefits: [
      'Unlimited habits (WIN + QUIT)',
      'Full journal history + daily prompts',
      'Mood trends + gentle insights',
      'Premium themes + customization',
      'Exports (CSV/JSON) and Weekly Review',
    ],
  },
  habit_limit: {
    headline: 'Unlock Pro',
    subhead: "You've reached the free habit limit. Pro unlocks unlimited habits so you can grow your system without squeezing it.",
    benefits: [
      'Unlimited habits (WIN + QUIT)',
      'Streaks + milestones across all habits',
      'Full journal history + daily prompts',
      'Mood trends + gentle insights',
      'Exports (CSV/JSON) and Weekly Review',
    ],
  },
  journal_history: {
    headline: 'Unlock Pro',
    subhead: 'Your earlier reflections are still saved. Pro unlocks your full journal history so you can look back and learn.',
    benefits: [
      'Full journal history + daily prompts',
      'Exports (CSV/JSON) for your reflections',
      'Unlimited habits (WIN + QUIT)',
      'Mood trends + gentle insights',
      'Premium themes + customization',
    ],
  },
  theme_locked: {
    headline: 'Unlock Pro',
    subhead: 'Make Roya feel like your space. Pro unlocks premium themes and deeper customization.',
    benefits: [
      'Premium themes + customization',
      'A calmer UI that matches your style',
      'Unlimited habits (WIN + QUIT)',
      'Full journal history + daily prompts',
      'Exports (CSV/JSON) and Weekly Review',
    ],
  },
  export_locked: {
    headline: 'Unlock Pro',
    subhead: 'Pro unlocks exports so you can keep a copy of your progress anytime.',
    benefits: [
      'Exports (CSV/JSON) for habits, mood, journal',
      'Weekly Review — a clear progress snapshot',
      'Unlimited habits (WIN + QUIT)',
      'Full journal history + daily prompts',
      'Mood trends + gentle insights',
    ],
  },
  insights_locked: {
    headline: 'Unlock Pro',
    subhead: 'Pro unlocks trends and gentle insights to help you understand what supports you.',
    benefits: [
      'Mood trends + gentle insights',
      'Weekly Review to reflect and reset',
      'Unlimited habits (WIN + QUIT)',
      'Full journal history + daily prompts',
      'Exports (CSV/JSON) for your reflections',
    ],
  },
};

const PaywallModal: React.FC<PaywallModalProps> = ({ open, onClose, trigger = 'general' }) => {
  const content = PAYWALL_CONTENT[trigger];

  const handleUpgrade = (plan: 'monthly' | 'yearly' | 'lifetime') => {
    // Placeholder for Stripe integration
    console.log(`[Paywall] User selected: ${plan}`);
    // TODO: Integrate with Stripe
  };

  const handleRestore = () => {
    // Placeholder for restore purchases
    console.log('[Paywall] Restore purchases clicked');
    // TODO: Implement restore logic
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {content.headline}
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            {content.subhead}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Benefits */}
          <div className="space-y-3">
            {content.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm">{benefit}</p>
              </div>
            ))}
          </div>

          {/* Plan Options */}
          <div className="space-y-3">
            <Button
              onClick={() => handleUpgrade('monthly')}
              className="w-full"
              size="lg"
            >
              Go Pro (Monthly)
              <Badge variant="outline" className="ml-2">
                flexible
              </Badge>
            </Button>

            <Button
              onClick={() => handleUpgrade('yearly')}
              className="w-full"
              size="lg"
              variant="default"
            >
              Go Pro (Yearly)
              <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-700 border-green-500/20">
                best value
              </Badge>
            </Button>

            <Button
              onClick={() => handleUpgrade('lifetime')}
              className="w-full"
              size="lg"
              variant="outline"
            >
              Get Lifetime Access
              <Badge variant="outline" className="ml-2">
                own it
              </Badge>
            </Button>
          </div>

          {/* Reassurance */}
          <p className="text-xs text-center text-muted-foreground">
            No pressure. You can keep using Roya for free — upgrade only if it supports you.
          </p>

          {/* Secondary Actions */}
          <div className="flex items-center justify-center gap-4 text-sm">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Not now
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRestore}>
              Restore purchase
            </Button>
          </div>

          {/* Footer */}
          <p className="text-xs text-center text-muted-foreground pt-2">
            Your data stays yours. Upgrade only unlocks features.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallModal;