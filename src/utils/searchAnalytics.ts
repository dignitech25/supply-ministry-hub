import { rpc } from '@/utils/catalogueApi';

/**
 * Search telemetry.
 *
 * A search that returns nothing is the most commercially useful event this site
 * can capture -- it is a customer telling you what to stock. Nothing recorded
 * that today, so the catalogue gap cannot be sized and the sourcing-request
 * feature has no evidence behind it.
 *
 * Deliberately minimal: the query, how many families matched, and where it was
 * typed. No name, no email, no IP, no user agent. The session id is a random
 * per-tab UUID used only to tell "one person refining a search five times" from
 * "five people who all want the same thing".
 */

const SESSION_KEY = 'sm-search-session';

function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const created = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    // Private browsing or blocked storage. Log without a session id rather than
    // losing the event.
    return null;
  }
}

export type SearchSource = 'catalogue' | 'header' | 'mobile';

/**
 * Fire-and-forget. Telemetry must never break a search, so every failure is
 * swallowed -- including the network being down.
 */
export function logSearchEvent(
  query: string,
  resultCount: number,
  source: SearchSource
): void {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length > 200) return;

  void rpc<null>('log_search_event', {
    p_query: trimmed,
    p_result_count: resultCount,
    p_source: source,
    p_session_id: getSessionId(),
  }).then(
    () => undefined,
    () => undefined
  );
}
