import React from 'react';
import { useAppState } from '../hooks/useAppState';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Download, Upload, Trash2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const { state, updateSettings, importState, resetState } = useAppState();
  const { toast } = useToast();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "daily-quest-backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: "Backup Exported", description: "Your progress has been downloaded." });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const obj = JSON.parse(event.target?.result as string);
        if (importState(obj)) {
          toast({ title: "Backup Restored", description: "Your progress has been successfully restored." });
        } else {
          toast({ title: "Import Failed", description: "Invalid backup file format.", variant: "destructive" });
        }
      } catch (err) {
        toast({ title: "Import Failed", description: "Could not parse the backup file.", variant: "destructive" });
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to completely reset your progress? This cannot be undone.")) {
      resetState();
      toast({ title: "Progress Reset", description: "Your progress has been wiped clean." });
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100dvh-5rem)] p-4 sm:p-6 pb-8">
      <h1 className="text-3xl font-bold mb-6 pt-4">Settings</h1>
      
      <div className="space-y-6">
        <Card className="bg-card border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Preferences</h3>
          </div>
          <div className="p-4 flex justify-between items-center border-b border-border/50">
            <div>
              <div className="font-bold">Sound Effects</div>
              <div className="text-xs text-muted-foreground">Play sounds on quest completion</div>
            </div>
            <Switch 
              checked={state.settings.sound} 
              onCheckedChange={(checked) => updateSettings({ ...state.settings, sound: checked })}
            />
          </div>
          <div className="p-4 flex justify-between items-center">
            <div>
              <div className="font-bold">Haptic Feedback</div>
              <div className="text-xs text-muted-foreground">Vibrate on quest completion</div>
            </div>
            <Switch 
              checked={state.settings.haptic} 
              onCheckedChange={(checked) => updateSettings({ ...state.settings, haptic: checked })}
            />
          </div>
        </Card>

        <Card className="bg-card border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Data & Storage</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-secondary/50 rounded-lg p-3 flex gap-3 items-start border border-border">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Daily Quest saves all your progress locally on your device. To move your progress to another device, export a backup and import it there.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full h-12" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <div className="relative">
                <Input 
                  type="file" 
                  accept=".json" 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                  onChange={handleImport}
                />
                <Button variant="outline" className="w-full h-12 pointer-events-none">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>
            
            <div className="pt-4 mt-4 border-t border-border/50">
              <Button variant="destructive" className="w-full h-12 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border border-destructive/20" onClick={handleReset}>
                <Trash2 className="w-4 h-4 mr-2" />
                Reset All Progress
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
