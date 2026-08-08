import { useEffect } from 'react';

/**
 * Minimal, dependency-free document-head manager.
 *
 * Replaces react-helmet-async, which was verified inert in this application on
 * 2026-08-08: the SEO component rendered six times per page load and Helmet
 * emitted nothing at all -- no title, no meta, no canonical, no JSON-LD, and no
 * `data-rh` nodes in the head. A minimal `<Helmet><title>…</title></Helmet>`
 * was equally silent, so the cause was the Helmet/provider wiring rather than
 * the tags being passed in.
 *
 * The consequence in production was that every route -- all 513 product pages
 * and every category view -- served the homepage's title, description, og:url
 * and canonical, and none of the Product, Breadcrumb or FAQ structured data
 * ever reached a crawler.
 *
 * This implementation owns only the nodes it creates (tagged with
 * `data-sm-head`) and rebuilds them whenever the descriptor changes, so it
 * cannot silently no-op: if the hook runs, the tags are in the DOM.
 */

export interface HeadMeta {
  name?: string;
  property?: string;
  content: string;
}

export interface HeadLink {
  rel: string;
  href: string;
  hreflang?: string;
}

export interface DocumentHead {
  title?: string;
  meta?: HeadMeta[];
  links?: HeadLink[];
  jsonLd?: object[];
}

const OWNED_ATTRIBUTE = 'data-sm-head';

function clearOwnedTags() {
  document.head
    .querySelectorAll(`[${OWNED_ATTRIBUTE}]`)
    .forEach((node) => node.remove());
}

/**
 * Removes any tag the app does not own but which would conflict with the tag we
 * are about to set. Without this, a stale hard-coded tag in index.html would sit
 * alongside ours and crawlers would see two competing values.
 */
function removeConflicting(selector: string) {
  document.head.querySelectorAll(selector).forEach((node) => {
    if (!node.hasAttribute(OWNED_ATTRIBUTE)) node.remove();
  });
}

export function useDocumentHead(head: DocumentHead) {
  // Serialising the descriptor keeps the effect from re-running on every render
  // purely because the caller rebuilt the object literal.
  const key = JSON.stringify(head);

  useEffect(() => {
    const descriptor: DocumentHead = JSON.parse(key);

    if (descriptor.title) {
      document.title = descriptor.title;
    }

    clearOwnedTags();

    (descriptor.meta ?? []).forEach(({ name, property, content }) => {
      if (!content) return;
      const selector = name
        ? `meta[name="${CSS.escape(name)}"]`
        : property
          ? `meta[property="${CSS.escape(property)}"]`
          : null;
      if (!selector) return;

      removeConflicting(selector);

      const tag = document.createElement('meta');
      if (name) tag.setAttribute('name', name);
      if (property) tag.setAttribute('property', property);
      tag.setAttribute('content', content);
      tag.setAttribute(OWNED_ATTRIBUTE, '');
      document.head.appendChild(tag);
    });

    (descriptor.links ?? []).forEach(({ rel, href, hreflang }) => {
      if (!href) return;

      // Canonical is the one tag where a duplicate is actively harmful, so any
      // foreign canonical is cleared before ours is written.
      if (rel === 'canonical') removeConflicting('link[rel="canonical"]');

      const tag = document.createElement('link');
      tag.setAttribute('rel', rel);
      tag.setAttribute('href', href);
      if (hreflang) tag.setAttribute('hreflang', hreflang);
      tag.setAttribute(OWNED_ATTRIBUTE, '');
      document.head.appendChild(tag);
    });

    (descriptor.jsonLd ?? []).forEach((schema) => {
      const tag = document.createElement('script');
      tag.setAttribute('type', 'application/ld+json');
      tag.setAttribute(OWNED_ATTRIBUTE, '');
      tag.textContent = JSON.stringify(schema);
      document.head.appendChild(tag);
    });

    return clearOwnedTags;
  }, [key]);
}
