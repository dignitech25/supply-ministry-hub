-- =============================================================================
-- Search analytics -- APPLIED to production 2026-08-08
--
-- Nothing recorded what anyone searched for, so the catalogue gap could not be
-- sized and the sourcing-request feature had no evidence behind it. A search
-- that returns nothing is the most commercially useful event this site can
-- capture: it is a customer telling you what to stock.
--
-- Deliberately minimal on personal data. No IP address, no user agent, no
-- identity. session_id is a random per-tab UUID and is never joined to a person.
-- =============================================================================

create table if not exists public.search_events (
  id            uuid primary key default gen_random_uuid(),
  query         text not null,
  result_count  integer not null,
  source        text not null,
  session_id    uuid,
  created_at    timestamptz not null default now(),
  constraint search_events_query_len check (char_length(query) between 1 and 200),
  constraint search_events_source_valid check (source in ('catalogue','header','mobile')),
  constraint search_events_count_sane check (result_count >= 0)
);

comment on table public.search_events is
  'One row per executed search. No IP, user agent or identity is stored.';
comment on column public.search_events.session_id is
  'Random per-browser-session UUID. Groups a visitor''s refinement attempts; not linked to a person.';

create index if not exists idx_search_events_created on public.search_events (created_at desc);
create index if not exists idx_search_events_query   on public.search_events (lower(btrim(query)));
-- Zero-result searches are the ones worth reading, so they get their own index.
create index if not exists idx_search_events_zero
  on public.search_events (lower(btrim(query))) where result_count = 0;

alter table public.search_events enable row level security;

-- Anonymous visitors may record a search but must never read the log back: the
-- aggregate query stream is commercially sensitive. Writes go through the
-- SECURITY DEFINER function below, never through the table directly.
revoke all on public.search_events from anon, authenticated;

create or replace function public.log_search_event(
  p_query        text,
  p_result_count integer,
  p_source       text default 'catalogue',
  p_session_id   uuid default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_query text := btrim(coalesce(p_query, ''));
begin
  -- Fails soft on junk rather than surfacing an error into the UI. Telemetry
  -- must never break a search.
  if v_query = '' or char_length(v_query) > 200 then
    return;
  end if;

  if p_source not in ('catalogue','header','mobile') then
    return;
  end if;

  insert into public.search_events (query, result_count, source, session_id)
  values (v_query, greatest(coalesce(p_result_count, 0), 0), p_source, p_session_id);
end;
$$;

comment on function public.log_search_event is
  'Records a search. Fails soft on invalid input so telemetry can never break the search UI.';

revoke execute on function public.log_search_event(text, integer, text, uuid) from public;
grant  execute on function public.log_search_event(text, integer, text, uuid) to anon, authenticated;

-- What to stock next: phrases people searched for and got nothing.
create or replace view public.search_gaps as
  select lower(btrim(query))            as query,
         count(*)                       as times_searched,
         count(distinct session_id)     as distinct_sessions,
         max(created_at)                as last_searched
    from public.search_events
   where result_count = 0
   group by lower(btrim(query))
   order by count(*) desc, max(created_at) desc;

comment on view public.search_gaps is
  'Zero-result searches, most frequent first. Evidence base for catalogue expansion and the sourcing-request feature.';

-- Overall search health, for telling a broken search from a real catalogue gap.
create or replace view public.search_summary as
  select date_trunc('day', created_at)::date              as day,
         count(*)                                          as searches,
         count(*) filter (where result_count = 0)          as zero_result,
         round(100.0 * count(*) filter (where result_count = 0) / nullif(count(*),0), 1) as zero_result_pct,
         count(distinct session_id)                        as sessions
    from public.search_events
   group by 1
   order by 1 desc;

revoke all on public.search_gaps    from anon, authenticated;
revoke all on public.search_summary from anon, authenticated;

-- =============================================================================
-- ROLLBACK
--   drop view if exists public.search_summary;
--   drop view if exists public.search_gaps;
--   drop function if exists public.log_search_event(text, integer, text, uuid);
--   drop table if exists public.search_events;
-- =============================================================================
