'use client';
import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaPlay } from 'react-icons/fa';

export default function PackagesManagement() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    subtitle: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    features: [],
    slug: '',
    videos: []
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [currentPackageVideos, setCurrentPackageVideos] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackageVideos = async (packageId) => {
    try {
      const response = await fetch(`/api/packages/${packageId}/videos`);
      const videos = await response.json();
      setCurrentPackageVideos(videos);
    } catch (error) {
      console.error('Failed to fetch package videos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;

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

      const url = editingPackage ? `/api/packages` : '/api/packages';
      const method = editingPackage ? 'PUT' : 'POST';
      const body = editingPackage ? { ...formData, id: editingPackage.id, image: imageUrl } : { ...formData, image: imageUrl };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        fetchPackages();
        setShowModal(false);
        resetForm();
        setMessage(editingPackage ? 'Package updated successfully' : 'Package added successfully');
        setMessageType('success');
      }
    } catch (error) {
      console.error('Failed to save package:', error);
      setMessage('Failed to save package');
      setMessageType('error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const response = await fetch(`/api/packages?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPackages();
        setMessage('Package deleted successfully');
        setMessageType('success');
      }
    } catch (error) {
      console.error('Failed to delete package:', error);
      setMessage('Failed to delete package');
      setMessageType('error');
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      title: pkg.title,
      subtitle: pkg.subtitle,
      description: pkg.description,
      price: pkg.price,
      originalPrice: pkg.originalPrice,
      image: pkg.image,
      features: Array.isArray(pkg.features) ? pkg.features : JSON.parse(pkg.features || '[]'),
      slug: pkg.slug,
      videos: pkg.videos || []
    });
    setSelectedFile(null);
    setCurrentPackageVideos(pkg.videos || []);
    setShowModal(true);
    setMessage('');
    setMessageType('');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      subtitle: '',
      description: '',
      price: '',
      originalPrice: '',
      image: '',
      features: [],
      slug: '',
      videos: []
    });
    setEditingPackage(null);
    setSelectedFile(null);
    setCurrentPackageVideos([]);
    setNewVideoUrl('');
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addVideo = async () => {
    if (!newVideoUrl.trim()) return;

    try {
      const response = await fetch(`/api/packages/${editingPackage.id}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video: newVideoUrl.trim() })
      });

      if (response.ok) {
        setNewVideoUrl('');
        fetchPackageVideos(editingPackage.id);
        setMessage('Video added successfully');
        setMessageType('success');
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
      const response = await fetch(`/api/packages/${editingPackage.id}/videos/${videoId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchPackageVideos(editingPackage.id);
        setMessage('Video deleted successfully');
        setMessageType('success');
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
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Packages Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
            setMessage('');
            setMessageType('');
          }}
          className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <FaPlus />
          <span>Add Package</span>
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Videos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packages.map((pkg) => (
              <tr key={pkg.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.videos?.length || 0} videos</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{pkg.name}</h3>
                <p className="text-sm text-gray-500">{pkg.slug}</p>
                <p className="text-sm text-gray-600">{pkg.videos?.length || 0} videos</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="text-indigo-600 hover:text-indigo-900 p-2"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="text-red-600 hover:text-red-900 p-2"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Price:</span> {pkg.price}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-white">{editingPackage ? 'Edit Package' : 'Add Package'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white">Price</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">Original Price</label>
                  <input
                    type="text"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white">Image Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                />
                {selectedFile && (
                  <p className="mt-1 text-sm text-green-400">New file selected: {selectedFile.name}</p>
                )}
                {formData.image && !selectedFile && (
                  <div className="mt-2 hidden lg:block">
                    <p className="text-sm text-gray-300 mb-2">Current image:</p>
                    <img
                      src={formData.image}
                      alt="Current package image"
                      className="max-w-32 max-h-32 object-cover rounded border border-gray-600"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Features</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white"
                      placeholder="Feature description"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-cyan-600 hover:text-cyan-900 text-sm"
                >
                  + Add Feature
                </button>
              </div>

              {/* Videos Section */}
              {editingPackage && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Videos</label>
                  <div className="space-y-2 mb-4">
                    {currentPackageVideos.map((video) => (
                      <div key={video.id} className="flex items-center space-x-2 p-2 bg-gray-700 rounded">
                        <FaPlay className="text-cyan-400" />
                        <span className="flex-1 text-white text-sm truncate">{video.video}</span>
                        <button
                          type="button"
                          onClick={() => removeVideo(video.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="Enter YouTube video URL"
                      className="flex-1 border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white"
                    />
                    <button
                      type="button"
                      onClick={addVideo}
                      className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
                    >
                      Add Video
                    </button>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all"
                >
                  {editingPackage ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
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
