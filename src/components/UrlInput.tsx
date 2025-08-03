import React, { useState } from 'react';
import { Link, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function UrlInput({ value, onChange, placeholder = "https://...", className }: UrlInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsValid(validateUrl(newValue));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label 
        htmlFor="sheet-url" 
        className={cn(
          "text-sm font-medium transition-colors duration-200",
          isFocused ? "text-secondary" : "text-foreground"
        )}
      >
        Sheet URL
      </Label>
      <div className="relative">
        <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="sheet-url"
          type="url"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-10 transition-all duration-200",
            isFocused && "border-secondary ring-2 ring-secondary/20",
            isValid && value && "border-success",
            value && !isValid && "border-destructive"
          )}
        />
        {value && isValid && (
          <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-success animate-fade-in" />
        )}
      </div>
      {value && !isValid && (
        <p className="text-xs text-destructive animate-fade-in">
          Please enter a valid HTTPS URL
        </p>
      )}
    </div>
  );
}