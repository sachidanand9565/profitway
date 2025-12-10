'use client';

import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress, FaTimes } from 'react-icons/fa';

export default function VideoPlayerModal({ videoUrl, onClose }) {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Function to extract YouTube video ID
  const getYouTubeId = (url) => {
    if (!url) return null;

    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(videoUrl);

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      fs: 0,
      disablekb: 1,
      cc_load_policy: 0,
      hl: 'en',
      playsinline: 1,
      origin: typeof window !== 'undefined' ? window.location.origin : '',
      widget_referrer: typeof window !== 'undefined' ? window.location.href : '',
      enablejsapi: 1,
      host: 'https://www.youtube.com',
      // Additional parameters to hide YouTube branding
      branding: 0,
      showsearch: 0,
      autohide: 1,
      wmode: 'opaque',
      version: 3,
      // Hide title and share completely
      title: '',
      byline: '',
      portrait: '',
      color: 'white',
      theme: 'dark',
      playlist: '',
      // Prevent any external links
      noCookie: false,
      annotations: false,
      // Additional privacy and branding controls
      privacy: 1,
      showshare: 0,
      showlogo: 0,
      showembed: 0,
      showrelated: 0,
    },
  };

  const onReady = (event) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
  };

  const onStateChange = (event) => {
    setIsPlaying(event.data === 1);
  };

  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const toggleMute = () => {
    if (player) {
      if (isMuted) {
        player.unMute();
        setIsMuted(false);
      } else {
        player.mute();
        setIsMuted(true);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
      setIsMuted(newVolume === '0');
    }
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    if (player) {
      player.seekTo(newTime);
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Update current time periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (player && isPlaying) {
        setCurrentTime(player.getCurrentTime());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [player, isPlaying]);

  if (!videoId) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-lg p-8 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Invalid Video URL</h3>
            <p className="text-gray-600 mb-4">The video URL is not supported or invalid.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 ${isFullscreen ? 'p-0' : 'p-4'}`} onClick={onClose}>
      <div
        className={`bg-black rounded-lg overflow-hidden shadow-2xl ${isFullscreen ? 'w-full h-full' : 'max-w-5xl w-full max-h-[80vh]'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900 to-black">
          <h3 className="text-white font-semibold">Course Video</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-blue-400 transition-colors p-2"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-red-400 transition-colors p-2"
              title="Close"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative bg-black">
          <div className="aspect-video">
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={onReady}
              onStateChange={onStateChange}
              className="w-full h-full"
            />
          </div>

          {/* Custom Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleProgressChange}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-blue-400 transition-colors p-2"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-blue-400 transition-colors p-2"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Time Display */}
                <div className="text-white text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              {/* Additional Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-blue-400 transition-colors p-2 hidden md:block"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
