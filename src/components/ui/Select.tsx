import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectContentProps {
  className?: string;
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const SelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}>({
  value: '',
  onValueChange: () => {},
});

export const Select: React.FC<SelectProps> = ({ 
  value, 
  onValueChange, 
  disabled = false,
  children 
}) => {
  return (
    <SelectContext.Provider value={{ value, onValueChange, disabled }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ className, children }) => {
  return (
    <div className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}>
      {children}
    </div>
  );
};

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const { value } = React.useContext(SelectContext);
  return <span>{value || placeholder}</span>;
};

export const SelectContent: React.FC<SelectContentProps> = ({ className, children }) => {
  return (
    <div className={cn("hidden", className)}>
      {children}
    </div>
  );
};

export const SelectItem: React.FC<SelectItemProps> = ({ value, className, children }) => {
  return (
    <option value={value} className={className}>
      {children}
    </option>
  );
};

// Versão alternativa usando select nativo
export const NativeSelect: React.FC<{
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ value, onValueChange, disabled = false, className, children }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
    </select>
  );
};
