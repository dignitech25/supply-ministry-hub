-- Phase A: Mechanical cleanup of product descriptions across the catalogue.
-- Idempotent. Safe to re-run.

-- Helper: normalise a single text column with the full cleanup pipeline.
-- We inline the same expression three times below so each table/column gets the same treatment.

-- 1) products.description
UPDATE public.products
SET description = btrim(
  regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              regexp_replace(
                regexp_replace(
                  regexp_replace(
                    -- Replace em dashes and en dashes with ". "
                    regexp_replace(description, '[—–]', '. ', 'g'),
                    -- Fix "12, 000" style stray space in numeric thousands separators
                    '(\d), (\d{3})', '\1,\2', 'g'
                  ),
                  -- Insert newline between glued spec lines: "340mm" + Capital -> "340mm\nCapital"
                  '(\d\s*mm)([A-Z])', E'\\1\n\\2', 'g'
                ),
                -- Strip dead "Download ... Here" fragments not followed by a URL
                '(Download[^.]*?Here)(?!\s*[:\-]?\s*https?://)', '', 'gi'
              ),
              -- Strip standalone "Click Here" with no URL
              '(Click Here)(?!\s*[:\-]?\s*https?://)', '', 'gi'
            ),
            -- Strip ALL-CAPS marketing leader: "ELEGANT + FUNCTIONAL" glued to a Title-Case word at the start.
            -- Matches start of string, 6+ uppercase/space/+/& chars, then a capital letter that begins the real sentence.
            '^[A-Z0-9 +&]{6,}?(?=[A-Z][a-z])', '', ''
          ),
          -- Collapse runs of whitespace (but preserve newlines) by normalising spaces and tabs only
          '[ \t]+', ' ', 'g'
        ),
        -- Ensure single space after sentence punctuation when followed directly by a letter
        '([.,;:!?])([A-Za-z])', '\1 \2', 'g'
      ),
      -- Collapse 3+ consecutive newlines down to 2
      E'\n{3,}', E'\n\n', 'g'
    ),
    -- Trim leading whitespace on each line
    E'\n[ \t]+', E'\n', 'g'
  )
)
WHERE description IS NOT NULL
  AND (
    description ~ '[—–]'
    OR description ~ '\d, \d{3}'
    OR description ~ '\d\s*mm[A-Z]'
    OR description ~* 'Download[^.]*?Here'
    OR description ~* 'Click Here'
    OR description ~ '^[A-Z0-9 +&]{6,}?[A-Z][a-z]'
    OR description ~ '[.,;:!?][A-Za-z]'
  );

-- 2) products_categorized.description_long
UPDATE public.products_categorized
SET description_long = btrim(
  regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              regexp_replace(
                regexp_replace(
                  regexp_replace(
                    regexp_replace(description_long, '[—–]', '. ', 'g'),
                    '(\d), (\d{3})', '\1,\2', 'g'
                  ),
                  '(\d\s*mm)([A-Z])', E'\\1\n\\2', 'g'
                ),
                '(Download[^.]*?Here)(?!\s*[:\-]?\s*https?://)', '', 'gi'
              ),
              '(Click Here)(?!\s*[:\-]?\s*https?://)', '', 'gi'
            ),
            '^[A-Z0-9 +&]{6,}?(?=[A-Z][a-z])', '', ''
          ),
          '[ \t]+', ' ', 'g'
        ),
        '([.,;:!?])([A-Za-z])', '\1 \2', 'g'
      ),
      E'\n{3,}', E'\n\n', 'g'
    ),
    E'\n[ \t]+', E'\n', 'g'
  )
)
WHERE description_long IS NOT NULL
  AND (
    description_long ~ '[—–]'
    OR description_long ~ '\d, \d{3}'
    OR description_long ~ '\d\s*mm[A-Z]'
    OR description_long ~* 'Download[^.]*?Here'
    OR description_long ~* 'Click Here'
    OR description_long ~ '^[A-Z0-9 +&]{6,}?[A-Z][a-z]'
    OR description_long ~ '[.,;:!?][A-Za-z]'
  );

-- 3) products_categorized.description_short
UPDATE public.products_categorized
SET description_short = btrim(
  regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              regexp_replace(
                regexp_replace(
                  regexp_replace(
                    regexp_replace(description_short, '[—–]', '. ', 'g'),
                    '(\d), (\d{3})', '\1,\2', 'g'
                  ),
                  '(\d\s*mm)([A-Z])', E'\\1\n\\2', 'g'
                ),
                '(Download[^.]*?Here)(?!\s*[:\-]?\s*https?://)', '', 'gi'
              ),
              '(Click Here)(?!\s*[:\-]?\s*https?://)', '', 'gi'
            ),
            '^[A-Z0-9 +&]{6,}?(?=[A-Z][a-z])', '', ''
          ),
          '[ \t]+', ' ', 'g'
        ),
        '([.,;:!?])([A-Za-z])', '\1 \2', 'g'
      ),
      E'\n{3,}', E'\n\n', 'g'
    ),
    E'\n[ \t]+', E'\n', 'g'
  )
)
WHERE description_short IS NOT NULL
  AND (
    description_short ~ '[—–]'
    OR description_short ~ '\d, \d{3}'
    OR description_short ~ '\d\s*mm[A-Z]'
    OR description_short ~* 'Download[^.]*?Here'
    OR description_short ~* 'Click Here'
    OR description_short ~ '^[A-Z0-9 +&]{6,}?[A-Z][a-z]'
    OR description_short ~ '[.,;:!?][A-Za-z]'
  );

-- 4) products_categorized.description (the legacy "description" column too, for completeness)
UPDATE public.products_categorized
SET description = btrim(
  regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              regexp_replace(
                regexp_replace(
                  regexp_replace(
                    regexp_replace(description, '[—–]', '. ', 'g'),
                    '(\d), (\d{3})', '\1,\2', 'g'
                  ),
                  '(\d\s*mm)([A-Z])', E'\\1\n\\2', 'g'
                ),
                '(Download[^.]*?Here)(?!\s*[:\-]?\s*https?://)', '', 'gi'
              ),
              '(Click Here)(?!\s*[:\-]?\s*https?://)', '', 'gi'
            ),
            '^[A-Z0-9 +&]{6,}?(?=[A-Z][a-z])', '', ''
          ),
          '[ \t]+', ' ', 'g'
        ),
        '([.,;:!?])([A-Za-z])', '\1 \2', 'g'
      ),
      E'\n{3,}', E'\n\n', 'g'
    ),
    E'\n[ \t]+', E'\n', 'g'
  )
)
WHERE description IS NOT NULL
  AND (
    description ~ '[—–]'
    OR description ~ '\d, \d{3}'
    OR description ~ '\d\s*mm[A-Z]'
    OR description ~* 'Download[^.]*?Here'
    OR description ~* 'Click Here'
    OR description ~ '^[A-Z0-9 +&]{6,}?[A-Z][a-z]'
    OR description ~ '[.,;:!?][A-Za-z]'
  );