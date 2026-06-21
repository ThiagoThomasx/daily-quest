import { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Download, Upload, Trash2, Info, Smartphone, Share2, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Category, EnergyMode, PreferredDifficulty, QuestPreferences } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_CATEGORIES: Category[] = [
  'Productivity', 'Learning', 'Health', 'Creativity',
  'Social', 'Career', 'Reflection', 'Fun',
];

const CATEGORY_COLORS: Record<Category, string> = {
  Productivity: 'bg-blue-500/20 text-blue-400 border-blue-500/40 data-[active=true]:bg-blue-500 data-[active=true]:text-white data-[active=true]:border-blue-500',
  Learning:     'bg-purple-500/20 text-purple-400 border-purple-500/40 data-[active=true]:bg-purple-500 data-[active=true]:text-white data-[active=true]:border-purple-500',
  Health:       'bg-green-500/20 text-green-400 border-green-500/40 data-[active=true]:bg-green-500 data-[active=true]:text-white data-[active=true]:border-green-500',
  Creativity:   'bg-orange-500/20 text-orange-400 border-orange-500/40 data-[active=true]:bg-orange-500 data-[active=true]:text-white data-[active=true]:border-orange-500',
  Social:       'bg-pink-500/20 text-pink-400 border-pink-500/40 data-[active=true]:bg-pink-500 data-[active=true]:text-white data-[active=true]:border-pink-500',
  Career:       'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 data-[active=true]:bg-cyan-500 data-[active=true]:text-white data-[active=true]:border-cyan-500',
  Reflection:   'bg-amber-500/20 text-amber-400 border-amber-500/40 data-[active=true]:bg-amber-500 data-[active=true]:text-white data-[active=true]:border-amber-500',
  Fun:          'bg-rose-500/20 text-rose-400 border-rose-500/40 data-[active=true]:bg-rose-500 data-[active=true]:text-white data-[active=true]:border-rose-500',
};

