# Design Gate Checklist: The "Factory Judge" Protocol

**Instructions for Codex:**
Use this checklist to audit the `implementation_plan.md` or the final build.
If ANY critical item is `[FAIL]`, the task is rejected.

## 1. Compliance Audit (Spec vs. Reality)
- [ ] **Palette match?** Do the CSS variables match the `Brand Soul` hex codes exactly?
- [ ] **Font match?** Are the specified font families imported and used?
- [ ] **Motif presence?** Is the required visual motif (e.g., "Hexagons") visible in the code/assets?

## 2. "Template Effect" Detection (Anti-Pattern Scan)
- [ ] **Layout Uniqueness:** Is the Hero section structure unique, or is it a standard "Left Text / Right Image" block?
- [ ] **Component Customization:** Do buttons have custom interactions (hover/active states) beyond browser defaults?
- [ ] **Motion Check:** Is there at least one scroll-triggered animation or micro-interaction?

## 3. Technical Aesthetics
- [ ] **Responsive Integrity:** Does the layout hold on mobile (375px)?
- [ ] **Whitespace Polish:** Are margins/paddings consistent (using a spacing scale)?
- [ ] **Asset Quality:** Are images high-res and optimized (WebP/AVIF)?

## 4. "Soul" Alignment
- [ ] **Copy Tone:** Does the text reflect the "Genetic Code" (e.g., "Medical/Technical" vs "Friendly/Casual")?
- [ ] **Vibe Check:** Does the overall composition output the correct "Feeling" defined in the Manifest? (Subjective but critical).

---
**Verdict:**
[ ] **APPROVED** (Proceed to Delivery)
[ ] **REJECTED** (Return to Planning - List Violations Below)
