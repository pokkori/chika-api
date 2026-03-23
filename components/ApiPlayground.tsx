'use client';
import { useState } from 'react';

interface ApiPlaygroundProps {
  defaultEndpoint?: string;
}

const ENDPOINTS = [
  {
    label: '地価検索 GET /api/v1/land-price',
    value: '/api/v1/land-price',
    params: [
      { name: 'prefecture', label: '都道府県コード', placeholder: '13（東京）', required: true },
      { name: 'city', label: '市区町村コード', placeholder: '13101（千代田区）', required: false },
      { name: 'year', label: '年', placeholder: '2024', required: false },
      { name: 'use_category', label: '用途区分', placeholder: '住宅地', required: false },
      { name: 'limit', label: '件数上限', placeholder: '100', required: false },
    ],
  },
  {
    label: '周辺地価推移 GET /api/v1/land-price/trend',
    value: '/api/v1/land-price/trend',
    params: [
      { name: 'lat', label: '緯度', placeholder: '35.6762', required: true },
      { name: 'lon', label: '経度', placeholder: '139.6503', required: true },
      { name: 'radius', label: '半径（m）', placeholder: '1000', required: false },
      { name: 'years', label: '取得年数', placeholder: '5', required: false },
    ],
  },
  {
    label: '路線価 GET /api/v1/route-price',
    value: '/api/v1/route-price',
    params: [
      { name: 'prefecture', label: '都道府県コード', placeholder: '13', required: true },
      { name: 'line', label: '路線名', placeholder: '山手線', required: true },
    ],
  },
];

export function ApiPlayground({ defaultEndpoint = '/api/v1/land-price' }: ApiPlaygroundProps) {
  const [apiKey, setApiKey] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState(defaultEndpoint);
  const [params, setParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const endpoint = ENDPOINTS.find((e) => e.value === selectedEndpoint) ?? ENDPOINTS[0];

  const buildUrl = () => {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://chika-api.vercel.app';
    const url = new URL(`${base}${selectedEndpoint}`);
    Object.entries(params).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
    return url.toString();
  };

  const curlCommand = `curl -H "X-API-Key: ${apiKey || 'YOUR_API_KEY'}" \\
  "${buildUrl()}"`;

  const handleExecute = async () => {
    setLoading(true);
    setResponse('');
    setStatusCode(null);
    try {
      const res = await fetch(buildUrl(), {
        headers: { 'X-API-Key': apiKey },
      });
      setStatusCode(res.status);
      const json = await res.json();
      setResponse(JSON.stringify(json, null, 2));
    } catch (err) {
      setResponse(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#1E293B', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>API Playground</h2>

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

      <div>
        <label htmlFor="playground-apikey" style={{ fontSize: 14, color: '#94A3B8', display: 'block', marginBottom: 4 }}>
          APIキー
        </label>
        <input
          id="playground-apikey"
          type="text"
          aria-label="X-API-Keyヘッダーに使用するAPIキーを入力"
          placeholder="chika_xxxxxxxx"
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
        <pre style={{ backgroundColor: '#0F172A', padding: 12, borderRadius: 6, fontSize: 13, color: '#E2E8F0', overflowX: 'auto', margin: 0 }}>
          {curlCommand}
        </pre>
      </div>

      <button
        onClick={handleExecute}
        disabled={loading}
        aria-label="APIリクエストを実行"
        style={{
          backgroundColor: loading ? '#334155' : '#3B82F6',
          color: '#F8FAFC',
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
            </p>
          )}
          <pre
            aria-label="APIレスポンス"
            style={{ backgroundColor: '#0F172A', padding: 16, borderRadius: 8, fontSize: 13, color: '#E2E8F0', overflowX: 'auto', maxHeight: 400, overflowY: 'auto', margin: 0 }}
          >
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}
