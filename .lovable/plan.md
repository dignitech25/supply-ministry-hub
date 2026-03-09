

## Fix Repetitive Contact Info in Footer

The contact details appear in both the Footer and the "Ready to Get Started?" section at the bottom of the homepage, creating redundancy.

### Plan

**Footer.tsx** — Simplify the Contact column to a single line with a link to the contact section or quote page, removing the full listing of names/emails/phones:

```
<h4>Contact</h4>
<p>Mon-Fri: 8:30 AM - 5:00 PM AEST</p>
<Link to="/quote">Get in Touch →</Link>
```

This keeps the footer clean while the full contact details remain in the "Ready to Get Started?" CTA section on the homepage and on relevant pages.

