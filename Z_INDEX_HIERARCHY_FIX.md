# Z-Index Hierarchy Fix for Orders Page

## Problem
The Orders page was getting tugged behind the sidebar due to improper z-index hierarchy. The main content area had a z-index that was too low compared to the sidebar.

## Solution
Updated the z-index hierarchy to ensure proper layering:

### Z-Index Hierarchy (from lowest to highest)

1. **Background Elements**: `z-0` (default)
2. **Main Content Area**: `z-20` (was z-10)
3. **Header**: `z-40`
4. **Sidebar**: `z-50`
5. **Dropdowns & Modals**: `z-60` (was z-50)
6. **Accessibility Elements**: `z-50`

### Changes Made

#### 1. DashboardLayout.tsx
- **Main Content Area**: `z-10` → `z-20`
- **Main Element**: `z-10` → `z-20`
- **Footer**: `z-10` → `z-20`
- **User Profile Dropdown**: `z-50` → `z-60`

#### 2. OrdersHeader.tsx
- **Saved Filters Dropdown**: `z-50` → `z-60`

### Key Principles

1. **Sidebar Priority**: Sidebar (`z-50`) should be above main content but below dropdowns
2. **Dropdown Priority**: All dropdowns and modals (`z-60`) should be above sidebar
3. **Content Visibility**: Main content (`z-20`) should be visible and not hidden behind sidebar
4. **Header Consistency**: Header (`z-40`) should be above content but below sidebar

### Testing Checklist

- [ ] Orders page content is fully visible
- [ ] Sidebar doesn't overlap main content
- [ ] Dropdowns appear above sidebar
- [ ] Modals appear above all other elements
- [ ] Mobile layout works correctly
- [ ] No visual glitches or layering issues

### Future Considerations

When adding new components:
- Use `z-20` for main content areas
- Use `z-40` for headers and navigation
- Use `z-50` for sidebars and fixed navigation
- Use `z-60` for dropdowns and modals
- Use `z-70+` for critical overlays (if needed)

This hierarchy ensures that:
1. Content is always visible
2. Navigation elements don't interfere with content
3. Interactive elements (dropdowns, modals) are always accessible
4. Mobile responsiveness is maintained 