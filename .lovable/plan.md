

# Create Dedicated Product Page: Aspire ComfiMotion Activ Care Bed

## Overview
Create a standalone, SEO-optimized landing page for the Aspire ComfiMotion Activ Care Bed at `/products/aspire-comfimotion-activ-care-bed`. This page will be a static content page (not database-driven) designed to target specific search intent and provide comprehensive product information.

## URL and Routing

| Item | Value |
|------|-------|
| Route | `/products/aspire-comfimotion-activ-care-bed` |
| Component | `src/pages/AspireActivCareBed.tsx` |
| Type | Static landing page (not database-driven) |

## Page Structure

### Header and Navigation
- Standard Navigation component (consistent with rest of site)
- SEO component with optimized title and meta description

### Section 1: Hero/Introduction
**H1:** Aspire ComfiMotion Activ Care Bed

Content focus:
- Who this bed is for (clients with complex mobility needs, those requiring frequent repositioning)
- Why Occupational Therapists choose it (reliable positioning, pressure care compatibility, ease of use)
- Brand badge for "Aspire"

### Section 2: Key Features
Bullet list format covering:
- Hi-lo height adjustment range
- 4-section profiling (backrest, thigh, knee break, Trendelenburg/reverse)
- Central locking castors
- Split side rail options
- Weight capacity
- Handset controls
- Battery backup

### Section 3: Common Clinical Use Cases
Bullet list format:
- Post-surgical recovery requiring frequent position changes
- Clients with respiratory conditions benefiting from head elevation
- Pressure injury prevention and management
- End-of-life care requiring comfortable repositioning
- Neurological conditions requiring postural support

### Section 4: Specifications Table
Two-column table with placeholder values:

| Specification | Value |
|---------------|-------|
| Overall Length | TBC |
| Overall Width | TBC |
| Minimum Height | TBC |
| Maximum Height | TBC |
| Safe Working Load | TBC |
| Mattress Platform | TBC |
| Power Supply | TBC |
| Warranty | TBC |

### Section 5: Melbourne Delivery & Setup
Content mentioning:
- Delivery and white-glove setup service available across Melbourne
- South East Melbourne coverage including Bayside, Kingston, Casey, Monash, Glen Eira, and Frankston areas
- Same-week delivery often available
- Professional installation by trained technicians

### Section 6: Support for Occupational Therapists
Content covering:
- Detailed product documentation available on request
- Product trials can be arranged
- Assistance with quote preparation
- Direct phone support from team

### Section 7: FAQs
Accordion-style FAQ section:
- **Delivery:** What's included in delivery and setup?
- **Accessories:** What accessories are compatible?
- **Lead times:** How quickly can this bed be delivered?
- **Mattress compatibility:** What mattresses work with this bed?

### CTAs
- **Primary CTA:** "Get a Quote" button (orange, links to /quote)
- **Secondary CTA:** "Call Us" button (outline style, links to tel:)

### Footer
- Standard Footer component

---

## Technical Implementation

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/pages/AspireActivCareBed.tsx` | **Create** - New dedicated product page component |
| `src/App.tsx` | **Modify** - Add route for the new page |

### Styling Approach
- Use existing UI components: Card, Button, Badge, Accordion
- Follow established patterns from Resources.tsx and SleepChoice.tsx
- Primary CTA: `bg-orange-500 hover:bg-orange-600` (per project memory)
- Section backgrounds alternating: white and `bg-soft-gray`
- Card styling for specifications and FAQ sections

### SEO Configuration
```
Title: Aspire ComfiMotion Activ Care Bed | Supply Ministry
Description: ~155 chars about the bed for OTs/healthcare professionals in Melbourne
Canonical: Auto-generated via SEO component
```

### Component Structure
```text
AspireActivCareBed.tsx
+-- SEO (title, description)
+-- Navigation
+-- Hero Section (intro + brand badge)
+-- Key Features Section (bullet list)
+-- Clinical Use Cases Section (bullet list)
+-- Specifications Section (Card + table)
+-- Delivery Section (prose content)
+-- OT Support Section (prose content)
+-- FAQ Section (Accordion)
+-- CTA Section (purple background, two buttons)
+-- Footer
```

---

## Constraints Followed
- No compliance/funding promises (NDIS claims avoided)
- No database queries (static content page)
- Uses existing site styling and components
- All buttons functional with proper links
- React Router Link components for internal navigation

