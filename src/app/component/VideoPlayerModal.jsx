'use client';

import React from 'react';

export default function VideoPlayerModal({ videoUrl, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg overflow-hidden max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-bold text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="relative pb-[56.25%]">
          <iframe
            src={videoUrl}
            title="Video Player"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
