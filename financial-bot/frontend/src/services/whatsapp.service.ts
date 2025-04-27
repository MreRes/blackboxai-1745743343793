import api, { handleApiError, formatUrl } from './api';

export interface WhatsAppSession {
  id: string;
  phoneNumber: string;
  status: 'active' | 'inactive' | 'expired';
  lastActive: string;
  deviceInfo: {
    platform: string;
    browser: string;
    version: string;
  };
  settings: {
    autoReply: {
      enabled: boolean;
      message: string;
    };
    notifications: {
      budgetAlerts: boolean;
      dailySummary: boolean;
      weeklyReport: boolean;
    };
    language: 'id' | 'en';
    timezone: string;
  };
  nlpSettings: {
    enabled: boolean;
    confidence: number;
    customPhrases: Array<{
      phrase: string;
      intent: string;
      examples: string[];
    }>;
  };
  qrCode?: string;
}

export interface MessageQueue {
  content: string;
  type: string;
  priority: number;
  scheduledFor: string;
  status: 'pending' | 'sent' | 'failed';
}

export interface ErrorLog {
  timestamp: string;
  error: string;
  context: Record<string, any>;
}

export const whatsappService = {
  async initializeSession(phoneNumber: string) {
    try {
      const response = await api.post<WhatsAppSession>('/whatsapp/init', {
        phoneNumber,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getQRCode(sessionId: string) {
    try {
      const response = await api.get<{ qrCode: string }>(
        formatUrl('/whatsapp/qr/:sessionId', { sessionId })
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getSessionStatus(sessionId: string) {
    try {
      const response = await api.get<{
        status: WhatsAppSession['status'];
        lastActive: string;
      }>(formatUrl('/whatsapp/status/:sessionId', { sessionId }));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateSettings(
    sessionId: string,
    settings: Partial<WhatsAppSession['settings']>
  ) {
    try {
      const response = await api.put<WhatsAppSession>(
        formatUrl('/whatsapp/settings/:sessionId', { sessionId }),
        { settings }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async disconnectSession(sessionId: string) {
    try {
      await api.post(formatUrl('/whatsapp/disconnect/:sessionId', { sessionId }));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getSessions() {
    try {
      const response = await api.get<WhatsAppSession[]>('/whatsapp/sessions');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteSession(sessionId: string) {
    try {
      await api.delete(formatUrl('/whatsapp/sessions/:sessionId', { sessionId }));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async addCustomPhrases(
    sessionId: string,
    phrases: WhatsAppSession['nlpSettings']['customPhrases']
  ) {
    try {
      const response = await api.post<WhatsAppSession['nlpSettings']>(
        formatUrl('/whatsapp/nlp/:sessionId', { sessionId }),
        { phrases }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getErrorLogs(
    sessionId: string,
    page: number = 1,
    limit: number = 50
  ) {
    try {
      const response = await api.get<{
        data: ErrorLog[];
        total: number;
      }>(formatUrl('/whatsapp/logs/:sessionId', { sessionId }), {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async sendMessage(sessionId: string, content: string, options?: {
    scheduledFor?: Date;
    priority?: number;
  }) {
    try {
      const response = await api.post<MessageQueue>(
        formatUrl('/whatsapp/messages/:sessionId', { sessionId }),
        {
          content,
          ...options,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// React Query keys for WhatsApp-related queries
export const whatsappKeys = {
  all: ['whatsapp'] as const,
  sessions: () => [...whatsappKeys.all, 'sessions'] as const,
  session: (id: string) => [...whatsappKeys.sessions(), id] as const,
  qrCode: (id: string) => [...whatsappKeys.session(id), 'qr'] as const,
  status: (id: string) => [...whatsappKeys.session(id), 'status'] as const,
  logs: (id: string) => [...whatsappKeys.session(id), 'logs'] as const,
};

// Usage example with React Query:
/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { whatsappService, whatsappKeys } from './whatsapp.service';

// Get all sessions
const { data: sessions } = useQuery({
  queryKey: whatsappKeys.sessions(),
  queryFn: whatsappService.getSessions,
});

// Initialize session mutation
const queryClient = useQueryClient();
const { mutate: initSession } = useMutation({
  mutationFn: whatsappService.initializeSession,
  onSuccess: () => {
    queryClient.invalidateQueries(whatsappKeys.sessions());
  },
});

// Get QR code for session
const { data: qrCode } = useQuery({
  queryKey: whatsappKeys.qrCode('session-id'),
  queryFn: () => whatsappService.getQRCode('session-id'),
});

// Get session status
const { data: status } = useQuery({
  queryKey: whatsappKeys.status('session-id'),
  queryFn: () => whatsappService.getSessionStatus('session-id'),
  refetchInterval: (data) => 
    data?.status === 'active' ? false : 5000, // Poll every 5s until active
});

// Update settings mutation
const { mutate: updateSettings } = useMutation({
  mutationFn: ({ sessionId, settings }: {
    sessionId: string;
    settings: Partial<WhatsAppSession['settings']>;
  }) => whatsappService.updateSettings(sessionId, settings),
  onSuccess: (_, { sessionId }) => {
    queryClient.invalidateQueries(whatsappKeys.session(sessionId));
  },
});

// Disconnect session mutation
const { mutate: disconnect } = useMutation({
  mutationFn: whatsappService.disconnectSession,
  onSuccess: (_, sessionId) => {
    queryClient.invalidateQueries(whatsappKeys.session(sessionId));
  },
});

// Delete session mutation
const { mutate: deleteSession } = useMutation({
  mutationFn: whatsappService.deleteSession,
  onSuccess: () => {
    queryClient.invalidateQueries(whatsappKeys.sessions());
  },
});
*/
