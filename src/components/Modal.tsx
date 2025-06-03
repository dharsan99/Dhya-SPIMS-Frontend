// src/components/Modal.tsx
const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  };
  
  export default Modal;