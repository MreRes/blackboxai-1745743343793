import { useState, useCallback, useEffect } from 'react';

interface UseModalProps {
  onClose?: () => void;
  onOpen?: () => void;
  initialState?: boolean;
}

export function useModal({
  onClose,
  onOpen,
  initialState = false,
}: UseModalProps = {}) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore scrolling when modal is closed
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOpen = useCallback(() => {
    if (!isOpen && !isAnimating) {
      setIsAnimating(true);
      setIsOpen(true);
      onOpen?.();

      // Animation timing
      setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match this with your CSS transition duration
    }
  }, [isOpen, isAnimating, onOpen]);

  const handleClose = useCallback(() => {
    if (isOpen && !isAnimating) {
      setIsAnimating(true);
      setIsOpen(false);
      onClose?.();

      // Animation timing
      setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match this with your CSS transition duration
    }
  }, [isOpen, isAnimating, onClose]);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // Only close if clicking the backdrop itself, not its children
      if (event.target === event.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  return {
    isOpen,
    isAnimating,
    handleOpen,
    handleClose,
    handleBackdropClick,
  };
}

// Usage example:
/*
import { useModal } from '@/hooks/useModal';

const MyComponent = () => {
  const {
    isOpen,
    isAnimating,
    handleOpen,
    handleClose,
    handleBackdropClick,
  } = useModal({
    onClose: () => {
      // Optional: Do something when modal closes
      console.log('Modal closed');
    },
    onOpen: () => {
      // Optional: Do something when modal opens
      console.log('Modal opened');
    },
  });

  return (
    <>
      <Button onClick={handleOpen}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        onBackdropClick={handleBackdropClick}
      >
        <div className={`
          transform transition-all duration-300
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}>
          {/* Modal content *\/}
          <h2>Modal Title</h2>
          <p>Modal content goes here...</p>
          <Button onClick={handleClose}>Close</Button>
        </div>
      </Modal>
    </>
  );
};

// Modal component example:
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackdropClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}

const Modal = ({
  isOpen,
  onClose,
  onBackdropClick,
  children,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex min-h-screen items-center justify-center p-4 text-center"
      >
        {/* Backdrop *\/}
        <div
          className={`
            fixed inset-0 bg-black bg-opacity-50
            transition-opacity duration-300
            ${isOpen ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={onBackdropClick}
          aria-hidden="true"
        />

        {/* Modal panel *\/}
        <div
          className={`
            relative z-50 w-full max-w-md transform overflow-hidden
            rounded-lg bg-white p-6 text-left shadow-xl
            transition-all duration-300
            ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
*/
