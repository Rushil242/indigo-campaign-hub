import React from 'react';
import { ChevronDown, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Template {
  templateId: string;
  name: string;
  status: 'approved' | 'pending' | 'rejected';
  components?: any[];
}

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  loading?: boolean;
  className?: string;
}

const statusConfig = {
  approved: {
    icon: CheckCircle,
    variant: 'default' as const,
    className: 'bg-success text-success-foreground'
  },
  pending: {
    icon: Clock,
    variant: 'secondary' as const,
    className: 'bg-warning text-warning-foreground'
  },
  rejected: {
    icon: XCircle,
    variant: 'destructive' as const,
    className: 'bg-destructive text-destructive-foreground'
  }
};

export function TemplateSelector({ 
  templates, 
  selectedTemplate, 
  onTemplateSelect, 
  loading = false,
  className 
}: TemplateSelectorProps) {
  const approvedTemplates = templates.filter(t => t.status === 'approved');
  
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-foreground">
        Select Approved Template
      </label>
      <Select value={selectedTemplate} onValueChange={onTemplateSelect} disabled={loading}>
        <SelectTrigger className="w-full transition-all duration-200 hover:border-secondary focus:border-secondary">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Choose a template..." />
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectTrigger>
        <SelectContent className="bg-card border border-border shadow-md">
          {loading ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              Loading templates...
            </div>
          ) : approvedTemplates.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              No approved templates found
            </div>
          ) : (
            approvedTemplates.map((template) => {
              const statusInfo = statusConfig[template.status];
              const StatusIcon = statusInfo.icon;
              
              return (
                <SelectItem
                  key={template.templateId}
                  value={template.templateId}
                  className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors duration-200"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{template.name}</span>
                    <Badge 
                      variant={statusInfo.variant}
                      className={cn("ml-2 text-xs", statusInfo.className)}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {template.status}
                    </Badge>
                  </div>
                </SelectItem>
              );
            })
          )}
        </SelectContent>
      </Select>
      
      {approvedTemplates.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {approvedTemplates.length} approved template{approvedTemplates.length !== 1 ? 's' : ''} available
        </p>
      )}
    </div>
  );
}