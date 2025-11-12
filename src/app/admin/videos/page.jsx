'use client';
import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaPlay, FaEdit } from 'react-icons/fa';

export default function VideosManagement() {
  const [videos, setVideos] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    if (selectedPackage) {
      fetchPackageVideos(selectedPackage);
    }
  }, [selectedPackage]);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      const data = await response.json();
      setPackages(data);
      if (data.length > 0) {
        setSelectedPackage(data[0].id.toString());
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackageVideos = async (packageId) => {
    try {
      const response = await fetch(`/api/packages/${packageId}/videos`);
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  };

  const addVideo = async () => {
    if (!newVideoUrl.trim() || !selectedPackage) return;

    try {
      const response = await fetch(`/api/packages/${selectedPackage}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video: newVideoUrl.trim() })
      });

      if (response.ok) {
        setNewVideoUrl('');
        fetchPackageVideos(selectedPackage);
        setMessage('Video added successfully');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to add video');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Failed to add video:', error);
      setMessage('Failed to add video');
      setMessageType('error');
    }
  };

  const removeVideo = async (videoId) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const response = await fetch(`/api/packages/${selectedPackage}/videos/${videoId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchPackageVideos(selectedPackage);
        setMessage('Video deleted successfully');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to delete video');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Failed to delete video:', error);
      setMessage('Failed to delete video');
      setMessageType('error');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Videos Management</h1>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* Package Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Package</label>
        <select
          value={selectedPackage}
          onChange={(e) => setSelectedPackage(e.target.value)}
          className="border border-gray-300 rounded-md shadow-sm p-2 w-full max-w-md"
        >
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name} ({pkg.slug})
            </option>
          ))}
        </select>
      </div>

      {/* Add Video Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Video</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="url"
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
            placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)"
            className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
          />
          <button
            onClick={addVideo}
            disabled={!newVideoUrl.trim()}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Video</span>
          </button>
        </div>
      </div>

      {/* Videos List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Videos for {packages.find(p => p.id.toString() === selectedPackage)?.name || 'Selected Package'} ({videos.length})
          </h2>
        </div>

        {videos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No videos found for this package. Add some videos above.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {videos.map((video) => (
              <div key={video.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <FaPlay className="text-cyan-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {video.video}
                    </p>
                    <p className="text-xs text-gray-500">
                      Added: {new Date(video.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={video.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 hover:text-cyan-900 p-2"
                    title="Watch Video"
                  >
                    <FaPlay className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => removeVideo(video.id)}
                    className="text-red-600 hover:text-red-900 p-2"
                    title="Delete Video"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
