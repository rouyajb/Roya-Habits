import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  User, 
  LogOut, 
  Download, 
  Palette, 
  Lock,
  Crown,
  FileText,
  BarChart3,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import PaywallModal, { PaywallTrigger } from '@/components/paywall/PaywallModal';
import { 
  getHabitsRepository, 
  getMoodRepository, 
  getJournalRepository,
  getSubscriptionService 
} from '@/services/ServiceFactory';
import { 
  exportHabitsToCSV, 
  exportHabitLogsToCSV, 
  exportMoodLogsToCSV, 
  exportJournalEntriesToCSV,
  downloadCSV,
  downloadJSON
} from '@/utils/exportData';
import { ThemeName } from '@/types';

const THEMES: Array<{ name: ThemeName; label: string; description: string; proOnly: boolean }> = [
  { name: 'minimal', label: 'Minimal', description: 'Clean neutrals', proOnly: false },
  { name: 'soft', label: 'Soft', description: 'Warm & gentle', proOnly: false },
  { name: 'bold', label: 'Bold', description: 'Strong accent', proOnly: true },
  { name: 'dark', label: 'Dark', description: 'Elegant night', proOnly: true },
];

const Profile = () => {
  const { user, signOut } = useAuth();
  const { subscription, entitlements } = useSubscription();
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('minimal');
  const [alwaysRevealJournal, setAlwaysRevealJournal] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallTrigger, setPaywallTrigger] = useState<PaywallTrigger>('general');
  const [exporting, setExporting] = useState(false);

  const habitsRepo = getHabitsRepository();
  const moodRepo = getMoodRepository();
  const journalRepo = getJournalRepository();
  const subscriptionService = getSubscriptionService();

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }

    // Load journal setting
    const journalSetting = localStorage.getItem('alwaysRevealJournal');
    if (journalSetting) {
      setAlwaysRevealJournal(journalSetting === 'true');
    }
  }, []);

  const applyTheme = (theme: ThemeName) => {
    const html = document.documentElement;
    
    // Remove all theme classes
    html.classList.remove('theme-soft', 'theme-bold', 'dark');
    
    // Apply new theme
    if (theme === 'soft') {
      html.classList.add('theme-soft');
    } else if (theme === 'bold') {
      html.classList.add('theme-bold');
    } else if (theme === 'dark') {
      html.classList.add('dark');
    }
    // 'minimal' is default, no class needed
  };

  const handleThemeChange = async (theme: ThemeName) => {
    const themeConfig = THEMES.find(t => t.name === theme);
    
    if (themeConfig?.proOnly && !entitlements?.premiumThemes) {
      setPaywallTrigger('theme_locked');
      setPaywallOpen(true);
      return;
    }

    setCurrentTheme(theme);
    applyTheme(theme);
    localStorage.setItem('theme', theme);
    toast.success(`Theme changed to ${themeConfig?.label}`);
  };

  const handleJournalPrivacyToggle = (checked: boolean) => {
    setAlwaysRevealJournal(checked);
    localStorage.setItem('alwaysRevealJournal', checked.toString());
    toast.success(checked ? 'Journal always revealed' : 'Journal privacy enabled');
  };

  const handleExport = async (format: 'csv' | 'json') => {
    if (!user || !entitlements?.dataExport) {
      setPaywallTrigger('export_locked');
      setPaywallOpen(true);
      return;
    }

    setExporting(true);

    try {
      const timestamp = new Date().toISOString().split('T')[0];

      if (format === 'csv') {
        // Export habits
        const habits = await habitsRepo.getHabits(user.id);
        const habitsCSV = exportHabitsToCSV(habits);
        downloadCSV(`roya-habits-${timestamp}.csv`, habitsCSV);

        // Export habit logs
        const startDate = new Date(0); // All time
        const endDate = new Date();
        const allLogs = [];
        for (const habit of habits) {
          const logs = await habitsRepo.getHabitLogs(habit.id, startDate, endDate);
          allLogs.push(...logs);
        }
        const logsCSV = exportHabitLogsToCSV(allLogs);
        downloadCSV(`roya-habit-logs-${timestamp}.csv`, logsCSV);

        // Export mood logs
        const moodLogs = await moodRepo.getMoodLogs(user.id, startDate, endDate);
        const moodCSV = exportMoodLogsToCSV(moodLogs);
        downloadCSV(`roya-mood-logs-${timestamp}.csv`, moodCSV);

        // Export journal entries
        const journalEntries = await journalRepo.getEntries(user.id, startDate, endDate);
        const journalCSV = exportJournalEntriesToCSV(journalEntries);
        downloadCSV(`roya-journal-${timestamp}.csv`, journalCSV);

        toast.success('CSV files downloaded');
      } else {
        // Export as JSON
        const habits = await habitsRepo.getHabits(user.id);
        const startDate = new Date(0);
        const endDate = new Date();
        
        const allLogs = [];
        for (const habit of habits) {
          const logs = await habitsRepo.getHabitLogs(habit.id, startDate, endDate);
          allLogs.push(...logs);
        }

        const moodLogs = await moodRepo.getMoodLogs(user.id, startDate, endDate);
        const journalEntries = await journalRepo.getEntries(user.id, startDate, endDate);

        const exportData = {
          exportDate: new Date().toISOString(),
          user: {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
          },
          habits,
          habitLogs: allLogs,
          moodLogs,
          journalEntries,
        };

        downloadJSON(`roya-export-${timestamp}.json`, exportData);
        toast.success('JSON file downloaded');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const isPro = subscription?.status === 'active' && 
    (subscription.plan === 'PRO_MONTHLY' || subscription.plan === 'PRO_YEARLY' || subscription.plan === 'LIFETIME');

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">Email</Label>
            <p className="text-base">{user?.email}</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Display Name</Label>
            <p className="text-base">{user?.displayName || 'Not set'}</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Plan</Label>
            <div className="flex items-center gap-2 mt-1">
              {isPro ? (
                <>
                  <Badge variant="default" className="flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    {subscription?.plan === 'LIFETIME' ? 'LIFETIME' : 'PRO'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    All features unlocked
                  </span>
                </>
              ) : (
                <>
                  <Badge variant="outline">FREE</Badge>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => {
                      setPaywallTrigger('general');
                      setPaywallOpen(true);
                    }}
                  >
                    Upgrade to Pro
                  </Button>
                </>
              )}
            </div>
          </div>
          <Separator />
          <Button variant="outline" onClick={handleSignOut} className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* Theme Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Themes
          </CardTitle>
          <CardDescription>Choose your visual style</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleThemeChange(theme.name)}
                className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                  currentTheme === theme.name
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${theme.proOnly && !entitlements?.premiumThemes ? 'opacity-60' : ''}`}
              >
                {theme.proOnly && !entitlements?.premiumThemes && (
                  <Lock className="absolute top-2 right-2 h-4 w-4 text-muted-foreground" />
                )}
                <p className="font-medium">{theme.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{theme.description}</p>
                {theme.proOnly && !entitlements?.premiumThemes && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Pro
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="journal-privacy">Always reveal journal</Label>
              <p className="text-sm text-muted-foreground">
                Show journal entries without tapping to reveal
              </p>
            </div>
            <Switch
              id="journal-privacy"
              checked={alwaysRevealJournal}
              onCheckedChange={handleJournalPrivacyToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Export Center */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Center
            {!entitlements?.dataExport && (
              <Badge variant="secondary" className="ml-2">
                Pro
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Download your data in CSV or JSON format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            className="w-full"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export as CSV'}
          </Button>
          <Button
            onClick={() => handleExport('json')}
            disabled={exporting}
            className="w-full"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export as JSON'}
          </Button>
          <p className="text-xs text-muted-foreground">
            Includes: habits, habit logs, mood logs, and journal entries
          </p>
        </CardContent>
      </Card>

      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        trigger={paywallTrigger}
      />
    </div>
  );
};

export default Profile;