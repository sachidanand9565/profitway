'use client';
import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEye, FaImage } from 'react-icons/fa';

export default function PurchasesManagement() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalData, setApprovalData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchases');
      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (purchase) => {
    setSelectedPurchase(purchase);
    setApprovalData({
      username: `user_${purchase.id}_${Date.now().toString().slice(-4)}`,
      password: Math.random().toString(36).slice(-8)
    });
    setShowApprovalModal(true);
  };

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to reject this purchase?')) return;

    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'reject' })
      });

      if (response.ok) {
        setMessage('Purchase rejected successfully');
        setMessageType('success');
        fetchPurchases();
      } else {
        throw new Error('Failed to reject purchase');
      }
    } catch (error) {
      console.error('Failed to reject purchase:', error);
      setMessage('Failed to reject purchase');
      setMessageType('error');
    }
  };

  const submitApproval = async () => {
    if (!approvalData.username || !approvalData.password) {
      alert('Please provide username and password');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPurchase.id,
          action: 'approve',
          username: approvalData.username,
          password: approvalData.password
        })
      });
console.log(response);

      if (response.ok) {
        setMessage('Purchase approved and user account created successfully');
        setMessageType('success');
        setShowApprovalModal(false);
        setSelectedPurchase(null);
        fetchPurchases();
      } else {
        throw new Error('Failed to approve purchase');
      }
    } catch (error) {
      console.error('Failed to approve purchase:', error);
      setMessage('Failed to approve purchase');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Purchases Management</h1>
        <p className="text-gray-600 mt-2">Review and manage package purchases</p>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchases.map((purchase) => (
              <tr key={purchase.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{purchase.name}</div>
                  <div className="text-sm text-gray-500">{purchase.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.packagetitle}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{purchase.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(purchase.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(purchase.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPurchase(purchase);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  {purchase.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(purchase)}
                        className="text-green-600 hover:text-green-900"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleReject(purchase.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{purchase.name}</h3>
                <p className="text-sm text-gray-500">{purchase.email}</p>
                <p className="text-sm text-gray-600">{purchase.packagetitle}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(purchase.status)}
                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      setSelectedPurchase(purchase);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 p-2"
                    title="View Details"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  {purchase.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(purchase)}
                        className="text-green-600 hover:text-green-900 p-2"
                        title="Approve"
                      >
                        <FaCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(purchase.id)}
                        className="text-red-600 hover:text-red-900 p-2"
                        title="Reject"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Amount:</span> ₹{purchase.price} |
              <span className="font-medium"> Date:</span> {new Date(purchase.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {showModal && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Purchase Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPurchase.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPurchase.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPurchase.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Package</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPurchase.packagetitle}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="mt-1 text-sm text-gray-900">₹{selectedPurchase.price}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">UTR Number</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPurchase.utr_no}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPurchase.state}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1">{getStatusBadge(selectedPurchase.status)}</p>
                </div>
              </div>
              {selectedPurchase.image && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Screenshot</label>
                  <div className="border rounded p-2 bg-gray-50">
                    <img
                      src={selectedPurchase.image}
                      alt="Payment Screenshot"
                      className="max-w-full h-auto rounded border"
                      style={{ maxHeight: '400px', objectFit: 'contain' }}
                      onError={(e) => {
                        console.error('Image failed to load:', selectedPurchase.image);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{ display: 'none' }} className="text-red-500 text-sm mt-2">
                      Failed to load image. The image file might be missing or corrupted.
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Approve Purchase</h2>
            <p className="mb-4 text-gray-600">
              Create user account for {selectedPurchase.name} ({selectedPurchase.email})
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={approvalData.username}
                  onChange={(e) => setApprovalData(prev => ({ ...prev, username: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="text"
                  value={approvalData.password}
                  onChange={(e) => setApprovalData(prev => ({ ...prev, password: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={submitApproval}
                disabled={isSubmitting}
                className={`px-4 py-2 text-white rounded ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {isSubmitting ? 'Processing...' : 'Approve & Create Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
