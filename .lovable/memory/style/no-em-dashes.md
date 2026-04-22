---
name: No em dashes
description: Hard ban on em dash characters across all site copy, code, DB content, and AI-generated text.
type: constraint
---
Never use em dashes (—) anywhere on the site. This includes UI copy, headings, body text, product descriptions, placeholders, alt text, meta descriptions, code comments visible to users, email templates, and any AI-generated text.

Replace with: a period, comma, colon, semicolon, parentheses, or rewording with "and" / "so" / "because". Choose whichever best preserves the sentence rhythm.

**Why:** User explicitly forbade em dashes site-wide. They read as AI slop and the user wants every piece of copy to feel human-written.

**How to apply:** Before writing or pasting any copy, scan for `—` and swap it. Applies retroactively too: any em dash found in existing files or DB rows must be removed when touched.
