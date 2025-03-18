-- Create avatars bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Allow users to upload their own avatar
create policy "Users can upload their own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own avatar
create policy "Users can update their own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatar
create policy "Users can delete their own avatar"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public access to avatars
create policy "Public access to avatars"
on storage.objects for select
to public
using (bucket_id = 'avatars');