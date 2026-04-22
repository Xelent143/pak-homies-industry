# Sprint 1 QA Checklist

Use this checklist after each Sprint 1 deploy.

## Homepage

- [ ] Homepage loads without console errors
- [ ] Featured sample library loads products or shows a clear retry state
- [ ] Hero CTAs go to the correct routes
- [ ] Footer legal links open working pages
- [ ] WhatsApp and email links open the correct destination

## Shop

- [ ] `/shop` loads product cards from live data
- [ ] Category filter changes the visible product list
- [ ] Search returns filtered results without breaking layout
- [ ] Empty state is clear when no matching products exist
- [ ] API failure state shows retry + RFQ options instead of fake/demo catalog data
- [ ] Product images load correctly

## Product Detail

- [ ] Product detail pages open from shop cards
- [ ] Main product image loads correctly
- [ ] Product description, sample price, and CTA render correctly
- [ ] Quote/contact CTA works

## Lead Capture

- [ ] RFQ page loads without errors
- [ ] Contact page submits correctly
- [ ] WhatsApp CTA works from homepage, footer, and floating button

## Trust and Navigation

- [ ] Primary navigation links do not lead to dead ends
- [ ] Footer links do not lead to dead ends
- [ ] Shipping, privacy, and terms pages are reachable

## Technical Checks

- [ ] `product.list` responds successfully in production
- [ ] `category.listWithSubs` responds successfully in production
- [ ] No major console errors on homepage, shop, or product detail
- [ ] No broken image requests on key storefront pages

## Deploy Notes

- [ ] Rebuild `dist/` before pushing if the hosting setup serves committed build artifacts
- [ ] Hard refresh the browser after deploy verification