const DIFFICULTY_OPTIONS: PreferredDifficulty[] = ['Any', 'Easy', 'Medium', 'Hard'];
const ENERGY_OPTIONS: EnergyMode[] = ['Low Energy', 'Balanced', 'High Energy'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="p-4 border-b border-border">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</h3>
    </div>
  );
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  testIdPrefix,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  testIdPrefix?: string;
}) {
  return (
    <div className="flex rounded-lg border border-border overflow-hidden">
      {options.map(opt => (
        <button
          key={opt}
          data-testid={testIdPrefix ? `${testIdPrefix}-${opt.toLowerCase().replace(/\s/g, '-')}` : undefined}
          onClick={() => onChange(opt)}
          className={`flex-1 py-2 px-1 text-xs font-semibold transition-colors leading-tight text-center ${
            value === opt
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground hover:bg-secondary'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function CategoryChips({
  label,
  selected,
  blocked,
  onToggle,
  variant,
}: {
  label: string;
  selected: Category[];
  blocked: Category[];
  onToggle: (cat: Category) => void;
  variant: 'prefer' | 'block';
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map(cat => {
          const isActive = selected.includes(cat);
          const isConflict = variant === 'prefer' ? blocked.includes(cat) : false;
          if (isConflict) return null;

          if (variant === 'block') {
            const isBlocked = selected.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => onToggle(cat)}
                data-testid={`chip-block-${cat.toLowerCase()}`}
                data-active={isBlocked}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                  isBlocked
                    ? 'bg-destructive/20 text-red-400 border-destructive/40'
                    : 'bg-secondary/60 text-muted-foreground border-border hover:border-border/80'
                }`}
              >
                {isBlocked && <X className="w-3 h-3" />}
                {cat}
              </button>
            );
          }

          return (
            <button
              key={cat}
              onClick={() => onToggle(cat)}
              data-testid={`chip-prefer-${cat.toLowerCase()}`}
              data-active={isActive}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                isActive ? CATEGORY_COLORS[cat].split(' data-[active=true]:').join(' ').replace('bg-', 'bg-').split(' ')[0] + ' ' + CATEGORY_COLORS[cat].split('data-[active=true]:').slice(1).join(' ').replace(/bg-\w+-\d+\/\d+ /g, '').replace(/text-\w+-\d+ /g, '').replace(/border-\w+-\d+\/\d+/g, '') : CATEGORY_COLORS[cat].split(' data-[active=true]:')[0]
              } ${isActive ? `!bg-${cat === 'Productivity' ? 'blue' : cat === 'Learning' ? 'purple' : cat === 'Health' ? 'green' : cat === 'Creativity' ? 'orange' : cat === 'Social' ? 'pink' : cat === 'Career' ? 'cyan' : cat === 'Reflection' ? 'amber' : 'rose'}-500 !text-white !border-transparent` : ''}`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { state, updateSettings, updatePreferences, importState, resetState } = useAppState();
  const { toast } = useToast();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const prefs = state.preferences;

  // ── Preference helpers ──────────────────────────────────────────────────────

  function togglePreferred(cat: Category) {
    const already = prefs.preferredCategories.includes(cat);
    updatePreferences({
      ...prefs,
      preferredCategories: already
        ? prefs.preferredCategories.filter(c => c !== cat)
        : [...prefs.preferredCategories, cat],
      // If cat was blocked, unblock it when preferring
      blockedCategories: prefs.blockedCategories.filter(c => c !== cat),
    });
  }

  function toggleBlocked(cat: Category) {
    const already = prefs.blockedCategories.includes(cat);
    // Validate: don't allow all categories to be blocked
    if (!already && prefs.blockedCategories.length >= ALL_CATEGORIES.length - 1) {
      toast({
        title: 'Cannot block all categories',
        description: 'At least one category must remain available.',
        variant: 'destructive',
      });
      return;
    }
    updatePreferences({
      ...prefs,
      blockedCategories: already
        ? prefs.blockedCategories.filter(c => c !== cat)
        : [...prefs.blockedCategories, cat],
      // If cat was preferred, unprefer it when blocking
      preferredCategories: prefs.preferredCategories.filter(c => c !== cat),
    });
  }

  // ── Data handlers ───────────────────────────────────────────────────────────

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'daily-quest-backup.json');
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast({ title: 'Backup Exported', description: 'Your progress has been downloaded.' });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const obj = JSON.parse(event.target?.result as string);
        if (importState(obj)) {
          toast({ title: 'Backup Restored', description: 'Your progress has been successfully restored.' });
        } else {
          toast({ title: 'Import Failed', description: 'Invalid backup file.', variant: 'destructive' });
        }
      } catch {
        toast({ title: 'Import Failed', description: 'Could not parse file.', variant: 'destructive' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetConfirm = () => {
    setShowResetDialog(false);
    resetState();
    toast({ title: 'Progress Reset', description: 'All progress has been cleared.' });
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 pb-8 pt-3">
      <h1 className="text-2xl font-bold mb-5">Settings</h1>

      <div className="space-y-4">

        {/* ── 1. Quest Preferences ── */}
        <Card className="bg-card border-border overflow-hidden">
          <SectionHeader title="Quest Preferences" />
          <div className="p-4 space-y-5">

            {/* Preferred categories */}
            <div>
              <p className="text-sm font-semibold mb-1">Preferred Categories</p>
              <p className="text-xs text-muted-foreground mb-3">
                Quests from selected categories are prioritised. Leave empty for any.
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map(cat => {
                  const isActive = prefs.preferredCategories.includes(cat);
                  const isConflict = prefs.blockedCategories.includes(cat);
                  if (isConflict) return null;
                  const colorMap: Record<Category, string> = {
                    Productivity: isActive ? 'bg-blue-500 text-white border-blue-500'   : 'bg-blue-500/15 text-blue-400 border-blue-500/30',
                    Learning:     isActive ? 'bg-purple-500 text-white border-purple-500' : 'bg-purple-500/15 text-purple-400 border-purple-500/30',
                    Health:       isActive ? 'bg-green-500 text-white border-green-500'  : 'bg-green-500/15 text-green-400 border-green-500/30',
                    Creativity:   isActive ? 'bg-orange-500 text-white border-orange-500': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
                    Social:       isActive ? 'bg-pink-500 text-white border-pink-500'    : 'bg-pink-500/15 text-pink-400 border-pink-500/30',
                    Career:       isActive ? 'bg-cyan-500 text-white border-cyan-500'    : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
                    Reflection:   isActive ? 'bg-amber-500 text-white border-amber-500'  : 'bg-amber-500/15 text-amber-400 border-amber-500/30',
                    Fun:          isActive ? 'bg-rose-500 text-white border-rose-500'    : 'bg-rose-500/15 text-rose-400 border-rose-500/30',
                  };
                  return (
                    <button
                      key={cat}
                      onClick={() => togglePreferred(cat)}
                      data-testid={`chip-prefer-${cat.toLowerCase()}`}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${colorMap[cat]}`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              {prefs.preferredCategories.length > 0 && (
                <button
                  onClick={() => updatePreferences({ ...prefs, preferredCategories: [] })}
                  className="mt-2 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Blocked categories */}
            <div>
              <p className="text-sm font-semibold mb-1">Blocked Categories</p>
              <p className="text-xs text-muted-foreground mb-3">
                These categories will never be selected.
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map(cat => {
                  const isBlocked = prefs.blockedCategories.includes(cat);
                  const isConflict = prefs.preferredCategories.includes(cat);
                  if (isConflict) return null;
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleBlocked(cat)}
                      data-testid={`chip-block-${cat.toLowerCase()}`}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        isBlocked
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : 'bg-secondary/60 text-muted-foreground border-border hover:border-border/80'
                      }`}
                    >
                      {isBlocked && <X className="w-3 h-3 shrink-0" />}
                      {cat}
                    </button>
                  );
                })}
              </div>
              {prefs.blockedCategories.length > 0 && (
                <button
                  onClick={() => updatePreferences({ ...prefs, blockedCategories: [] })}
                  className="mt-2 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Preferred difficulty */}
            <div>
              <p className="text-sm font-semibold mb-1">Preferred Difficulty</p>
              <p className="text-xs text-muted-foreground mb-3">
                Overrides the energy mode when set.
              </p>
              <SegmentedControl
                options={DIFFICULTY_OPTIONS}
                value={prefs.preferredDifficulty}
                onChange={v => updatePreferences({ ...prefs, preferredDifficulty: v })}
                testIdPrefix="difficulty"
              />
            </div>

            {/* Energy mode */}
            <div>
              <p className="text-sm font-semibold mb-1">Daily Energy Mode</p>
              <p className="text-xs text-muted-foreground mb-3">
                Low Energy → Easy · Balanced → Easy + Medium · High Energy → Medium + Hard
              </p>
              <SegmentedControl
                options={ENERGY_OPTIONS}
                value={prefs.energyMode}
                onChange={v => updatePreferences({ ...prefs, energyMode: v })}
                testIdPrefix="energy"
              />
            </div>

          </div>
        </Card>

        {/* ── 2. App Experience ── */}
        <Card className="bg-card border-border overflow-hidden">
          <SectionHeader title="App Experience" />
          <div className="p-4 flex justify-between items-center border-b border-border/50">
            <div>
              <div className="font-semibold text-sm">Sound Effects</div>
              <div className="text-xs text-muted-foreground">Play sounds on quest completion</div>
            </div>
            <Switch
              checked={state.settings.sound}
              onCheckedChange={checked => updateSettings({ ...state.settings, sound: checked })}
              data-testid="toggle-sound"
            />
          </div>
          <div className="p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold text-sm">Haptic Feedback</div>
              <div className="text-xs text-muted-foreground">Vibrate on quest completion</div>
            </div>
            <Switch
              checked={state.settings.haptic}
              onCheckedChange={checked => updateSettings({ ...state.settings, haptic: checked })}
              data-testid="toggle-haptic"
            />
          </div>
        </Card>

        {/* ── 3. Install App ── */}
        <Card className="bg-card border-border overflow-hidden">
          <SectionHeader title="Install App" />
          <div className="p-4 space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex gap-3 items-start">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Add Daily Quest to your home screen for the best experience — it works like a native app, even offline.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { Icon: Smartphone, text: 'Open this page in Safari (iOS) or Chrome (Android)' },
                { Icon: Share2,     text: 'Tap the Share icon or browser menu' },
                { Icon: Plus,       text: 'Choose "Add to Home Screen"' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* ── 4. Data Management ── */}
        <Card className="bg-card border-border overflow-hidden">
          <SectionHeader title="Data Management" />
          <div className="p-4 space-y-4">
            <div className="bg-secondary/50 rounded-lg p-3 flex gap-3 items-start border border-border">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                All progress is stored locally in your browser. Export a backup to keep it safe or move it to another device.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full h-12" onClick={handleExport} data-testid="button-export">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <div className="relative">
                <Input
                  type="file"
                  accept=".json"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  onChange={handleImport}
                  data-testid="input-import"
                />
                <Button variant="outline" className="w-full h-12 pointer-events-none">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>
            <div className="pt-3 border-t border-border/50">
              <Button
                variant="destructive"
                className="w-full h-12 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border border-destructive/20"
                onClick={() => setShowResetDialog(true)}
                data-testid="button-reset"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Reset All Progress
              </Button>
            </div>
          </div>
        </Card>

        {/* ── 5. About ── */}
        <div className="text-center text-xs text-muted-foreground pb-4 space-y-0.5">
          <p className="font-semibold">Daily Quest</p>
          <p>Progress stored locally · No account required</p>
        </div>
      </div>

      {/* Reset dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent data-testid="dialog-reset-confirm">
          <DialogHeader>
            <DialogTitle>Reset all progress?</DialogTitle>
            <DialogDescription>
              This will permanently delete your XP, streaks, challenge history, and preferences. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(false)}
              className="w-full sm:w-auto"
              data-testid="button-reset-cancel"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleResetConfirm}
              className="w-full sm:w-auto"
              data-testid="button-reset-confirm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Reset Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
