import React, { useRef, ReactElement } from 'react';
import { useMediaQuery } from 'react-responsive';
import { HapticFeedback } from '../utils/hapticFeedback';

interface UseSwipeActionsProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  enabled?: boolean;
}

export const useSwipeActions = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  enabled = true,
}: UseSwipeActionsProps) => {
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const dragX = useRef(0);
  const isEnabled = enabled && isMobile;

  const dragProps = {
    drag: isEnabled ? 'x' as const : false,
    dragConstraints: isEnabled ? { left: -160, right: 160 } : undefined,
    dragElastic: 0.2,
    onDrag: (_e: any, info: any) => {
      dragX.current = info.offset.x;
      if (Math.abs(info.offset.x) > 20) {
        HapticFeedback.swipe();
      }
    },
    onDragEnd: (_e: any, info: any) => {
      if (!isEnabled) return;
      if (info.offset.x < -threshold && onSwipeLeft) {
        HapticFeedback.delete();
        onSwipeLeft();
      } else if (info.offset.x > threshold && onSwipeRight) {
        HapticFeedback.edit();
        onSwipeRight();
      }
    },
  };

  const getSwipeStyle = () => {
    if (!isEnabled) return {};
    return {
      x: 0,
      background:
        dragX.current < -20
          ? 'linear-gradient(90deg, #fee2e2 60%, #fff 100%)'
          : dragX.current > 20
          ? 'linear-gradient(270deg, #fef9c3 60%, #fff 100%)'
          : undefined,
    };
  };

  const getSwipeVisuals = (leftAction: string, rightAction: string): ReactElement | null => {
    if (!isEnabled) return null;
    
    return React.createElement('div', {
      className: "absolute inset-0 flex items-center justify-between pointer-events-none z-10"
    }, [
      React.createElement('div', {
        key: 'right',
        className: "flex items-center pl-4",
        style: { opacity: dragX.current > 20 ? Math.min(dragX.current / 80, 1) : 0 }
      }, [
        React.createElement('span', {
          key: 'right-text',
          className: "text-yellow-700 font-semibold"
        }, rightAction)
      ]),
      React.createElement('div', {
        key: 'left',
        className: "flex items-center pr-4",
        style: { opacity: dragX.current < -20 ? Math.min(-dragX.current / 80, 1) : 0 }
      }, [
        React.createElement('span', {
          key: 'left-text',
          className: "text-red-700 font-semibold"
        }, leftAction)
      ])
    ]);
  };

  return {
    dragProps,
    getSwipeStyle,
    getSwipeVisuals,
    isMobile,
    dragX: dragX.current,
  };
}; 