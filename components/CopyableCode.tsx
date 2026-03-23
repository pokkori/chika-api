'use client';
import { useState } from 'react';

interface CopyableCodeProps {
  code: string;
  language?: string;
}

export function CopyableCode({ code, language = 'bash' }: CopyableCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="region"
      aria-label={`${language}コードブロック`}
      style={{ position: 'relative', backgroundColor: '#1E293B', borderRadius: 8, padding: '16px 20px' }}
    >
      <pre style={{ margin: 0, overflowX: 'auto', fontSize: 14, color: '#E2E8F0' }}>
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        aria-label={copied ? 'コードをコピーしました' : 'コードをクリップボードにコピー'}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: copied ? '#22C55E' : '#334155',
          color: '#F8FAFC',
          border: 'none',
          borderRadius: 4,
          padding: '6px 12px',
          fontSize: 14,
          cursor: 'pointer',
          minHeight: 44,
          minWidth: 44,
        }}
      >
        {copied ? 'コピー済み' : 'コピー'}
      </button>
    </div>
  );
}
