import React, { useState } from 'react';
import { Settings, Save, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SettingsTabProps {
  triggerUrl: string;
  templatesUrl: string;
  onSettingsChange: (triggerUrl: string, templatesUrl: string) => void;
}

export function SettingsTab({ triggerUrl, templatesUrl, onSettingsChange }: SettingsTabProps) {
  const [localTriggerUrl, setLocalTriggerUrl] = useState(triggerUrl);
  const [localTemplatesUrl, setLocalTemplatesUrl] = useState(templatesUrl);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const validateUrl = (url: string) => {
    if (!url.trim()) return false;
    try {
      new URL(url);
      return url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const isTriggerUrlValid = validateUrl(localTriggerUrl);
  const isTemplatesUrlValid = validateUrl(localTemplatesUrl);
  const hasChanges = localTriggerUrl !== triggerUrl || localTemplatesUrl !== templatesUrl;
  const canSave = isTriggerUrlValid && isTemplatesUrlValid && hasChanges;

  const handleSave = async () => {
    if (!canSave) return;

    setIsSaving(true);
    try {
      // Simulate save delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSettingsChange(localTriggerUrl, localTemplatesUrl);
      
      toast({
        title: "Settings Saved",
        description: "Your API URLs have been updated successfully.",
        className: "bg-success text-success-foreground",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 transition-all duration-200 hover:shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          API Configuration
        </h3>
        
        <div className="space-y-6">
          {/* Trigger URL Input */}
          <div className="space-y-2">
            <Label htmlFor="trigger-url" className="text-sm font-medium">
              Campaign Trigger URL
            </Label>
            <div className="relative">
              <Input
                id="trigger-url"
                type="url"
                value={localTriggerUrl}
                onChange={(e) => setLocalTriggerUrl(e.target.value)}
                placeholder="https://api.example.com/triggerCampaign"
                className={cn(
                  "pr-10 transition-all duration-200",
                  localTriggerUrl && isTriggerUrlValid && "border-success",
                  localTriggerUrl && !isTriggerUrlValid && "border-destructive"
                )}
              />
              {localTriggerUrl && (
                isTriggerUrlValid ? (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-success" />
                ) : (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Endpoint for submitting campaign data
            </p>
          </div>

          {/* Templates URL Input */}
          <div className="space-y-2">
            <Label htmlFor="templates-url" className="text-sm font-medium">
              Templates Fetch URL
            </Label>
            <div className="relative">
              <Input
                id="templates-url"
                type="url"
                value={localTemplatesUrl}
                onChange={(e) => setLocalTemplatesUrl(e.target.value)}
                placeholder="https://api.example.com/listTemplates"
                className={cn(
                  "pr-10 transition-all duration-200",
                  localTemplatesUrl && isTemplatesUrlValid && "border-success",
                  localTemplatesUrl && !isTemplatesUrlValid && "border-destructive"
                )}
              />
              {localTemplatesUrl && (
                isTemplatesUrlValid ? (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-success" />
                ) : (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Endpoint for fetching available templates
            </p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={!canSave || isSaving}
        className={cn(
          "w-full h-12 text-base font-medium transition-all duration-200",
          "hover:scale-[1.02] active:scale-[0.98]",
          canSave && !isSaving && "bg-primary hover:bg-primary/90"
        )}
      >
        {isSaving ? (
          <>
            <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving Settings...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </>
        )}
      </Button>

      {!hasChanges && (isTriggerUrlValid && isTemplatesUrlValid) && (
        <p className="text-sm text-muted-foreground text-center animate-fade-in">
          Settings are up to date
        </p>
      )}
    </div>
  );
}