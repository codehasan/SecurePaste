import React, { ForwardedRef, forwardRef } from 'react';

interface LoadingModalProps {
  title?: string;
  message: string;
  onClose?: () => void;
}

const LoadingModal = forwardRef(function LoadingModal(
  { title, message, onClose }: LoadingModalProps,
  reference: ForwardedRef<HTMLDialogElement>
) {
  return (
    <dialog ref={reference} className="modal">
      <div className="modal-box">
        {title && <h3 className="font-bold text-lg">{title}</h3>}
        <div className="flex flex-col items-center py-4">
          <span className="mb-3">{message}</span>
          <span className="loading loading-bars loading-lg" />
        </div>
        {onClose && (
          <div className="modal-action mt-2">
            <form method="dialog">
              <button className="btn mr-2" onClick={onClose}>
                Close
              </button>
            </form>
          </div>
        )}
      </div>
    </dialog>
  );
});

export const MemoizedLoadingModal = React.memo(LoadingModal);
