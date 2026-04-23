-- Pass 3: catch short-word glues and parenthesis-to-capital glues.

UPDATE public.products
SET description = btrim(
  regexp_replace(
    regexp_replace(
      regexp_replace(description, '([a-z])([A-Z][a-z]+)', E'\\1\n\\2', 'g'),
      '(\))([A-Z])', E'\\1\n\\2', 'g'
    ),
    E'\n{3,}', E'\n\n', 'g'
  )
)
WHERE description IS NOT NULL
  AND (description ~ '[a-z][A-Z][a-z]' OR description ~ '\)[A-Z]');

UPDATE public.products_categorized
SET description_long = btrim(
  regexp_replace(
    regexp_replace(
      regexp_replace(description_long, '([a-z])([A-Z][a-z]+)', E'\\1\n\\2', 'g'),
      '(\))([A-Z])', E'\\1\n\\2', 'g'
    ),
    E'\n{3,}', E'\n\n', 'g'
  )
)
WHERE description_long IS NOT NULL
  AND (description_long ~ '[a-z][A-Z][a-z]' OR description_long ~ '\)[A-Z]');

UPDATE public.products_categorized
SET description_short = btrim(
  regexp_replace(
    regexp_replace(
      regexp_replace(description_short, '([a-z])([A-Z][a-z]+)', E'\\1\n\\2', 'g'),
      '(\))([A-Z])', E'\\1\n\\2', 'g'
    ),
    E'\n{3,}', E'\n\n', 'g'
  )
)
WHERE description_short IS NOT NULL
  AND (description_short ~ '[a-z][A-Z][a-z]' OR description_short ~ '\)[A-Z]');

UPDATE public.products_categorized
SET description = btrim(
  regexp_replace(
    regexp_replace(
      regexp_replace(description, '([a-z])([A-Z][a-z]+)', E'\\1\n\\2', 'g'),
      '(\))([A-Z])', E'\\1\n\\2', 'g'
    ),
    E'\n{3,}', E'\n\n', 'g'
  )
)
WHERE description IS NOT NULL
  AND (description ~ '[a-z][A-Z][a-z]' OR description ~ '\)[A-Z]');