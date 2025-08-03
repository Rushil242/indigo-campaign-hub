import React, { useState } from 'react';
import { MessageSquare, Settings, Send } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { CampaignTab } from '@/components/CampaignTab';
import { SettingsTab } from '@/components/SettingsTab';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DashboardSettings {
  triggerUrl: string;
  templatesUrl: string;
}

export function WhatsAppDashboard() {
  const [settings, setSettings] = useLocalStorage<DashboardSettings>('whatsapp-dashboard-settings', {
    triggerUrl: '',
    templatesUrl: ''
  });

  const handleSettingsChange = (triggerUrl: string, templatesUrl: string) => {
    setSettings({ triggerUrl, templatesUrl });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              WhatsApp Campaign Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            Manage your WhatsApp promotional campaigns with ease. Upload data, select templates, and launch campaigns.
          </p>
        </div>

        {/* Main Dashboard Card */}
        <Card className="p-8 shadow-lg border-0 bg-card animate-fade-in">
          <Tabs defaultValue="campaign" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger 
                value="campaign" 
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Send className="h-4 w-4" />
                Campaign
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="campaign" className="space-y-6">
              <CampaignTab
                triggerUrl={settings.triggerUrl}
                templatesUrl={settings.templatesUrl}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <SettingsTab
                triggerUrl={settings.triggerUrl}
                templatesUrl={settings.templatesUrl}
                onSettingsChange={handleSettingsChange}
              />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground animate-fade-in">
          <p>Built with ❤️ for efficient WhatsApp campaign management</p>
        </div>
      </div>
    </div>
  );
}