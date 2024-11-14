import React, { useState } from "react";

type ConfirmAlertProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  children?: React.ReactNode;
};

const ConfirmAlert: React.FC<ConfirmAlertProps> = ({
  isOpen,
  title,
  onClose,
  onConfirm,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg">
        <p className="text-lg mb-4">{title}</p>
        {children}
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 rounded text-white bg-red-500 hover:bg-red-700"
            onClick={onConfirm}
          >
            Sim
          </button>
          <button
            className="px-4 py-2 rounded text-black bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            Não
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAlert;
