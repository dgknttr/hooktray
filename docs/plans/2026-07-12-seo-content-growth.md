# HookTray SEO Content Growth Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Grow qualified Google traffic that opens the live HookTray inspector and, secondarily, visits or stars the GitHub repository.

**Architecture:** Keep `/` as the live inspector and make `/webhook-tester` the central search landing page. Add two provider-specific, server-rendered guides for Stripe and Shopify that solve distinct setup and troubleshooting intents, link into the live inspector, cite official provider documentation, and feed authority back to the central tester page through internal links.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Vitest, Testing Library.

---

## Understanding Summary

- HookTray is a no-account, local-first webhook inspector; `/` remains the live product.
- The primary conversion is Google visitor to active inspector user.
- The secondary conversion is a GitHub repository visit and, when earned, a star.
- Search Console reports 382 impressions and 1 click in the last three months.
- `/webhook-tester` accounts for 342 impressions, mostly around `webhook tester`, `webhook test`, and `webhook testing`, but ranks around positions 85-95.
- Provider pages must help users complete a real task, not swap provider names into a template.
- Stripe and Shopify are the first provider guides because their setup and failure modes are materially different.

## Assumptions And Non-Goals

- Content is English-first and aimed at developers.
- Pages remain statically renderable, lightweight, accessible, and useful without analytics scripts.
- Official Stripe and Shopify documentation is the source of truth for provider behavior.
- HookTray may describe signature headers, retries, and delivery behavior, but must not claim to verify signatures, replay requests, forward requests, or retain server-side history.
- Accounts, premium features, server-side capture while the browser is closed, and signature verification are explicitly out of scope.
- No provider logos, trademarks as branding, fabricated benchmarks, fake testimonials, or unverified competitive claims are added.
- There is no target word count. Completeness and task success determine page length.

## Content Model

Each provider guide must follow this user journey:

1. Explain in two or three sentences what the provider uses webhooks for.
2. Let the user open HookTray and obtain a temporary public endpoint.
3. Give current provider-specific setup steps.
4. Explain what to inspect in HookTray: event header, signature header, content type, and payload.
5. Cover provider-specific failure modes using official sources.
6. State the boundary: HookTray captures and displays the request; application-side verification and processing still belong in the user's handler.
7. Link to the central webhook tester, relevant official documentation, the live inspector, and the GitHub source.

## Decision Log

| Decision | Alternatives considered | Reason |
| --- | --- | --- |
| Keep `/` as the live inspector | Marketing homepage; move tool to `/app` | Immediate utility is HookTray's strongest product experience. |
| Use a hub-and-spoke content model | Only broad pages; mass programmatic pages | Combines focus with long-tail growth while avoiding thin pages. |
| Start with Stripe and Shopify | Publish many providers at once | Both have distinct, documented workflows and troubleshooting needs. |
| Use official documentation as citations | Unsourced summaries; community posts as authority | Provider behavior changes and security details require primary sources. |
| Use contextual GitHub links | Make GitHub the primary CTA | Product use is primary; source inspection is a natural trust action. |
| Do not market absent features | Mention future signature verification/replay/forwarding | Search content must describe the product users can use today. |

## Task 1: Stripe Webhook Testing Guide

**Files:**
- Create: `frontend/app/(site)/guides/test-stripe-webhooks/page.tsx`
- Create: `frontend/app/(site)/guides/test-stripe-webhooks/page.test.tsx`

**Content requirements:**

- URL: `/guides/test-stripe-webhooks`
- H1: `How to Test Stripe Webhooks`
- Metadata title should lead with `Stripe Webhook Tester` and remain descriptive rather than promotional.
- Description should mention a temporary endpoint, real-time inspection, and no account requirement.
- Explain common events without pretending to be exhaustive: `payment_intent.succeeded`, `invoice.paid`, and `customer.subscription.updated`.
- Provide a numbered Workbench setup flow that points the endpoint to the user's generated HookTray URL.
- Explain what to inspect: `Stripe-Signature`, event `type`, event `id`, request body, and content type.
- Troubleshooting sections must cover wrong endpoint secret, raw body mutation, test/live mode confusion, non-2xx responses, retries, and unordered events.
- Explain that HookTray displays the signature header but does not currently validate it.
- Link only to relevant official Stripe pages:
  - `https://docs.stripe.com/webhooks`
  - `https://docs.stripe.com/webhooks/signature`
- Include primary CTA `Open HookTray` linking to `/`.
- Include internal link to `/webhook-tester` and contextual source link to `https://github.com/dgknttr/hooktray`.
- External links use `target="_blank"` and `rel="noopener noreferrer"`.

**Step 1: Write the failing page test**

Test observable content and links, not Tailwind classes:

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import StripeWebhookGuidePage from "./page"

