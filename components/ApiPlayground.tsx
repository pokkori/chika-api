'use client';
import { useState, useEffect, useRef } from 'react';
import { CopyableCode } from '@/components/CopyableCode';

const ENDPOINTS = [
  {
    label: '競売物件一覧 GET /api/v1/auctions',
    value: '/api/v1/auctions',
    params: [
      { name: 'prefecture', label: '都道府県コード', placeholder: '13（東京都）', required: false },
      { name: 'category', label: '物件種別', placeholder: 'apartment / land / building / farm', required: false },
      { name: 'min_price', label: '最低売却基準額（円）', placeholder: '5000000', required: false },
      { name: 'max_price', label: '最高売却基準額（円）', placeholder: '50000000', required: false },
      { name: 'status', label: 'ステータス', placeholder: 'open / sold / cancelled', required: false },
      { name: 'limit', label: '取得件数（最大100）', placeholder: '20', required: false },
      { name: 'offset', label: 'ページング開始位置', placeholder: '0', required: false },
    ],
  },
  {
    label: '統計情報 GET /api/v1/auctions/stats（認証不要）',
    value: '/api/v1/auctions/stats',
    params: [],
  },
  {
    label: '競売物件詳細 GET /api/v1/auctions/{id}',
    value: '/api/v1/auctions/[id]',
    params: [
      { name: 'id', label: '物件ID', placeholder: 'court_13_R6_ke_1234', required: true },
    ],
  },
];

