import { useEffect, useRef } from 'react';
import type { CareLog } from '../types';
import { getLogsStreamUrl } from '../lib/api';

interface UseLogsStreamOptions {
  userId: string;
  onNewLog: (log: CareLog) => void;
  enabled?: boolean;
}

export function useLogsStream({ userId, onNewLog, enabled = true }: UseLogsStreamOptions) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const onNewLogRef = useRef(onNewLog);

  useEffect(() => {
    onNewLogRef.current = onNewLog;
  }, [onNewLog]);

  useEffect(() => {
    if (!userId || !enabled) return;

    const url = getLogsStreamUrl(userId);
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // log_inserted イベントの場合、新しいログを追加
        if (data.type === 'log_inserted' && data.log) {
          const date = new Date(data.log.createdAt);
          const newLog: CareLog = {
            id: data.log.id,
            date: date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
            time: date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
            author: data.log.author,
            content: data.log.content,
          };
          onNewLogRef.current(newLog);
        }
      } catch {
        // JSON parse error - ignore
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    eventSourceRef.current = eventSource;

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [userId, enabled]);

  return {
    disconnect: () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    },
  };
}
