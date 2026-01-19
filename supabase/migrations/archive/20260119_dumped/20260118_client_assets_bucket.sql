-- Create bucket if not exists
insert into storage.buckets (id, name, public)
values ('client-assets', 'client-assets', true)
on conflict (id) do nothing;

-- Enable RLS
alter table storage.objects enable row level security;

-- Policy: Public Read (for Hunter AI / Email links)
drop policy if exists "Public Access client-assets" on storage.objects;
create policy "Public Access client-assets"
  on storage.objects for select
  using ( bucket_id = 'client-assets' );

-- Policy: Authenticated Upload (for Dashboard User)
drop policy if exists "Auth Upload client-assets" on storage.objects;
create policy "Auth Upload client-assets"
  on storage.objects for insert
  with check ( bucket_id = 'client-assets' and auth.role() = 'authenticated' );

-- Policy: Authenticated Update/Delete (optional, for overwriting)
drop policy if exists "Auth Manage client-assets" on storage.objects;
create policy "Auth Manage client-assets"
  on storage.objects for all
  using ( bucket_id = 'client-assets' and auth.role() = 'authenticated' );
