type QueryValue = string | number | boolean | null | undefined

export const API_BASE =
  import.meta.env?.VITE_BACKEND_BASE ||
  import.meta.env?.VITE_API_BASE ||
  (typeof window !== 'undefined' ? window.location.origin : '')

export const LRC_BASE = import.meta.env?.VITE_LRC_BASE || API_BASE

export const LRC_PREFIX = (LRC_BASE || '').includes('lrclib.net') ? '/api' : '/api/lrc'

export const API_PATHS = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    updateUsername: '/api/auth/update-username',
    changePassword: '/api/auth/change-password',
  },
  me: '/api/me',
  youtube: {
    search: '/api/youtube/search',
  },
  lrc: {
    search: '/search',
    byId: (id: number | string) => `/get/${id}`,
    bySignature: '/get',
    bySignatureCached: '/get-cached',
  },
} as const

export function toApiUrl(path: string): URL {
  return new URL(path, API_BASE)
}

export function toLrcUrl(path: string): URL {
  return new URL(`${LRC_PREFIX}${path}`, LRC_BASE)
}

export function setQueryParams(url: URL, params: Record<string, QueryValue>): URL {
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value).length > 0) {
      url.searchParams.set(key, String(value))
    }
  }
  return url
}

export function getLrcHeaders(): HeadersInit {
  const appName = import.meta.env.VITE_APP_NAME || 'TypeChorus'
  const appVersion = import.meta.env.VITE_APP_VERSION || 'dev'

  // LRCLIB allows 'lrclib-client' or 'x-user-agent'.
  return (LRC_BASE || '').includes('lrclib.net')
    ? { 'lrclib-client': `${appName} v${appVersion}` }
    : { 'X-Client-Info': `${appName} v${appVersion}` }
}

async function getErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string; message?: string }
    return body.error || body.message || `${fallback} (${res.status})`
  } catch {
    return `${fallback} (${res.status})`
  }
}

export async function requestJson<T>(
  input: string | URL,
  init?: RequestInit,
  fallbackError = 'Request failed'
): Promise<T> {
  const target = typeof input === 'string' ? input : input.toString()
  const res = await fetch(target, init)

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, fallbackError))
  }

  return (await res.json()) as T
}