describe("Stripe webhook guide", () => {
  it("guides a visitor from Stripe setup to the live inspector", () => {
    render(<StripeWebhookGuidePage />)
    expect(screen.getByRole("heading", { level: 1, name: /how to test stripe webhooks/i })).toBeInTheDocument()
    expect(screen.getByText(/stripe-signature/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /open hooktray/i })).toHaveAttribute("href", "/")
  })

  it("cites Stripe and links to HookTray source without claiming verification", () => {
    render(<StripeWebhookGuidePage />)
    expect(screen.getByRole("link", { name: /stripe webhook documentation/i })).toHaveAttribute("href", "https://docs.stripe.com/webhooks")
    expect(screen.getByRole("link", { name: /inspect the source/i })).toHaveAttribute("href", "https://github.com/dgknttr/hooktray")
    expect(screen.getByText(/does not validate the signature/i)).toBeInTheDocument()
  })
})
```

**Step 2: Run the focused test and verify RED**

Run: `cd frontend && npm test -- 'app/(site)/guides/test-stripe-webhooks/page.test.tsx'`

Expected: FAIL because `./page` does not exist.

**Step 3: Implement the minimum complete Stripe guide**

Use the existing site typography and spacing conventions. Keep the content in the page module; do not create a CMS, provider schema, or generalized guide renderer for one page.

**Step 4: Run the focused test and verify GREEN**

Run: `cd frontend && npm test -- 'app/(site)/guides/test-stripe-webhooks/page.test.tsx'`

Expected: PASS.

**Step 5: Run frontend lint and full tests**

Run: `cd frontend && npm run lint && npm test`

Expected: all commands exit 0.

**Step 6: Commit**

```bash
git add 'frontend/app/(site)/guides/test-stripe-webhooks/page.tsx' 'frontend/app/(site)/guides/test-stripe-webhooks/page.test.tsx'
git commit -m "feat: add Stripe webhook testing guide"
```

## Task 2: Shopify Webhook Testing Guide

**Files:**
- Create: `frontend/app/(site)/guides/test-shopify-webhooks/page.tsx`
- Create: `frontend/app/(site)/guides/test-shopify-webhooks/page.test.tsx`

**Content requirements:**

- URL: `/guides/test-shopify-webhooks`
- H1: `How to Test Shopify Webhooks`
- Metadata title should lead with `Shopify Webhook Tester`.
- Description should mention a temporary endpoint, delivery inspection, and no account requirement.
- Briefly explain topics using `orders/create`, `products/update`, and `refunds/create` as examples.
- Describe both a real end-to-end store action and Shopify CLI's sample trigger, clearly explaining that the CLI payload is fixed and is not retried on failure.
- Explain what to inspect: `X-Shopify-Topic`, `X-Shopify-Webhook-Id`, `X-Shopify-Hmac-Sha256`, payload, and response behavior.
- Troubleshooting sections must cover raw-body HMAC requirements, duplicate delivery/idempotency, unordered events, five-second response timeout, retries, and subscription removal after repeated failures.
- Explain that HookTray displays the HMAC header but does not currently validate it.
- Link only to relevant official Shopify pages:
  - `https://shopify.dev/docs/apps/build/webhooks`
  - `https://shopify.dev/docs/apps/build/webhooks/verify-deliveries`
  - `https://shopify.dev/docs/apps/build/webhooks/troubleshoot`
  - `https://shopify.dev/docs/api/shopify-cli/app/app-webhook-trigger`
- Include primary CTA `Open HookTray` linking to `/`.
- Include internal link to `/webhook-tester` and contextual source link to `https://github.com/dgknttr/hooktray`.
- External links use `target="_blank"` and `rel="noopener noreferrer"`.

**Step 1: Write the failing page test**

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import ShopifyWebhookGuidePage from "./page"

