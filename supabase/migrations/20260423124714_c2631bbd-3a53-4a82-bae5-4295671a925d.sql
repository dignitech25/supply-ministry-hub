-- Pass 2: fix decimal damage and split glued list items.

-- Helper expression applied to each text column:
--  (a) Restore decimals: "8. 5" -> "8.5" (digit, dot, space, digit)
--  (b) Split lowercase-then-Capital-word boundaries with a newline:
--      "capacityUp" -> "capacity\nUp"  (skip when it's an acronym like LED/NDIS by requiring 2+ lowercase chars after the capital)
--  (c) Split lowercase-then-digit when the digits look like a measurement starter
--      "capacity157" -> "capacity\n157"
--  (d) Collapse 3+ newlines to 2, trim leading whitespace per line.

-- 1) products.description
UPDATE public.products
SET description = btrim(
  regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(description, '(\d)\.\s+(\d)', '\1.\2', 'g'),
          '([a-z])([A-Z][a-z]{2,})', E'\\1\n\\2', 'g'
        ),
        '([a-z]{3,})(\d)', E'\\1\n\\2', 'g'
      ),
      E'\n{3,}', E'\n\n', 'g'
    ),
    E'\n[ \t]+', E'\n', 'g'
  )
)
WHERE description IS NOT NULL
  AND (
    description ~ '\d\.\s+\d'
    OR description ~ '[a-z][A-Z][a-z]{2,}'
    OR description ~ '[a-z]{3,}\d'
  );

-- 2) products_categorized.description_long
UPDATE public.products_categorized
SET description_long = btrim(
  regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(description_long, '(\d)\.\s+(\d)', '\1.\2', 'g'),
          '([a-z])([A-Z][a-z]{2,})', E'\\1\n\\2', 'g'
        ),
        '([a-z]{3,})(\d)', E'\\1\n\\2', 'g'
      ),
      E'\n{3,}', E'\n\n', 'g'
    ),
    E'\n[ \t]+', E'\n', 'g'
  )
)
WHERE description_long IS NOT NULL
  AND (
    description_long ~ '\d\.\s+\d'
    OR description_long ~ '[a-z][A-Z][a-z]{2,}'
    OR description_long ~ '[a-z]{3,}\d'
  );

-- 3) products_categorized.description_short
UPDATE public.products_categorized
SET description_short = btrim(
  regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(description_short, '(\d)\.\s+(\d)', '\1.\2', 'g'),
          '([a-z])([A-Z][a-z]{2,})', E'\\1\n\\2', 'g'
        ),
        '([a-z]{3,})(\d)', E'\\1\n\\2', 'g'
      ),
      E'\n{3,}', E'\n\n', 'g'
    ),
    E'\n[ \t]+', E'\n', 'g'
  )
)
WHERE description_short IS NOT NULL
  AND (
    description_short ~ '\d\.\s+\d'
    OR description_short ~ '[a-z][A-Z][a-z]{2,}'
    OR description_short ~ '[a-z]{3,}\d'
  );

-- 4) products_categorized.description
UPDATE public.products_categorized
SET description = btrim(
  regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(description, '(\d)\.\s+(\d)', '\1.\2', 'g'),
          '([a-z])([A-Z][a-z]{2,})', E'\\1\n\\2', 'g'
        ),
        '([a-z]{3,})(\d)', E'\\1\n\\2', 'g'
      ),
      E'\n{3,}', E'\n\n', 'g'
    ),
    E'\n[ \t]+', E'\n', 'g'
  )
)
WHERE description IS NOT NULL
  AND (
    description ~ '\d\.\s+\d'
    OR description ~ '[a-z][A-Z][a-z]{2,}'
    OR description ~ '[a-z]{3,}\d'
  );