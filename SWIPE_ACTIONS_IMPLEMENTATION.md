# Swipe Actions Implementation

## Overview

This implementation adds swipe actions to various components across the application, providing an intuitive mobile-first experience with haptic feedback and visual indicators.

## Features

### ✅ **Haptic Feedback**
- **Light swipe**: 10ms vibration during swipe gestures
- **Edit action**: [10ms, 20ms, 10ms] pattern for edit operations
- **Delete action**: [20ms, 10ms, 20ms, 10ms, 20ms] pattern for delete operations
- **Success**: [10ms, 30ms, 10ms] pattern for successful operations
- **Error**: [50ms, 10ms, 50ms, 10ms, 50ms] pattern for error states

### ✅ **Visual Feedback**
- **Background gradients**: Red for delete, yellow for edit
- **Action icons**: Pencil for edit, trash for delete
- **Opacity animation**: Visual indicators fade in/out based on swipe distance
- **Smooth transitions**: Framer Motion animations for fluid interactions

### ✅ **Mobile-Responsive**
- **Auto-detection**: Only enabled on screens ≤640px (sm breakpoint)
- **Desktop fallback**: Regular table/list views on larger screens
- **Touch-optimized**: Designed for touch interactions

## Components

### 1. **HapticFeedback Utility** (`src/utils/hapticFeedback.ts`)

```typescript
import { HapticFeedback } from '../utils/hapticFeedback';

// Usage examples
HapticFeedback.swipe();     // Light feedback during swipe
HapticFeedback.edit();      // Medium feedback for edit
HapticFeedback.delete();    // Strong feedback for delete
HapticFeedback.success();   // Success feedback
HapticFeedback.error();     // Error feedback
```

### 2. **useSwipeActions Hook** (`src/hooks/useSwipeActions.ts`)

Reusable hook for implementing swipe actions:

```typescript
import { useSwipeActions } from '../hooks/useSwipeActions';

const { dragProps, getSwipeStyle, getSwipeVisuals, isMobile } = useSwipeActions({
  onSwipeLeft: () => handleDelete(),
  onSwipeRight: () => handleEdit(),
  threshold: 100,
  enabled: true,
});
```

### 3. **SwipeableTable Component** (`src/components/SwipeableTable.tsx`)

Advanced table component with mobile card view and swipe actions:

```typescript
import SwipeableTable, { SwipeableColumn } from '../SwipeableTable';

const columns: SwipeableColumn<Buyer>[] = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    mobilePriority: true, // Show on mobile cards
    render: (buyer) => <span>{buyer.name}</span>,
  },
  // ... more columns
];

<SwipeableTable
  data={buyers}
  columns={columns}
  onEdit={handleEdit}
  onDelete={handleDelete}
  getRowId={(buyer) => buyer.id}
/>
```

### 4. **SwipeableList Component** (`src/components/SwipeableList.tsx`)

Generic list component with swipe actions:

```typescript
import SwipeableList from '../SwipeableList';

<SwipeableList
  items={items}
  renderItem={(item, index) => <ItemComponent item={item} />}
  onSwipeLeft={(item) => handleDelete(item)}
  onSwipeRight={(item) => handleEdit(item)}
  leftActionLabel="Delete"
  rightActionLabel="Edit"
/>
```

## Implemented Components

### ✅ **OrdersCardView** (`src/components/Orders/OrdersCardView.tsx`)
- **Swipe left**: Delete order
- **Swipe right**: Edit order
- **Haptic feedback**: Integrated with swipe gestures
- **Visual indicators**: Background gradients and action icons

### ✅ **BuyersTable** (`src/components/Buyers/BuyersTable.tsx`)
- **Mobile**: SwipeableTable with card view
- **Desktop**: Traditional table view
- **Swipe actions**: Edit and delete buyers
- **Responsive**: Auto-switches between views

### ✅ **SwipeableTable** (`src/components/SwipeableTable.tsx`)
- **Generic table**: Works with any data type
- **Mobile cards**: Touch-friendly card layout
- **Column priority**: `mobilePriority` flag for mobile display
- **Search & sort**: Built-in filtering and sorting

### ✅ **SwipeableList** (`src/components/SwipeableList.tsx`)
- **Generic list**: Works with any item type
- **Custom rendering**: Flexible item rendering
- **Swipe actions**: Configurable left/right actions
- **Empty states**: Customizable empty messages

## Usage Examples

