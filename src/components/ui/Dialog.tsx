// src/components/ui/Dialog.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string; // tailwind class like 'max-w-3xl' or 'max-w-xl'
}

export const TailwindDialog = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}: Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-8 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${maxWidth} transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all`}
              >
                {title && (
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                    {title}
                  </Dialog.Title>
                )}
                <div>{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};