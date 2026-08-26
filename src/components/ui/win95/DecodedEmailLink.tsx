'use client';

import { useEffect, useRef, type AnchorHTMLAttributes } from 'react';
import { decodeEmailHref } from '@/lib/email';

interface DecodedEmailLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  displayEmail: string;
}

export function DecodedEmailLink({ displayEmail, children, ...props }: DecodedEmailLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    linkRef.current?.setAttribute('href', decodeEmailHref(displayEmail));
  }, [displayEmail]);

  return <a ref={linkRef} href="#email" {...props}>{children}</a>;
}