describe("Shopify webhook guide", () => {
  it("guides a visitor from Shopify setup to the live inspector", () => {
    render(<ShopifyWebhookGuidePage />)
    expect(screen.getByRole("heading", { level: 1, name: /how to test shopify webhooks/i })).toBeInTheDocument()
    expect(screen.getByText(/x-shopify-hmac-sha256/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /open hooktray/i })).toHaveAttribute("href", "/")
  })

  it("covers Shopify delivery behavior and links to primary sources", () => {
    render(<ShopifyWebhookGuidePage />)
    expect(screen.getByText(/does not validate the hmac/i)).toBeInTheDocument()
    expect(screen.getByText(/duplicate/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /shopify webhook documentation/i })).toHaveAttribute("href", "https://shopify.dev/docs/apps/build/webhooks")
  })
})
```

**Step 2: Run the focused test and verify RED**

Run: `cd frontend && npm test -- 'app/(site)/guides/test-shopify-webhooks/page.test.tsx'`

Expected: FAIL because `./page` does not exist.

**Step 3: Implement the minimum complete Shopify guide**

Follow existing site patterns. Keep provider-specific copy explicit; do not derive this page from Stripe content through string substitution.

**Step 4: Run the focused test and verify GREEN**

Run: `cd frontend && npm test -- 'app/(site)/guides/test-shopify-webhooks/page.test.tsx'`

Expected: PASS.

**Step 5: Run frontend lint and full tests**

Run: `cd frontend && npm run lint && npm test`

Expected: all commands exit 0.

**Step 6: Commit**

```bash
git add 'frontend/app/(site)/guides/test-shopify-webhooks/page.tsx' 'frontend/app/(site)/guides/test-shopify-webhooks/page.test.tsx'
git commit -m "feat: add Shopify webhook testing guide"
```

## Task 3: Guide Discovery And Internal Linking

**Files:**
- Modify: `frontend/app/(site)/webhook-tester/page.tsx`
- Create: `frontend/app/(site)/webhook-tester/page.test.tsx`
- Modify: `frontend/app/sitemap.ts`
- Create: `frontend/app/sitemap.test.ts`

**Requirements:**

- Add a concise `Provider guides` section to `/webhook-tester` with descriptive links to both guides.
- Keep `/webhook-tester` focused on generic testing; do not duplicate full provider instructions.
- Add both canonical guide URLs to the sitemap with `monthly` change frequency and priority lower than `/webhook-tester`.
- Do not add provider links to the global primary navigation yet; two guides do not justify a new navigation category.

**Step 1: Write failing discovery tests**

Add a page test that expects links to both guide routes. Add a sitemap test that calls `sitemap()` and expects both absolute URLs exactly once.

**Step 2: Run tests and verify RED**

Run: `cd frontend && npm test -- 'app/(site)/webhook-tester/page.test.tsx' 'app/sitemap.test.ts'`

Expected: FAIL because guide links and sitemap entries are absent.

**Step 3: Add internal links and sitemap entries**

Use descriptive anchor text: `Test Stripe webhooks` and `Test Shopify webhooks`. Preserve the environment-driven site URL behavior already in `sitemap.ts`.

**Step 4: Run focused tests and verify GREEN**

Run: `cd frontend && npm test -- 'app/(site)/webhook-tester/page.test.tsx' 'app/sitemap.test.ts'`

Expected: PASS.

**Step 5: Run frontend verification**

Run: `cd frontend && npm run lint && npm test && npm run build`

Expected: lint, all tests, and production build pass.

**Step 6: Commit**

```bash
git add 'frontend/app/(site)/webhook-tester/page.tsx' 'frontend/app/(site)/webhook-tester/page.test.tsx' frontend/app/sitemap.ts frontend/app/sitemap.test.ts
git commit -m "feat: connect provider webhook guides"
```

## Task 4: End-To-End Content And Product Verification

**Files:**
- Modify only if verification reveals a defect in Tasks 1-3.

**Step 1: Run the complete frontend quality gate**

Run: `cd frontend && npm run lint && npm test && npm run build`

Expected: all commands exit 0 without warnings introduced by this branch.

**Step 2: Run repository-required backend verification**

Run: `dotnet test backend/HookTray.sln`

Run: `dotnet publish backend/HookTray.Api/HookTray.Api.csproj -c Release --no-restore`

Expected: tests and publish pass. No backend behavior changed, but repository completion rules require both checks.

**Step 3: Manual content smoke check**

Start the frontend and verify at desktop and mobile widths:

- `/` is still the live inspector.
- Both guide routes return 200 and render without horizontal overflow.
- Both primary CTAs return to `/`.
- Official documentation opens in a new tab.
- GitHub links point to `https://github.com/dgknttr/hooktray`.
- No text claims signature verification, replay, forwarding, or server-side request retention.

**Step 4: Review the rendered production output**

Inspect each guide's HTML/head and confirm unique title, description, canonical URL, one H1, crawlable internal links, and no accidental `noindex`.

**Step 5: Commit verification-only fixes if needed**

If no fixes are required, do not create an empty commit.

## Post-Launch Measurement

- Submit or refresh `https://hooktray.com/sitemap.xml` in Search Console.
- Inspect both URLs and request indexing after deployment.
- Record a launch annotation with the deployment date.
- Review after 28 days and 90 days:
  - indexed status;
  - impressions and clicks by guide;
  - provider-specific queries;
  - average position distribution, especially top 20 and top 10;
  - visits from guides to `/`;
  - outbound GitHub visits if a privacy-compatible measurement method is approved.
- Expand to GitHub webhooks only after these pages establish the content pattern or Search Console demonstrates demand.

## Deferred Product Memory

Client-side signature verification is a valuable future feature but is not part of this plan. A privacy-first version would keep provider secrets in browser memory or session scope and use Web Crypto locally. Correct implementation requires the backend relay to preserve the exact raw request bytes, likely as Base64, because Stripe and Shopify signatures are calculated over the unmodified body. Server-side verification, accounts, browser-closed capture, replay, and forwarding require separate product and security designs.
