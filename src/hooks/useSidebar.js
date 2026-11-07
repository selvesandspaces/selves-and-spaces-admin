'use client';

import { useState } from 'react';

export const SIDEBAR_COOKIE = 'ss-sidebar-collapsed';

// `initialCollapsed` comes from the cookie read on the server, so the first paint is already right.
export function useSidebar(initialCollapsed = false) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      document.cookie = `${SIDEBAR_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      return next;
    });
  };

  return { collapsed, toggle };
}
