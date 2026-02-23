# Wilson-Personas

An AI-powered M&V (Measurement & Verification) chatbot that adapts its responses based on the user's professional role, geographic region, and language. Built as a reference implementation for context-aware expert systems in the energy efficiency domain.

> **Status:** This repository is preserved as a design example. It is not under active development.

## What It Does

Wilson is an M&V expert chatbot that doesn't just answer questions — it adapts *how* it answers based on who is asking and where they work. An M&V specialist in Tokyo gets different framing than a policy maker in Latin America, even for the same underlying question.

## Three-Layer Persona Adaptation

Wilson uses a composable persona system with three independent layers:

### 1. Role Layer
Determines vocabulary, emphasis, and success criteria:
- **M&V Specialist** — technical methodology, statistical rigor, protocol compliance
- **Business Analyst** — ROI, value demonstration, risk allocation
- **Policy Maker** — program evaluation, attribution, regulatory compliance
- **Legal Professional** — causation, evidence standards, contract interpretation
- **Consultant** — practical implementation, stakeholder management
- **Student** — foundational learning, conceptual clarity

### 2. Region Layer
Shapes epistemological framing and authority sources:
- **North America** — counterfactual-accepting, contractual, IPMVP/ASHRAE focused
- **Europe** — standards-based (ISO), regulatory compliance, documentation
- **Asia Pacific** — measurement-focused, consensus-seeking
- **Latin America** — relationship-based, development-oriented
- **Africa** — capacity building, development goals, infrastructure constraints

### 3. Language Layer
Not just translation — localized examples, standards references, and cultural idioms across English, Spanish, French, German, Japanese, and Chinese.

### How Layers Combine

Each interaction generates a system prompt:

```
BASE_PROMPT + ROLE_MODIFIER + REGION_MODIFIER + LANGUAGE_MODIFIER
```

This ensures Wilson adapts not just word choice, but entire framing to match each persona's worldview.

## Tech Stack

- **Framework:** Next.js (TypeScript)
- **Styling:** Tailwind CSS
- **Persona Engine:** `lib/persona-config.ts`
- **Database:** PostgreSQL (session management)
- **Hosting:** Originally Replit + Vercel

## Project Structure

```
app/              # Next.js app routes
components/       # UI components
lib/
  persona-config.ts  # Three-layer persona system
  api-client.ts      # API integration
  database.ts        # Session persistence
  utils.ts           # Shared utilities
docs/
  PERSONA_FRAMEWORK.md  # Detailed framework documentation
attached_assets/  # Reference materials
scripts/          # Database and utility scripts
```

## Why This Matters for M&V

M&V is practiced differently around the world. The same question — "How do I develop a baseline?" — has fundamentally different answers depending on whether the asker operates under IPMVP in North America, ISO 50015 in Europe, or national standards in Asia. Wilson demonstrates that an expert system for M&V must account for these differences, not just in language but in epistemology.

## Related Projects

- [mv-course](https://github.com/jskromer/mv-course) — Interactive IPMVP-aligned M&V course
- [CFdesigns](https://github.com/jskromer/CFdesigns) — Counterfactual Designs educational platform
- [Mnvscore](https://github.com/jskromer/Mnvscore) — M&V Scorecard characterization tool
- [counterfactual-designs.com](https://counterfactual-designs.com) — Central resource

## Author

Steve Kromer — author of *The Role of the Measurement and Verification Professional* (River Publishers, 2024), former Chair of IPMVP.
