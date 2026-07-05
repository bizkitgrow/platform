---
name: bizkit-brand-intelligence
description: >-
  Enforces premium behavioral branding, UI/UX aesthetics, LCP optimization, accessibility, and high-impact SEO standards. Use whenever modifying copywriting, designing layouts, auditing SEO, mapping the codebase, or adjusting brand tone for the Bizkitgrow platform.
---

# Bizkitgrow Brand Intelligence & Behavioral Guidelines

## Overview
This skill acts as the master playbook for Bizkitgrow's frontend and behavioral standards. It consolidates rules from `ui-ux-pro-max`, `a11y-debugging`, `anti-ai-slop`, `debug-optimize-lcp`, `modern-web-guidance`, `understand-codebase`, and `google-antigravity-sdk`. It guarantees that all code generated for this repository adheres to premium design aesthetics, flawless performance, zero "AI slop", and correct domain architecture.

## Dependencies
- `ui-ux-pro-max`: For design system token generation and reasoning.
- `anti-ai-slop`: For human-centric copywriting and strict UI rules.
- `a11y-debugging`: For accessibility tree and focus state validation.
- `debug-optimize-lcp`: For web performance tracing.
- `modern-web-guidance`: For fetching framework-agnostic CSS/HTML best practices.
- `understand-codebase`: For impact analysis and domain boundaries.
- `google-antigravity-sdk`: For multi-agent orchestration of complex features.

## Quick Start
- "Apply bizkit-brand-intelligence to audit the hero section for slop and LCP issues."
- "Use bizkit-brand-intelligence to rewrite the blog post components."
- "Execute bizkit-brand-intelligence checklist before committing this PR."

## Workflow

### 1. Codebase Understanding & Architecture Check
- **Analyze Impact:** Before writing code, map the domain boundaries (via `understand-codebase`). Do not mix business logic in middleware or UI components.
- **Orchestration:** If the task requires deep multi-step logic, structure it using Google Antigravity SDK agent patterns (Agent, Conversation, Connection) to keep boundaries clean.

### 2. Copywriting & Anti-AI Slop Verification
- **Eliminate Slop:** STRICTLY BLOCK terms like "Seamless," "Unlock the power," "Synergy," "Revolutionary." Prioritize human audiences, practical problem-solving copy, and high semantic value for SEO EEAT.
- **Tone:** Use decisive, authoritative, and human-centric language (e.g., "The All-in-One Growth Platform for Remote Agencies", "Expert insights").
- **State Machine UI:** Every interactive component must handle Idle, Loading, Success, Error, and Empty states gracefully. Do not use generic alerts like "Error 500".

### 3. UI/UX & Modern Web Guidance
- **Design Tokens:** Strictly adhere to the established Tailwind configuration (`brand_cta`, `canvas_accent`, etc.).
- **Typography & Layout:** Ensure a strict visual hierarchy. Base unit is 8px. Do not center all elements; directional asymmetry looks more premium.
- **Modern Standards:** Default to modern CSS (e.g., `:has()`, View Transitions, container queries) before using heavy JS libraries, consulting `modern-web-guidance` first.

### 4. Accessibility (A11y) Implementation
- **Semantics First:** Rely on native HTML tags over `div`s.
- **Accessibility Tree:** Ensure `aria-label` is present on icon-only buttons.
- **Focus & Contrast:** Maintain minimum 4.5:1 text contrast. Focus rings must be visible for keyboard navigation. Tap targets must be at least 48x48 pixels.

### 5. Performance & LCP Optimization
- **LCP Elements:** Never apply `loading="lazy"` to LCP images (usually the hero image). Add `fetchpriority="high"` instead.
- **Resource Delay:** Optimize TTFB and Resource Load Delay by eliminating render-blocking scripts in `<head>`.

## Common Mistakes
1. **Writing AI Slop:** Using generic gradients, "basa-basi AI" (e.g., "Certainly!"), and empty jargon instead of specific business benefits.
2. **Missing Component States:** Failing to design for loading/error/empty states, causing the UI to break or look unprofessional on API delays.
3. **Lazy-Loading the Hero Image:** Applying `loading="lazy"` to the main hero image, destroying the page's LCP score.
