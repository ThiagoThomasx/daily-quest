import { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Download, Upload, Trash2, Info, Smartphone, Share2, Plus } from 'lucide-react';
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

export default function SettingsPage() {
  const { state, updateSettings, importState, resetState } = useAppState();
  const { toast } = useToast();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'daily-quest-backup.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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
          toast({ title: 'Import Failed', description: 'Invalid backup file format.', variant: 'destructive' });
        }
      } catch {
        toast({ title: 'Import Failed', description: 'Could not parse the backup file.', variant: 'destructive' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetConfirm = () => {
    setShowResetDialog(false);
    resetState();
    toast({ title: 'Progress Reset', description: 'Your progress has been wiped clean.' });
  };

  return (
    <div className="flex flex-col min-h-[calc(100dvh-4rem)] p-4 pb-8">
      <h1 className="text-2xl font-bold mb-6 pt-3">Settings</h1>

      <div className="space-y-5">
        {/* Preferences */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preferences</h3>
          </div>
          <div className="p-4 flex justify-between items-center border-b border-border/50">
            <div>
              <div className="font-semibold text-sm">Sound Effects</div>
              <div className="text-xs text-muted-foreground">Play sounds on quest completion</div>
            </div>
            <Switch
              checked={state.settings.sound}
              onCheckedChange={(checked) => updateSettings({ ...state.settings, sound: checked })}
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
              onCheckedChange={(checked) => updateSettings({ ...state.settings, haptic: checked })}
              data-testid="toggle-haptic"
            />
          </div>
        </Card>

        {/* Install App */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Install App</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex gap-3 items-start">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Add Daily Quest to your home screen for the best experience — it works like a native app, even offline.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                  <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Open this page in Safari (iOS) or Chrome (Android)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                  <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Tap the Share icon or browser menu
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                  <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Choose "Add to Home Screen"
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Data & Storage */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Data & Storage</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-secondary/50 rounded-lg p-3 flex gap-3 items-start border border-border">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Daily Quest saves all your progress locally on your device. To move your progress to another device, export a backup and import it there.
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

            <div className="pt-4 mt-4 border-t border-border/50">
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

        {/* App info */}
        <div className="text-center text-xs text-muted-foreground pb-4">
          <p className="font-semibold">Daily Quest</p>
          <p className="mt-0.5">Progress stored locally in your browser</p>
        </div>
      </div>

      {/* Reset confirmation dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent data-testid="dialog-reset-confirm">
          <DialogHeader>
            <DialogTitle>Reset all progress?</DialogTitle>
            <DialogDescription>
              This will permanently delete your XP, streaks, and challenge history. This action cannot be undone.
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
