import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Info, Bot, User } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useT } from '@/lib/i18n';
import { findResponse } from '@/data/assistantTranscripts';
import { cn } from '@/lib/cn';

interface Message {
  id: number;
  from: 'user' | 'bot';
  text: string;
}

export function AssistantPage() {
  const { t, lang } = useT();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const idRef = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function ask(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: idRef.current++, from: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    // Simulate brief thinking delay
    setTimeout(() => {
      const hit = findResponse(text);
      const reply = hit ? hit.answer[lang] : t('assistant.fallback');
      setMessages((m) => [...m, { id: idRef.current++, from: 'bot', text: reply }]);
    }, 350);
  }

  const samples = [
    t('assistant.sample1'),
    t('assistant.sample2'),
    t('assistant.sample3'),
    t('assistant.sample4'),
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t('assistant.title')} subtitle={t('assistant.subtitle')} />

      <Card className="overflow-hidden">
        <div className="flex items-start gap-2 border-b border-ink-200/60 bg-integrata-50 px-5 py-3 text-xs text-integrata-900">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <div>
            <span className="font-semibold">{t('assistant.disclaimerLabel')}: </span>
            <span>{t('assistant.disclaimer')}</span>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="flex h-[480px] flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-integrata-900 text-surface-0">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-display text-lg font-semibold text-ink-900">
                      {t('assistant.title')}
                    </div>
                    <div className="mt-1 text-sm text-ink-500">{t('assistant.subtitle')}</div>
                  </div>
                  <div className="mt-2 w-full max-w-md">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                      {t('assistant.suggested')}
                    </div>
                    <div className="grid gap-2">
                      {samples.map((s) => (
                        <button
                          key={s}
                          onClick={() => ask(s)}
                          className="rounded-md border border-ink-200 bg-surface-0 px-3 py-2 text-left text-sm text-ink-800 transition-colors hover:border-integrata-300 hover:bg-integrata-50"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'flex items-start gap-3',
                    m.from === 'user' && 'flex-row-reverse',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                      m.from === 'user'
                        ? 'bg-integrata-100 text-integrata-900'
                        : 'bg-integrata-900 text-surface-0',
                    )}
                  >
                    {m.from === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed',
                      m.from === 'user'
                        ? 'bg-integrata-900 text-surface-0'
                        : 'bg-surface-50 text-ink-900 ring-1 ring-ink-200/60',
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 border-t border-ink-200/60 bg-surface-0 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('assistant.placeholder')}
                className="flex-1 rounded-md border border-ink-200 bg-surface-50 px-3 py-2 text-sm placeholder:text-ink-400 focus:border-integrata-500 focus:bg-surface-0 focus:outline-none focus:ring-2 focus:ring-integrata-500/30"
              />
              <Button type="submit" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
                {t('common.send')}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
