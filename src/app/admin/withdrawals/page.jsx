'use client';
import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEye, FaMoneyBillWave } from 'react-icons/fa';

export default function WithdrawalsManagement() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const response = await fetch('/api/admin/withdrawals');
      if (!response.ok) {
        throw new Error('Failed to fetch withdrawals');
      }
      const data = await response.json();
      setWithdrawals(data);
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawal) => {
    if (!confirm('Are you sure you want to approve this withdrawal request?')) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: withdrawal.id,
          action: 'approve'
        })
      });

      if (response.ok) {
        setMessage('Withdrawal request approved successfully');
        setMessageType('success');
        fetchWithdrawals();
      } else {
        throw new Error('Failed to approve withdrawal');
      }
    } catch (error) {
      console.error('Failed to approve withdrawal:', error);
      setMessage('Failed to approve withdrawal');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (withdrawal) => {
    if (!confirm('Are you sure you want to reject this withdrawal request? The amount will be refunded to the user\'s wallet.')) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: withdrawal.id,
          action: 'reject'
        })
      });

      if (response.ok) {
        setMessage('Withdrawal request rejected and amount refunded to user wallet');
        setMessageType('success');
        fetchWithdrawals();
      } else {
        throw new Error('Failed to reject withdrawal');
      }
    } catch (error) {
      console.error('Failed to reject withdrawal:', error);
      setMessage('Failed to reject withdrawal');
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

  const getMethodBadge = (method) => {
    return method === 'UPI' ?
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">UPI</span> :
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Bank Transfer</span>;
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Withdrawal Requests Management</h1>
        <p className="text-gray-600 mt-2">Review and manage user withdrawal requests</p>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {withdrawals.map((withdrawal) => (
              <tr key={withdrawal.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {withdrawal.photo ? (
                        <img className="h-10 w-10 rounded-full" src={withdrawal.photo} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {withdrawal.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{withdrawal.username}</div>
                      <div className="text-sm text-gray-500">{withdrawal.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{withdrawal.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getMethodBadge(withdrawal.method)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(withdrawal.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(withdrawal.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setSelectedWithdrawal(withdrawal);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  {withdrawal.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(withdrawal)}
                        disabled={isSubmitting}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleReject(withdrawal)}
                        disabled={isSubmitting}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
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
        {withdrawals.map((withdrawal) => (
          <div key={withdrawal.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  {withdrawal.photo ? (
                    <img className="h-10 w-10 rounded-full" src={withdrawal.photo} alt="" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {withdrawal.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{withdrawal.username}</h3>
                  <p className="text-sm text-gray-500">{withdrawal.email}</p>
                  <p className="text-sm text-gray-600">₹{withdrawal.amount}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getMethodBadge(withdrawal.method)}
                {getStatusBadge(withdrawal.status)}
                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      setSelectedWithdrawal(withdrawal);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 p-2"
                    title="View Details"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  {withdrawal.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(withdrawal)}
                        disabled={isSubmitting}
                        className="text-green-600 hover:text-green-900 p-2 disabled:opacity-50"
                        title="Approve"
                      >
                        <FaCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(withdrawal)}
                        disabled={isSubmitting}
                        className="text-red-600 hover:text-red-900 p-2 disabled:opacity-50"
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
              <span className="font-medium">Date:</span> {new Date(withdrawal.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {showModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Withdrawal Request Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedWithdrawal.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedWithdrawal.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedWithdrawal.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedWithdrawal.state || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Referral Code</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedWithdrawal.referral_code}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sponsor Code</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedWithdrawal.sponsor_code || 'None'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="mt-1 text-sm text-gray-900">₹{selectedWithdrawal.amount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Method</label>
                  <p className="mt-1">{getMethodBadge(selectedWithdrawal.method)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1">{getStatusBadge(selectedWithdrawal.status)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Wallet Balance</label>
                  <p className="mt-1 text-sm text-gray-900">₹{selectedWithdrawal.balance || '0.00'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Earned</label>
                  <p className="mt-1 text-sm text-gray-900">₹{selectedWithdrawal.total_earned || '0.00'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Withdrawn</label>
                  <p className="mt-1 text-sm text-gray-900">₹{selectedWithdrawal.total_withdrawn || '0.00'}</p>
                </div>
              </div>

              {selectedWithdrawal.method === 'UPI' && selectedWithdrawal.upi_id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">UPI ID</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedWithdrawal.upi_id}</p>
                </div>
              )}

              {selectedWithdrawal.method === 'Bank' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Number</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedWithdrawal.account_number}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedWithdrawal.bank_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedWithdrawal.ifsc_code}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Request Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedWithdrawal.created_at).toLocaleString()}
                </p>
              </div>
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
    </div>
  );
}
