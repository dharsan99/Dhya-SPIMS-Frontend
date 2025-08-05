import React from 'react';
import { motion } from 'framer-motion';
import { useSwipeActions } from '../hooks/useSwipeActions';

interface SwipeableListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onSwipeLeft?: (item: T) => void;
  onSwipeRight?: (item: T) => void;
  leftActionLabel?: string;
  rightActionLabel?: string;
  className?: string;
  emptyMessage?: string;
}

const SwipeableList = <T extends object>({
  items,
  renderItem,
  onSwipeLeft,
  onSwipeRight,
  leftActionLabel = 'Delete',
  rightActionLabel = 'Edit',
  className = '',
  emptyMessage = 'No items found',
}: SwipeableListProps<T>) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.length > 0 ? (
        items.map((item, index) => (
          <SwipeableListItem
            key={index}
            item={item}
            renderItem={renderItem}
            onSwipeLeft={onSwipeLeft ? () => onSwipeLeft(item) : undefined}
            onSwipeRight={onSwipeRight ? () => onSwipeRight(item) : undefined}
            leftActionLabel={leftActionLabel}
            rightActionLabel={rightActionLabel}
            index={index}
          />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

interface SwipeableListItemProps<T> {
  item: T;
  renderItem: (item: T, index: number) => React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftActionLabel: string;
  rightActionLabel: string;
  index: number;
}

const SwipeableListItem = <T extends object>({
  item,
  renderItem,
  onSwipeLeft,
  onSwipeRight,
  leftActionLabel,
  rightActionLabel,
  index,
}: SwipeableListItemProps<T>) => {
  const { dragProps, getSwipeStyle, getSwipeVisuals } = useSwipeActions({
    onSwipeLeft,
    onSwipeRight,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm relative"
      drag={dragProps.drag}
      dragConstraints={dragProps.dragConstraints}
      dragElastic={dragProps.dragElastic}
      onDrag={dragProps.onDrag}
      onDragEnd={dragProps.onDragEnd}
      style={getSwipeStyle()}
    >
      {/* Swipe Action Visuals */}
      {getSwipeVisuals(leftActionLabel, rightActionLabel)}

      {/* Item Content */}
      <div className="relative z-20 bg-white dark:bg-gray-800">
        {renderItem(item, index)}
      </div>
    </motion.div>
  );
};

export default SwipeableList; 