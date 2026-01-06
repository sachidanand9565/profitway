'use client';
import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaPlay, FaFolder, FaVideo } from 'react-icons/fa';

export default function CoursesManagement() {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modules, setModules] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [moduleFormData, setModuleFormData] = useState({
    title: '',
    description: '',
    orderIndex: 0
  });
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    videoUrl: '',
    image: '',
    description: '',
    orderIndex: 0
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      const data = await response.json();
      setPackages(data);
      if (data.length > 0 && !selectedPackage) {
        setSelectedPackage(data[0]);
        fetchModules(data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async (packageId) => {
    try {
      const response = await fetch(`/api/modules?packageId=${packageId}`);
      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    }
  };

  const fetchVideos = async (moduleId) => {
    try {
      const response = await fetch(`/api/videos?moduleId=${moduleId}`);
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    fetchModules(pkg.id);
    setVideos([]);
  };

  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingModule ? `/api/modules` : '/api/modules';
      const method = editingModule ? 'PUT' : 'POST';
      const body = editingModule
        ? { ...moduleFormData, id: editingModule.id }
        : { ...moduleFormData, packageId: selectedPackage.id };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        fetchModules(selectedPackage.id);
        setShowModuleModal(false);
        resetModuleForm();
        setMessage(editingModule ? 'Module updated successfully' : 'Module added successfully');
        setMessageType('success');
      }
    } catch (error) {
      console.error('Failed to save module:', error);
      setMessage('Failed to save module');
      setMessageType('error');
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = videoFormData.image;

      // Upload file if selected
      if (selectedFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', selectedFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        } else {
          setMessage('Failed to upload image');
          setMessageType('error');
          return;
        }
      }

      const url = editingVideo ? `/api/videos` : '/api/videos';
      const method = editingVideo ? 'PUT' : 'POST';
      const body = editingVideo
        ? { ...videoFormData, id: editingVideo.id, image: imageUrl }
        : { ...videoFormData, moduleId: editingModule.id, image: imageUrl };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        fetchVideos(editingModule.id);
        setShowVideoModal(false);
        resetVideoForm();
        setMessage(editingVideo ? 'Video updated successfully' : 'Video added successfully');
        setMessageType('success');
      }
    } catch (error) {
      console.error('Failed to save video:', error);
      setMessage('Failed to save video');
      setMessageType('error');
    }
  };

  const handleDeleteModule = async (id) => {
    if (!confirm('Are you sure you want to delete this module? All videos in this module will also be deleted.')) return;

    try {
      const response = await fetch(`/api/modules?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchModules(selectedPackage.id);
        setVideos([]);
        setMessage('Module deleted successfully');
        setMessageType('success');
      }
    } catch (error) {
      console.error('Failed to delete module:', error);
      setMessage('Failed to delete module');
      setMessageType('error');
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const response = await fetch(`/api/videos?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchVideos(editingModule.id);
        setMessage('Video deleted successfully');
        setMessageType('success');
      }
    } catch (error) {
      console.error('Failed to delete video:', error);
      setMessage('Failed to delete video');
      setMessageType('error');
    }
  };

  const handleEditModule = (module) => {
    setEditingModule(module);
    setModuleFormData({
      title: module.title,
      description: module.description || '',
      orderIndex: module.order_index || 0
    });
    setShowModuleModal(true);
    setMessage('');
    setMessageType('');
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setVideoFormData({
      title: video.title,
      videoUrl: video.video_url,
      image: video.image || '',
      description: video.description || '',
      orderIndex: video.order_index || 0
    });
    setSelectedFile(null);
    setShowVideoModal(true);
    setMessage('');
    setMessageType('');
  };

  const handleAddVideo = (module) => {
    setEditingModule(module);
    setEditingVideo(null);
    resetVideoForm();
    setShowVideoModal(true);
  };

  const resetModuleForm = () => {
    setModuleFormData({
      title: '',
      description: '',
      orderIndex: 0
    });
    setEditingModule(null);
  };

  const resetVideoForm = () => {
    setVideoFormData({
      title: '',
      videoUrl: '',
      image: '',
      description: '',
      orderIndex: 0
    });
    setEditingVideo(null);
    setSelectedFile(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Course Management</h1>

      {message && (
        <div className={`mb-4 p-4 rounded ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Packages List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Courses/Packages</h2>
          <div className="space-y-2">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => handlePackageSelect(pkg)}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedPackage?.id === pkg.id
                    ? 'bg-blue-100 border-blue-300 border'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <h3 className="font-medium">{pkg.name}</h3>
                <p className="text-sm text-gray-600">{pkg.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modules List */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Modules</h2>
            {selectedPackage && (
              <button
                onClick={() => {
                  resetModuleForm();
                  setShowModuleModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <FaPlus /> Add Module
              </button>
            )}
          </div>
          {selectedPackage ? (
            <div className="space-y-2">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="p-3 bg-gray-50 rounded border"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium flex items-center gap-2">
                        <FaFolder className="text-blue-600" />
                        {module.title}
                      </h3>
                      {module.description && (
                        <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {module.videos?.length || 0} videos
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingModule(module);
                          fetchVideos(module.id);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View Videos"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleAddVideo(module)}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Add Video"
                      >
                        <FaVideo />
                      </button>
                      <button
                        onClick={() => handleEditModule(module)}
                        className="text-yellow-600 hover:text-yellow-800 p-1"
                        title="Edit Module"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete Module"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {modules.length === 0 && (
                <p className="text-gray-500 text-center py-4">No modules found. Add a module to get started.</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Select a course to view modules.</p>
          )}
        </div>

        {/* Videos List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Videos</h2>
          {editingModule ? (
            <div className="space-y-2">
              <h3 className="font-medium text-lg mb-4">{editingModule.title} - Videos</h3>
              {videos.map((video) => (
                <div key={video.id} className="p-3 bg-gray-50 rounded border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium flex items-center gap-2">
                        <FaPlay className="text-red-600" />
                        {video.title}
                      </h4>
                      {video.description && (
                        <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditVideo(video)}
                        className="text-yellow-600 hover:text-yellow-800 p-1"
                        title="Edit Video"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete Video"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {videos.length === 0 && (
                <p className="text-gray-500 text-center py-4">No videos found. Add a video to get started.</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Select a module to view videos.</p>
          )}
        </div>
      </div>

      {/* Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingModule ? 'Edit Module' : 'Add Module'}
            </h3>
            <form onSubmit={handleModuleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={moduleFormData.title}
                  onChange={(e) => setModuleFormData({...moduleFormData, title: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={moduleFormData.description}
                  onChange={(e) => setModuleFormData({...moduleFormData, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Order</label>
                <input
                  type="number"
                  value={moduleFormData.orderIndex}
                  onChange={(e) => setModuleFormData({...moduleFormData, orderIndex: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingModule ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingVideo ? 'Edit Video' : 'Add Video'}
            </h3>
            <form onSubmit={handleVideoSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={videoFormData.title}
                  onChange={(e) => setVideoFormData({...videoFormData, title: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Video URL</label>
                <input
                  type="url"
                  value={videoFormData.videoUrl}
                  onChange={(e) => setVideoFormData({...videoFormData, videoUrl: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Thumbnail Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full p-2 border rounded"
                />
                {videoFormData.image && (
                  <p className="text-sm text-gray-600 mt-1">Current: {videoFormData.image}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={videoFormData.description}
                  onChange={(e) => setVideoFormData({...videoFormData, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Order</label>
                <input
                  type="number"
                  value={videoFormData.orderIndex}
                  onChange={(e) => setVideoFormData({...videoFormData, orderIndex: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingVideo ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}