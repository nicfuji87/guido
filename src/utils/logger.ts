// AI dev note: Logger centralizado para substituir console.log
// Permite controlar logs em produção e desenvolvimento

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  data?: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 1000;

  private createLogEntry(level: LogLevel, message: string, context?: string, data?: unknown): LogEntry {
    return {
      level,
      message,
      timestamp: new Date(),
      context,
      data
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment && level === 'debug') {
      return false;
    }
    return true;
  }

  private addToHistory(entry: LogEntry): void {
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const context = entry.context ? `[${entry.context}]` : '';
    return `${timestamp} ${context} ${entry.message}`;
  }

  debug(message: string, context?: string, data?: unknown): void {
    const entry = this.createLogEntry('debug', message, context, data);
    this.addToHistory(entry);
    
    if (this.shouldLog('debug')) {
      // eslint-disable-next-line no-console
      console.debug(this.formatMessage(entry), data || '');
    }
  }

  info(message: string, context?: string, data?: unknown): void {
    const entry = this.createLogEntry('info', message, context, data);
    this.addToHistory(entry);
    
    if (this.shouldLog('info')) {
      // eslint-disable-next-line no-console
      console.info(this.formatMessage(entry), data || '');
    }
  }

  warn(message: string, context?: string, data?: unknown): void {
    const entry = this.createLogEntry('warn', message, context, data);
    this.addToHistory(entry);
    
    if (this.shouldLog('warn')) {
      // eslint-disable-next-line no-console
      console.warn(this.formatMessage(entry), data || '');
    }
  }

  error(message: string, context?: string, data?: unknown): void {
    const entry = this.createLogEntry('error', message, context, data);
    this.addToHistory(entry);
    
    if (this.shouldLog('error')) {
      // eslint-disable-next-line no-console
      console.error(this.formatMessage(entry), data || '');
    }
  }

  // Métodos para produção - sem logs no console
  silentInfo(message: string, context?: string, data?: unknown): void {
    const entry = this.createLogEntry('info', message, context, data);
    this.addToHistory(entry);
  }

  silentError(message: string, context?: string, data?: unknown): void {
    const entry = this.createLogEntry('error', message, context, data);
    this.addToHistory(entry);
  }

  // Utility methods
  getHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  clearHistory(): void {
    this.logHistory = [];
  }

  getRecentErrors(minutes: number = 5): LogEntry[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.logHistory.filter(
      entry => entry.level === 'error' && entry.timestamp >= cutoff
    );
  }
}

// Instância singleton
export const logger = new Logger();

// Exports convenientes
export const log = {
  debug: (message: string, context?: string, data?: unknown) => logger.debug(message, context, data),
  info: (message: string, context?: string, data?: unknown) => logger.info(message, context, data),
  warn: (message: string, context?: string, data?: unknown) => logger.warn(message, context, data),
  error: (message: string, context?: string, data?: unknown) => logger.error(message, context, data),
  silent: {
    info: (message: string, context?: string, data?: unknown) => logger.silentInfo(message, context, data),
    error: (message: string, context?: string, data?: unknown) => logger.silentError(message, context, data),
  }
};

export default logger;
