import { useEffect, useRef, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLogs, getLogsStreamUrl } from '@/lib/api';
import type { CareLog } from '@/lib/types';

interface UseLogsOptions {
  userId: string;
  enabled?: boolean;
}

// SSE EventSource implementation for React Native
// React Native doesn't have native EventSource, so we implement a simple version
class SimpleEventSource {
  private url: string;
  private controller: AbortController | null = null;
  public onmessage: ((event: { data: string }) => void) | null = null;
  public onerror: (() => void) | null = null;
  private isConnected = false;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  private async connect() {
    this.controller = new AbortController();
    this.isConnected = true;

    try {
      const response = await fetch(this.url, {
        signal: this.controller.signal,
        headers: {
          Accept: 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (this.isConnected) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (this.onmessage) {
              this.onmessage({ data });
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError' && this.onerror) {
        this.onerror();
      }
    }
  }

  close() {
    this.isConnected = false;
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }
}

export function useLogs({ userId, enabled = true }: UseLogsOptions) {
  const queryClient = useQueryClient();
  const [streamedLogs, setStreamedLogs] = useState<CareLog[]>([]);
  const eventSourceRef = useRef<SimpleEventSource | null>(null);
  const [streamKey, setStreamKey] = useState(0);

  // Fetch initial logs
  const {
    data,
    isLoading: loading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['logs', userId],
    queryFn: () => fetchLogs(userId),
    enabled: !!userId && enabled,
  });

  // Set up SSE stream
  const setupStream = useCallback(() => {
    if (!userId || !enabled) return;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    const url = getLogsStreamUrl(userId);
    const eventSource = new SimpleEventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const eventData = JSON.parse(event.data);

        if (eventData.type === 'log_inserted' && eventData.log) {
          const date = new Date(eventData.log.createdAt);
          const newLog: CareLog = {
            id: eventData.log.id,
            date: date.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            time: date.toLocaleTimeString('ja-JP', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            author: eventData.log.author,
            content: eventData.log.content,
          };

          // Add new log to the beginning
          setStreamedLogs((prev) => {
            // Avoid duplicates
            if (prev.some((log) => log.id === newLog.id)) {
              return prev;
            }
            return [newLog, ...prev];
          });
        }
      } catch {
        // Ignore JSON parse errors
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      eventSourceRef.current = null;
    };

    eventSourceRef.current = eventSource;
  }, [userId, enabled]);

  // Initialize stream on mount and when userId changes
  useEffect(() => {
    setupStream();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [setupStream, streamKey]);

  // Combine fetched logs with streamed logs
  const logs = [...streamedLogs, ...(data?.logs || [])].reduce<CareLog[]>(
    (acc, log) => {
      // Remove duplicates based on id
      if (!acc.some((l) => l.id === log.id)) {
        acc.push(log);
      }
      return acc;
    },
    []
  );

  // Refresh function that re-fetches and re-establishes stream
  const refresh = useCallback(async () => {
    // Clear streamed logs
    setStreamedLogs([]);

    // Close existing stream
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // Refetch data
    await refetch();

    // Re-establish stream by changing stream key
    setStreamKey((prev) => prev + 1);
  }, [refetch]);

  // Disconnect stream
  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  return {
    logs,
    user: data?.user || null,
    loading,
    error: error instanceof Error ? error.message : null,
    refresh,
    isRefreshing: isRefetching,
    disconnect,
  };
}
