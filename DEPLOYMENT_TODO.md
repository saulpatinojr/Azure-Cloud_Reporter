# Deployment Preparation Tasks

## Cache & Dependencies Cleanup
- [ ] Clean build caches (`npm run build` artifacts)
- [ ] Clear Vite cache (`.vite/` directory)
- [ ] Clear Jest cache (`jest --clearCache`)
- [ ] Remove `node_modules` and rebuild (`npm ci`)
- [ ] Rebuild package-lock.json from scratch
- [ ] Verify all dependencies are up-to-date

## Pre-Deployment Testing
- [ ] Production build test (`npm run build`)
- [ ] Preview production build (`npm run preview`)
- [ ] Run full test suite in CI mode (`npm test -- --ci --runInBand`)
- [ ] Lint check (`npm run lint`)
- [ ] Type check (`npm run type-check` if available)
- [ ] Bundle size analysis

## Deployment Configuration
- [ ] Environment variables setup for production
- [ ] Firebase config validation
- [ ] Build output optimization
- [ ] CDN/static asset preparation
- [ ] Error monitoring setup
- [ ] Performance monitoring integration

## Post-Deployment Verification
- [ ] Smoke test deployed application
- [ ] Verify authentication flows
- [ ] Test theme customization
- [ ] Check accessibility compliance
- [ ] Monitor initial performance metrics

## Notes
- Current test suite: 5 suites, 18 tests passing
- Dev server running on port 5174
- All TypeScript errors resolved
- Accessibility tests implemented for key components