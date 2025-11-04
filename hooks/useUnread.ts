'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) return { count: 0 };
  return r.json();
});

export default function useUnread() {
  const { data } = useSWR('/api/unread-messages', fetcher, {
    refreshInterval: 30000,
  });
  return data?.count ?? 0;
}
