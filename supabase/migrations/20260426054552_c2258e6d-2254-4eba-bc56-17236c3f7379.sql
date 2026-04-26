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
                              regexp_replace(
                                regexp_replace(
                                  regexp_replace(
                                    regexp_replace(
                                      regexp_replace(
                                        regexp_replace(
                                          regexp_replace(
                                            COALESCE(input_text, ''),
                                            E'\\\\r\\\\n',
                                            E'\n',
                                            'g'
                                          ),
                                          E'\\\\n',
                                          E'\n',
                                          'g'
                                        ),
                                        E'\\\\t',
                                        ' ',
                                        'g'
                                      ),
                                      E'\\r',
                                      '',
                                      'g'
                                    ),
                                    E'\\mComfi[[:space:]]+Motion\\M',
                                    'ComfiMotion',
                                    'gi'
                                  ),
                                  E'\\mProduct Code[[:space:]]*[A-Z0-9.-]+[[:space:]]*\\.[[:space:]]*(Product Description|Display Name|Description)[[:space:]]*',
                                  E'\n',
                                  'gi'
                                ),
                                E'\\mProduct Code[[:space:]]*[A-Z0-9.-]+[[:space:]]*\\.?',
                                '',
                                'gi'
                              ),
                              E'^[[:space:]]*(Product Description|Display Name|Description)[[:space:]]*$',
                              '',
                              'gim'
                            ),
                            E'[ \\t]+',
                            ' ',
                            'g'
                          ),
                          E'[ \\t]*\\n[ \\t]*',
                          E'\n',
                          'g'
                        ),
                        E'\\mKey Features:[[:space:]]+',
                        E'Key Features:\n',
                        'gi'
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
            E'([[:lower:]])([[:upper:]]{2,}\\M)',
            E'\\1 \\2',
            'g'
          ),
          E'([[:lower:]])([[:digit:]])',
          E'\\1 \\2',
          'g'
        ),
        E'[[:space:]]+([,.;:!?])',
        E'\\1',
        'g'
      )
    ),
    ''
  );
$$;

UPDATE public.products_categorized pc
SET description_long = public.normalize_product_description_text(p.description)
FROM public.products p
WHERE p.sku = pc.sku
  AND pc.description_long IS NOT NULL
  AND length(pc.description_long) BETWEEN 495 AND 510
  AND p.description IS NOT NULL
  AND length(p.description) > length(pc.description_long) + 80;

UPDATE public.products_categorized
SET description_short = public.normalize_product_description_text(description_short)
WHERE description_short IS NOT NULL
  AND description_short IS DISTINCT FROM public.normalize_product_description_text(description_short);

UPDATE public.products_categorized
SET description_long = public.normalize_product_description_text(description_long)
WHERE description_long IS NOT NULL
  AND description_long IS DISTINCT FROM public.normalize_product_description_text(description_long);

UPDATE public.products
SET description = public.normalize_product_description_text(description)
WHERE description IS NOT NULL
  AND description IS DISTINCT FROM public.normalize_product_description_text(description);

UPDATE public.products_categorized pc
SET description_long = NULLIF(
  btrim(
    regexp_replace(
      pc.description_long,
      E'(^|\\n)[[:space:]]*' || regexp_replace(public.normalize_product_description_text(pc.title), E'([^[:alnum:]])', E'\\\\\\1', 'g') || E'[[:space:]]*$',
      E'\\1',
      'gi'
    )
  ),
  ''
)
WHERE pc.description_long IS NOT NULL
  AND pc.title IS NOT NULL
  AND public.normalize_product_description_text(pc.description_long) ~* (E'(^|\\n)[[:space:]]*' || regexp_replace(public.normalize_product_description_text(pc.title), E'([^[:alnum:]])', E'\\\\\\1', 'g') || E'[[:space:]]*$');