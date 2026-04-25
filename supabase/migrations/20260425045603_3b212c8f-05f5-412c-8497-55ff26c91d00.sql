CREATE OR REPLACE FUNCTION public.normalize_product_description_text(input_text text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT NULLIF(
    btrim(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              regexp_replace(
                regexp_replace(
                  regexp_replace(
                    regexp_replace(
                      regexp_replace(
                        regexp_replace(
                          regexp_replace(
                            regexp_replace(
                              COALESCE(input_text, ''),
                              E'\\r',
                              '',
                              'g'
                            ),
                            E'[ \\t]+',
                            ' ',
                            'g'
                          ),
                          E'[ \\t]*\\n[ \\t]*',
                          E'\\n',
                          'g'
                        ),
                        E'([^[:space:]\\(\\[\\{])(\\(|\\[|\\{)',
                        E'\\1 \\2',
                        'g'
                      ),
                      E'(\\(|\\[|\\{)[[:space:]]+',
                      E'\\1',
                      'g'
                    ),
                    E'[[:space:]]+(\\)|\\]|\\})',
                    E'\\1',
                    'g'
                  ),
                  E'(\\)|\\]|\\})([[:alnum:]])',
                  E'\\1 \\2',
                  'g'
                ),
                E'([[:lower:]])([[:upper:]][[:lower:]])',
                E'\\1 \\2',
                'g'
              ),
              E'([[:lower:]])([[:digit:]])',
              E'\\1 \\2',
              'g'
            ),
            E'([[:digit:]])([[:lower:]]{2,})',
            E'\\1 \\2',
            'g'
          ),
          E'[[:space:]]+([,.;:!?])',
          E'\\1',
          'g'
        ),
        E'([,;:!?])([^[:space:]\\n\\)\\]\\}])',
        E'\\1 \\2',
        'g'
      )
    ),
    ''
  );
$$;

UPDATE public.products
SET description = public.normalize_product_description_text(description)
WHERE description IS NOT NULL
  AND description IS DISTINCT FROM public.normalize_product_description_text(description);

UPDATE public.products_categorized
SET description = public.normalize_product_description_text(description)
WHERE description IS NOT NULL
  AND description IS DISTINCT FROM public.normalize_product_description_text(description);

UPDATE public.products_categorized
SET description_short = public.normalize_product_description_text(description_short)
WHERE description_short IS NOT NULL
  AND description_short IS DISTINCT FROM public.normalize_product_description_text(description_short);

UPDATE public.products_categorized
SET description_long = public.normalize_product_description_text(description_long)
WHERE description_long IS NOT NULL
  AND description_long IS DISTINCT FROM public.normalize_product_description_text(description_long);