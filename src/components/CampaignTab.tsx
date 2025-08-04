import React, { useState, useEffect } from 'react';
import { Send, Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { FileUpload } from '@/components/FileUpload';
import { UrlInput } from '@/components/UrlInput';
import { TemplateSelector, Template } from '@/components/TemplateSelector';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CampaignTabProps {
  triggerUrl: string;
  templatesUrl: string;
}

export function CampaignTab({ triggerUrl, templatesUrl }: CampaignTabProps) {
  const [inputMode, setInputMode] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const { toast } = useToast();

  // Fetch templates when templatesUrl changes
  useEffect(() => {
    if (templatesUrl) {
      fetchTemplates();
    }
  }, [templatesUrl]);

  const fetchTemplates = async () => {
    if (!templatesUrl) return;
    
    setIsLoadingTemplates(true);
    try {
      // Call the Edge Function directly via fetch
      const response = await fetch('/api/functions/v1/get-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTemplates(Array.isArray(data.templates) ? data.templates : []);
      } else {
        setTemplates([]);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to load templates. Please check your settings.",
        variant: "destructive",
      });
      setTemplates([]);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const isFormValid = () => {
    const hasInput = inputMode === 'file' ? selectedFile !== null : sheetUrl.trim() !== '';
    return hasInput && selectedTemplate !== '' && triggerUrl !== '';
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        sheetSource: inputMode === 'file' ? selectedFile?.name : sheetUrl,
        templateId: selectedTemplate
      };

      // Call the Edge Function directly via fetch
      const response = await fetch('/api/functions/v1/trigger-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`Campaign submission failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success!",
          description: "Campaign submitted successfully.",
          className: "bg-success text-success-foreground",
        });

        // Reset form
        setSelectedFile(null);
        setSheetUrl('');
        setSelectedTemplate('');
        setInputMode('file');
      } else {
        throw new Error('Campaign submission failed');
      }

    } catch (error) {
      console.error('Error submitting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to submit campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sheet Input Section */}
      <Card className="p-6 transition-all duration-200 hover:shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Data Source
        </h3>
        
        <Tabs value={inputMode} onValueChange={(value) => setInputMode(value as 'file' | 'url')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Sheet URL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="file">
            <FileUpload
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
            />
          </TabsContent>
          
          <TabsContent value="url">
            <UrlInput
              value={sheetUrl}
              onChange={setSheetUrl}
              placeholder="https://docs.google.com/spreadsheets/..."
            />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Template Selector */}
      <Card className="p-6 transition-all duration-200 hover:shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Template Selection
        </h3>
        
        <TemplateSelector
          templates={templates}
          selectedTemplate={selectedTemplate}
          onTemplateSelect={setSelectedTemplate}
          loading={isLoadingTemplates}
        />
      </Card>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!isFormValid() || isSubmitting}
        className={cn(
          "w-full h-12 text-base font-medium transition-all duration-200",
          "hover:scale-[1.02] active:scale-[0.98]",
          isFormValid() && !isSubmitting && "bg-primary hover:bg-primary/90"
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting Campaign...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Submit Campaign
          </>
        )}
      </Button>
    </div>
  );
}