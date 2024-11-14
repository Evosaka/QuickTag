import React from "react";

interface SpinProps {
  msg: string;
}

export default function Spin({ msg }: SpinProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      {/* Spinner */}
      <div className="flex flex-col items-center justify-center">
        <div
          className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-700 rounded-full"
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">Carregando, aguarde...</span>
        </div>

        {/* Mensagem */}
        <div className="mt-3 text-center">
          <p className="text-sm font-medium text-gray-700">{msg}</p>
        </div>
      </div>
    </div>
  );
}
