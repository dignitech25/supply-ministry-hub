import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, X } from 'lucide-react';
import { searchProductFamilies, toPrice, type ProductFamilyRow } from '@/utils/catalogueApi';
import { logSearchEvent, type SearchSource } from '@/utils/searchAnalytics';
import { formatPrice, getImagePlaceholder } from '@/utils/productHelpers';
import { extractBaseName } from '@/utils/variantHelpers';

const DEBOUNCE_MS = 250;
const MIN_QUERY = 2;
const MAX_SUGGESTIONS = 7;

interface ProductSearchProps {
  source: SearchSource;
  /** Rendered inside a dialog on mobile, where it should take the full width. */
  variant?: 'inline' | 'dialog';
  autoFocus?: boolean;
  placeholder?: string;
  onNavigate?: () => void;
}

/**
 * Predictive product search over families, not variants.
 *
 * The previous implementation queried raw variant rows, so searching "bed"
 * returned eight rows that could all be the same product in different sizes.
 * This searches families and shows the variant count, and when the query
 * matches a specific SKU it navigates to THAT variant rather than the family
 * default -- which is the whole point of an OT typing a SKU they were given.
 */
export function ProductSearch({
  source,
  variant = 'inline',
  autoFocus = false,
  placeholder = 'Search products, brands or SKU',
  onNavigate,
}: ProductSearchProps) {
  const navigate = useNavigate();
  const listboxId = useId();
  const optionId = (index: number) => `${listboxId}-option-${index}`;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductFamilyRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const latestRequest = useRef(0);

  const trimmed = query.trim();
  const showPanel = isOpen && trimmed.length >= MIN_QUERY;
  const showEmptyState = showPanel && hasSearched && !isLoading && results.length === 0;

  const runSearch = useCallback(
    async (value: string) => {
      const requestId = ++latestRequest.current;
      setIsLoading(true);
      try {
        const { families, totalCount: total } = await searchProductFamilies({
          query: value,
          limit: MAX_SUGGESTIONS,
        });
        if (requestId !== latestRequest.current) return;

        setResults(families);
        setTotalCount(total);
        setActiveIndex(-1);
        setHasSearched(true);
        // Logged once per settled query, not per keystroke -- the debounce is
        // what makes this a record of intent rather than of typing.
        logSearchEvent(value, total, source);
      } catch (error) {
        if (requestId !== latestRequest.current) return;
        console.error('Search error:', error);
        setResults([]);
        setTotalCount(0);
        setHasSearched(true);
      } finally {
        if (requestId === latestRequest.current) setIsLoading(false);
      }
    },
    [source]
  );

  useEffect(() => {
    if (trimmed.length < MIN_QUERY) {
      latestRequest.current += 1; // cancel anything in flight
      setResults([]);
      setTotalCount(0);
      setActiveIndex(-1);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }
    const timer = setTimeout(() => runSearch(trimmed), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [trimmed, runSearch]);

  // Close on outside click. Inline in the header needs this; the dialog variant
  // is already dismissed by its own overlay.
  useEffect(() => {
    if (variant !== 'inline' || !isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [variant, isOpen]);

  const goToFamily = (family: ProductFamilyRow) => {
    // matched_sku is the variant the query actually hit. Falling back to the
    // representative SKU would silently open the cheapest size instead.
    const sku = family.matched_sku || family.representative_sku;
    if (!sku) return;
    navigate(`/products/${encodeURIComponent(sku)}`);
    setIsOpen(false);
    setQuery('');
    onNavigate?.();
  };

  const goToAllResults = () => {
    if (!trimmed) return;
    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    setIsOpen(false);
    setQuery('');
    onNavigate?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (!showPanel) return;

    // The trailing "view all" row is selectable too, hence length + 1.
    const optionCount = results.length + (results.length > 0 ? 1 : 0);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1 >= optionCount ? 0 : prev + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? optionCount - 1 : prev - 1));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(optionCount - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) goToFamily(results[activeIndex]);
      else goToAllResults();
    }
  };

  const panelPosition =
    variant === 'inline'
      ? 'absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50'
      : 'relative mt-2';

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet/50"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-label="Search products"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={showPanel ? listboxId : undefined}
          aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          className="h-10 w-full rounded-full border border-violet/15 bg-cream-alt pl-9 pr-9 font-geist text-sm text-ink placeholder:text-violet/40 focus:border-violet/40 focus:outline-none focus:ring-2 focus:ring-violet/20"
        />
        {isLoading && (
          <Loader2
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-violet/50"
            aria-hidden="true"
          />
        )}
        {!isLoading && query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-violet/50 hover:bg-violet/5 hover:text-violet"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Screen readers get the result count; sighted users read the list. */}
      <div className="sr-only" role="status" aria-live="polite">
        {showPanel && !isLoading
          ? totalCount === 0
            ? `No products found for ${trimmed}`
            : `${totalCount} product${totalCount === 1 ? '' : 's'} found for ${trimmed}`
          : ''}
      </div>

      {showPanel && (
        <div
          className={`${panelPosition} overflow-hidden rounded-2xl border border-violet/10 bg-cream shadow-xl`}
        >
          {results.length > 0 && (
            <ul id={listboxId} role="listbox" aria-label="Product suggestions" className="max-h-[22rem] overflow-y-auto">
              {results.map((family, index) => {
                const price = toPrice(family.min_price);
                const name = extractBaseName(family.display_name || family.title || '');
                const isActive = index === activeIndex;
                return (
                  <li key={family.id} id={optionId(index)} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => goToFamily(family)}
                      className={`flex w-full items-center gap-3 border-b border-violet/5 p-3 text-left transition-colors last:border-b-0 ${
                        isActive ? 'bg-violet/5' : 'hover:bg-violet/5'
                      }`}
                    >
                      <img
                        src={family.primary_image_url || getImagePlaceholder()}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        // contain, not cover: supplier shots are the product on
                        // white, and cropping a 48px thumbnail to fill mostly
                        // shows background instead of the product.
                        className="h-12 w-12 shrink-0 rounded-lg bg-cream-image object-contain p-0.5"
                        onError={(event) => {
                          event.currentTarget.src = getImagePlaceholder();
                        }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-geist text-sm font-medium text-ink">{name}</span>
                        <span className="block truncate font-geist text-xs text-muted-body">
                          {family.brand}
                          {/* Only surfaced when the query actually hit a SKU, so it
                              tells the buyer which variant they are about to open. */}
                          {family.matched_sku ? ` · ${family.matched_sku}` : ''}
                          {family.variant_count > 1 ? ` · ${family.variant_count} variants` : ''}
                        </span>
                      </span>
                      <span className="shrink-0 font-geist text-sm font-medium text-ink">
                        {price !== null
                          ? `${family.variant_count > 1 ? 'From ' : ''}${formatPrice(price)}`
                          : 'Request a price'}
                      </span>
                    </button>
                  </li>
                );
              })}
              <li id={optionId(results.length)} role="option" aria-selected={activeIndex === results.length}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(results.length)}
                  onClick={goToAllResults}
                  className={`w-full p-3 text-center font-geist text-sm font-medium text-violet transition-colors ${
                    activeIndex === results.length ? 'bg-violet/5' : 'hover:bg-violet/5'
                  }`}
                >
                  View all {totalCount} result{totalCount === 1 ? '' : 's'}
                </button>
              </li>
            </ul>
          )}

          {showEmptyState && (
            <div className="p-5 text-center">
              <p className="font-geist text-sm font-medium text-ink">
                No products found for &ldquo;{trimmed}&rdquo;
              </p>
              {/* Deliberately not a stock or availability claim -- it says what
                  Supply Ministry can do, not what is on a shelf. */}
              <p className="mt-1 font-geist text-sm text-muted-body">
                We supply beyond what is listed here. Tell us what you need and we&rsquo;ll source it.
              </p>
              {/*
                Deliberately email, not the quote form.

                The quote pipeline requires at least one basket item -- both the
                client-side guard and the edge function's `items.min(1)` schema.
                A sourcing request is by definition for something not in the
                catalogue, so routing it there would land the buyer on a form
                that rejects them. This mirrors the existing SourcingCallout
                pattern and works today. A dedicated sourcing form is worth
                building once search_events shows how much demand there is.
              */}
              <a
                href={`mailto:hello@supplyministry.com.au?subject=${encodeURIComponent(
                  `Sourcing request: ${trimmed}`
                )}&body=${encodeURIComponent(
                  `Hi Supply Ministry,\n\nI'm looking for: ${trimmed}\n\nCould you let me know what you can source?\n\nThanks,\n`
                )}`}
                onClick={() => {
                  setIsOpen(false);
                  onNavigate?.();
                }}
                className="mt-3 inline-block rounded-full bg-violet px-5 py-2 font-geist text-sm font-semibold text-cream transition-opacity hover:opacity-90"
              >
                Ask us to source it
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductSearch;
