-- Audit trail for outbound emails sent from dashboard inbox.
create table if not exists public.email_outbox (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    sent_at timestamptz,
    user_id uuid not null,
    recipient text not null,
    subject text not null,
    status text not null default 'pending',
    provider_message_id text,
    error_message text,
    payload jsonb not null default '{}'::jsonb
);

create index if not exists email_outbox_created_at_idx on public.email_outbox (created_at desc);
create index if not exists email_outbox_user_id_idx on public.email_outbox (user_id);
create index if not exists email_outbox_status_idx on public.email_outbox (status);

alter table public.email_outbox enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'email_outbox'
      and policyname = 'email_outbox_select_own'
  ) then
    create policy email_outbox_select_own
      on public.email_outbox
      for select
      using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'email_outbox'
      and policyname = 'email_outbox_insert_own'
  ) then
    create policy email_outbox_insert_own
      on public.email_outbox
      for insert
      with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'email_outbox'
      and policyname = 'email_outbox_update_own'
  ) then
    create policy email_outbox_update_own
      on public.email_outbox
      for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;
