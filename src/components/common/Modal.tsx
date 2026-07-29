import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  children,
}: ModalProps) {

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        p-4
      "
      onClick={onClose}
    >

      <div
        className="
          relative
          max-h-[90vh]
          w-full
          max-w-3xl
          overflow-y-auto
          rounded-3xl
          bg-white
          shadow-2xl
        "
        onClick={(event) => event.stopPropagation()}
      >

        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-5
            top-5
            z-20
            rounded-full
            bg-black/10
            p-2
            transition
            hover:bg-black/20
          "
          aria-label="Close modal"
        >
          <X size={20} />
        </button>


        {children}

      </div>

    </div>
  );
}