### Basic Swipe Implementation

```typescript
import { useSwipeActions } from '../hooks/useSwipeActions';

const MyComponent = () => {
  const { dragProps, getSwipeStyle, getSwipeVisuals } = useSwipeActions({
    onSwipeLeft: () => handleDelete(),
    onSwipeRight: () => handleEdit(),
  });

  return (
    <motion.div
      {...dragProps}
      style={getSwipeStyle()}
      className="bg-white rounded-lg border"
    >
      {getSwipeVisuals('Delete', 'Edit')}
      <div className="relative z-20">
        {/* Your content */}
      </div>
    </motion.div>
  );
};
```

### Table with Swipe Actions

```typescript
import SwipeableTable from '../components/SwipeableTable';

const MyTable = () => {
  const columns = [
    {
      key: 'name',
      label: 'Name',
      mobilePriority: true,
      render: (item) => <span>{item.name}</span>,
    },
    // ... more columns
  ];

  return (
    <SwipeableTable
      data={data}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
      getRowId={(item) => item.id}
    />
  );
};
```

## Technical Details

### **Swipe Threshold**
- **Default**: 100px
- **Configurable**: Via `threshold` prop
- **Visual feedback**: Starts at 20px for background changes

### **Haptic Patterns**
- **Swipe**: 10ms (light feedback)
- **Edit**: [10, 20, 10]ms (medium feedback)
- **Delete**: [20, 10, 20, 10, 20]ms (strong feedback)

### **Mobile Detection**
- **Breakpoint**: 640px (sm)
- **Library**: `react-responsive`
- **Fallback**: Desktop views for larger screens

### **Performance**
- **Lazy loading**: Components only render when needed
- **Optimized animations**: Framer Motion for smooth interactions
- **Memory efficient**: Minimal re-renders

## Browser Support

### **Haptic Feedback**
- **Supported**: Android, iOS Safari
- **Fallback**: Graceful degradation on unsupported devices
- **Detection**: Automatic feature detection

### **Touch Gestures**
- **Supported**: All modern browsers
- **Library**: Framer Motion
- **Fallback**: Mouse events on desktop

## Future Enhancements

### **Planned Features**
- [ ] **Swipe up/down**: Vertical swipe actions
- [ ] **Multi-swipe**: Different actions based on swipe distance
- [ ] **Custom patterns**: User-defined haptic patterns
- [ ] **Sound effects**: Audio feedback for actions
- [ ] **Gesture training**: Onboarding for new users

### **Potential Components**
- [ ] **SwipeableModal**: Modal with swipe-to-dismiss
- [ ] **SwipeableDrawer**: Drawer with swipe actions
- [ ] **SwipeableCarousel**: Image carousel with swipe
- [ ] **SwipeableChat**: Chat messages with swipe actions

## Best Practices

### **Accessibility**
- **Keyboard support**: All swipe actions accessible via keyboard
- **Screen readers**: Proper ARIA labels and descriptions
- **Focus management**: Clear focus indicators

### **User Experience**
- **Visual feedback**: Immediate response to user actions
- **Haptic feedback**: Tactile confirmation of actions
- **Error prevention**: Confirmation dialogs for destructive actions
- **Performance**: Smooth animations without lag

### **Development**
- **Type safety**: Full TypeScript support
- **Reusability**: Generic components for different data types
- **Customization**: Flexible styling and behavior options
- **Testing**: Comprehensive test coverage

## Troubleshooting

### **Common Issues**

1. **Swipe not working on mobile**
   - Check if `react-responsive` is installed
   - Verify mobile breakpoint (640px)
   - Ensure touch events are not blocked

2. **Haptic feedback not working**
   - Check browser support (Android/iOS)
   - Verify device has vibration capability
   - Test on physical device (not emulator)

3. **Visual feedback not showing**
   - Check if `isMobile` is true
   - Verify CSS classes are applied
   - Check z-index layering

### **Debug Mode**

```typescript
// Enable debug logging
const { dragProps, isMobile } = useSwipeActions({
  onSwipeLeft: () => console.log('Swipe left'),
  onSwipeRight: () => console.log('Swipe right'),
});

console.log('Is mobile:', isMobile);
```

## Conclusion

The swipe actions implementation provides a modern, mobile-first user experience with comprehensive haptic feedback and visual indicators. The modular design allows for easy integration into existing components while maintaining excellent performance and accessibility standards. 