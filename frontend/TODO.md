# MVCR Refactoring TODO

## Phase 1: Router Setup
- [ ] Create src/router/Router.jsx with all routing logic
- [ ] Extract ProtectedRoute component
- [ ] Extract Layout wrapper component

## Phase 2: App.jsx Simplification
- [ ] Remove routing logic from App.jsx
- [ ] Remove auth state management (move to AuthContext)
- [ ] Simplify to just render Router with AuthProvider

## Phase 3: Controller Layer (Hooks Consolidation)
- [ ] Merge similar hooks (useDietplan, useNutrition, useProgress)
- [ ] Consolidate useYogaSession and usePoseDetection
- [ ] Create unified useAuth hook

## Phase 4: Model Layer Enhancement
- [ ] Enhance AuthContext with better state management
- [ ] Consolidate API services
- [ ] Create shared data models

## Phase 5: View Layer Minimization
- [ ] Remove inline logic from components
- [ ] Consolidate similar components
- [ ] Use shared utilities for common patterns

## Phase 6: Testing & Verification
- [ ] Test all routes work
- [ ] Verify auth flow
- [ ] Check component functionality
- [ ] Ensure no broken features