export function ApiPlayground() {
  const [apiKey, setApiKey] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/v1/auctions');
  const [params, setParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<string>('');
  const [displayedResponse, setDisplayedResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const streamTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!response) { setDisplayedResponse(''); return; }
    setDisplayedResponse('');
    let index = 0;
    const step = () => {
      index += Math.ceil(response.length / 60);
      setDisplayedResponse(response.slice(0, index));
      if (index < response.length) {
        streamTimerRef.current = setTimeout(step, 16);
      } else {
        setDisplayedResponse(response);
      }
    };
    streamTimerRef.current = setTimeout(step, 16);
    return () => { if (streamTimerRef.current) clearTimeout(streamTimerRef.current); };
  }, [response]);

  const endpoint = ENDPOINTS.find((e) => e.value === selectedEndpoint) ?? ENDPOINTS[0];

  const buildUrl = () => {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://auction-property-api.vercel.app';
    // 詳細エンドポイントはidをパスに埋め込む
    if (selectedEndpoint === '/api/v1/auctions/[id]') {
      const id = params['id'] || 'court_13_R6_ke_1234';
      return `${base}/api/v1/auctions/${encodeURIComponent(id)}`;
    }
    const url = new URL(`${base}${selectedEndpoint}`);
    Object.entries(params).forEach(([k, v]) => {
      if (v && k !== 'id') url.searchParams.set(k, v);
    });
    return url.toString();
  };

  const curlCommand =
    selectedEndpoint === '/api/v1/auctions/stats'
      ? `curl "${buildUrl()}"`
      : `curl -H "X-API-Key: ${apiKey || 'YOUR_API_KEY'}" \\\n  "${buildUrl()}"`;

  const triggerSuccessBanner = () => {
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    setShowSuccessBanner(true);
    // CSSトランジション用: 次フレームでvisibleにする
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setBannerVisible(true));
    });
    bannerTimerRef.current = setTimeout(() => {
      setBannerVisible(false);
      bannerTimerRef.current = setTimeout(() => setShowSuccessBanner(false), 400);
    }, 3000);
  };

  const handleExecute = async () => {
    setLoading(true);
    setResponse('');
    setStatusCode(null);
    try {
      const headers: Record<string, string> = {};
      if (selectedEndpoint !== '/api/v1/auctions/stats') {
        headers['X-API-Key'] = apiKey;
      }
      const res = await fetch(buildUrl(), { headers });
      setStatusCode(res.status);
      const json = await res.json();
      setResponse(JSON.stringify(json, null, 2));
      // 初回成功時のGameFeel演出
      if (res.status < 400 && !hasSucceeded) {
        setHasSucceeded(true);
        triggerSuccessBanner();
      }
    } catch (err) {
      setResponse(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg rounded-2xl"
      style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <div>
        <label htmlFor="playground-endpoint" style={{ fontSize: 14, color: '#94A3B8', display: 'block', marginBottom: 4 }}>
          エンドポイント
        </label>
        <select
          id="playground-endpoint"
          aria-label="APIエンドポイントを選択"
          value={selectedEndpoint}
          onChange={(e) => { setSelectedEndpoint(e.target.value); setParams({}); }}
          style={{
            width: '100%',
            backgroundColor: '#0F172A',
            color: '#F8FAFC',
            border: '1px solid #334155',
            borderRadius: 6,
            padding: '10px 12px',
            fontSize: 14,
            minHeight: 44,
          }}
        >
          {ENDPOINTS.map((ep) => (
            <option key={ep.value} value={ep.value}>{ep.label}</option>
          ))}
        </select>
      </div>

      {selectedEndpoint !== '/api/v1/auctions/stats' && (
        <div>
          <label htmlFor="playground-apikey" style={{ fontSize: 14, color: '#94A3B8', display: 'block', marginBottom: 4 }}>
            APIキー
          </label>
          <input
            id="playground-apikey"
            type="text"
            aria-label="X-API-Keyヘッダーに使用するAPIキーを入力"
            placeholder="auction_xxxxxxxx"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#0F172A',
              color: '#F8FAFC',
              border: '1px solid #334155',
              borderRadius: 6,
              padding: '10px 12px',
              fontSize: 14,
              minHeight: 44,
            }}
          />
        </div>
      )}

      {endpoint.params.map((param) => (
        <div key={param.name}>
          <label
            htmlFor={`playground-param-${param.name}`}
            style={{ fontSize: 14, color: '#94A3B8', display: 'block', marginBottom: 4 }}
          >
            {param.label}{param.required && <span style={{ color: '#EF4444', marginLeft: 4 }}>必須</span>}
          </label>
          <input
            id={`playground-param-${param.name}`}
            type="text"
            aria-label={`${param.label}パラメータを入力`}
            placeholder={param.placeholder}
            value={params[param.name] ?? ''}
            onChange={(e) => setParams((prev) => ({ ...prev, [param.name]: e.target.value }))}
            style={{
              width: '100%',
              backgroundColor: '#0F172A',
              color: '#F8FAFC',
              border: '1px solid #334155',
              borderRadius: 6,
              padding: '10px 12px',
              fontSize: 14,
              minHeight: 44,
            }}
          />
        </div>
      ))}

      <div>
        <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>curlコマンド（コピーして使用可）</p>
        <CopyableCode code={curlCommand} language="bash" />
      </div>

      {/* 初回APIコール成功バナー */}
      {showSuccessBanner && (
        <div
          role="status"
          aria-live="polite"
          aria-label="初回APIコール成功"
          style={{
            backgroundColor: '#052E16',
            border: '1px solid #16A34A',
            borderRadius: 8,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            opacity: bannerVisible ? 1 : 0,
            transform: bannerVisible ? 'translateY(0)' : 'translateY(-8px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" stroke="#22C55E" strokeWidth="1.5" />
            <path d="M6 10L9 13L14 7" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#22C55E' }}>
            初回APIコール成功！
          </span>
          <span style={{ fontSize: 13, color: '#86EFAC' }}>
            レスポンスを確認してみましょう。
          </span>
        </div>
      )}

      <button
        onClick={handleExecute}
        disabled={loading}
        aria-label="APIリクエストを実行する"
        style={{
          backgroundColor: loading ? '#334155' : '#F59E0B',
          color: loading ? '#F8FAFC' : '#0F172A',
          border: 'none',
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: 16,
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          minHeight: 44,
        }}
      >
        {loading ? '実行中...' : 'リクエスト実行'}
      </button>

      {(response || statusCode !== null) && (
        <div>
          {statusCode !== null && (
            <p style={{ fontSize: 14, color: statusCode < 400 ? '#22C55E' : '#EF4444', marginBottom: 8 }}>
              ステータス: {statusCode}
              {statusCode < 400 && (
                <span style={{ marginLeft: 8, fontSize: 12, color: '#94A3B8' }}>
                  {new Date().toLocaleTimeString('ja-JP')}
                </span>
              )}
            </p>
          )}
          <pre
            aria-label="APIレスポンス"
            style={{ backgroundColor: '#0F172A', padding: 16, borderRadius: 8, fontSize: 13, color: '#E2E8F0', overflowX: 'auto', maxHeight: 400, overflowY: 'auto', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
          >
            {displayedResponse}
            {displayedResponse.length < response.length && (
              <span style={{ display: 'inline-block', width: 8, height: 14, backgroundColor: '#F59E0B', marginLeft: 2, verticalAlign: 'text-bottom', animation: 'blink 1s step-end infinite' }} aria-hidden="true" />
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
