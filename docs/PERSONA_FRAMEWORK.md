
# Wilson Persona Adaptation Framework

## Overview

Wilson uses a three-layer adaptation system to provide context-appropriate responses across different user types, regions, and languages.

## Three Layers of Adaptation

### 1. Role Layer
Determines what concepts to emphasize, vocabulary to use, and what counts as success:

- **M&V Specialist**: Technical methodology, statistical rigor, protocol compliance
- **Business Analyst**: ROI, value demonstration, risk allocation
- **Policy Maker**: Program evaluation, attribution, regulatory compliance
- **Legal Professional**: Causation, evidence, contract interpretation
- **Consultant**: Practical implementation, stakeholder management
- **Student**: Foundational learning, conceptual clarity

### 2. Region Layer
Shapes epistemological framing, authority sources, and dispute resolution approach:

- **North America**: Counterfactual-accepting, contractual, IPMVP/ASHRAE focused
- **Europe**: Standards-based (ISO), regulatory compliance, documentation
- **Asia Pacific**: Measurement-focused, consensus-seeking, varied by country
- **Latin America**: Relationship-based, flexible, development-oriented
- **Africa**: Capacity building, development goals, infrastructure constraints

### 3. Language Layer
Not just translation - localized examples, standards references, and cultural idioms:

- **English**: Default technical vocabulary
- **Spanish**: Latin American/Spanish context
- **French**: France/EU or Francophone Africa
- **German**: German standards culture
- **Japanese**: Direct measurement preference
- **Chinese**: Alignment with national policies

## How Layers Combine

Each user interaction generates a system prompt by combining:

```
BASE_PROMPT + ROLE_MODIFIER + REGION_MODIFIER + LANGUAGE_MODIFIER
```

This ensures Wilson adapts not just word choice, but entire framing and emphasis to match each persona's worldview.

## Example Combinations

### M&V Specialist × Asia Pacific × English
Emphasizes performance verification alongside modeling, acknowledges counterfactual skepticism, builds consensus before finalizing approaches.

### Legal Professional × North America × English
Frames M&V in terms of but-for causation, burden of proof, contract interpretation, and Daubert standards for expert testimony.

### Policy Maker × Latin America × Spanish
Connects M&V to national development goals, emphasizes relationship-building, acknowledges infrastructure constraints.

## Implementation

See `lib/persona-config.ts` for the complete implementation.

## Testing

Standard test queries for each persona:
1. "What is M&V?" - Does explanation match audience?
2. "How do I develop a baseline?" - Does methodology fit context?
3. "How do I report uncertainty?" - Does communication style match culture?
4. "What if there's a dispute?" - Does resolution framing match context?
5. "What standards should I follow?" - Are right authorities referenced?
