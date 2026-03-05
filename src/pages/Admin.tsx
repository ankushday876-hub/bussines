import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button, Input, Card } from '../components/ui';
import { formatCurrency } from '../lib/utils';
import { Lock, Users, Package, TrendingUp, Bell, CreditCard, Edit2, Save, X } from 'lucide-react';

export default function AdminPage() {
  const { isAdmin, loginAdmin, logoutAdmin, entries, userProfile, adminSettings, updateAdminSettings } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  // Payment Settings State
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    upiId: '',
    premiumPrice: '',
  });

  // Notification State
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(email)) {
      setError('');
    } else {
      setError('Invalid admin email');
    }
  };

  const startEditingPayment = () => {
    setPaymentForm({
      upiId: adminSettings?.upiId || '',
      premiumPrice: adminSettings?.premiumPrice?.toString() || '0',
    });
    setIsEditingPayment(true);
  };

  const savePaymentSettings = () => {
    updateAdminSettings({
      upiId: paymentForm.upiId,
      premiumPrice: parseFloat(paymentForm.premiumPrice) || 0,
    });
    setIsEditingPayment(false);
  };

  const sendNotification = () => {
    if (!notificationMessage.trim()) {
      alert('Please enter a message to send.');
      return;
    }
    alert(`Notification sent to all users:\n\n"${notificationMessage}"`);
    setNotificationMessage('');
  };

  if (!isAdmin) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-500 mt-2">Enter your admin email to continue</p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                required
              />
              <Button type="submit" fullWidth>
                Access Dashboard
              </Button>
            </form>
          </Card>
          
          <div className="text-center text-xs text-gray-400">
            Hint: ankushday51@gmail.com
          </div>
        </div>
      </div>
    );
  }

  const totalUsers = 1; // Local app, so just 1 user
  const totalEntries = entries.length;
  const totalProfit = entries.reduce((acc, curr) => acc + curr.profit, 0);
  const totalLoss = entries.reduce((acc, curr) => (curr.profit < 0 ? acc + Math.abs(curr.profit) : acc), 0);

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-xs text-gray-500">Overview & Controls</p>
        </div>
        <Button variant="ghost" size="sm" onClick={logoutAdmin}>
          Logout
        </Button>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center space-y-2">
          <Users className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-2xl font-bold">{totalUsers}</p>
            <p className="text-xs text-gray-500">Total Users</p>
          </div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center space-y-2">
          <Package className="w-6 h-6 text-purple-500" />
          <div>
            <p className="text-2xl font-bold">{totalEntries}</p>
            <p className="text-xs text-gray-500">Product Entries</p>
          </div>
        </Card>
      </div>

      <Card className="p-5 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-none">
        <div className="flex items-center space-x-3 mb-2">
          <TrendingUp className="w-5 h-5 text-indigo-200" />
          <span className="text-indigo-100 text-sm font-medium">Total Net Profit Recorded</span>
        </div>
        <p className="text-3xl font-bold">{formatCurrency(totalProfit)}</p>
      </Card>

      {/* User Accounts Section */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900">User Accounts</h3>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3 text-right">Profit</th>
                  <th className="px-4 py-3 text-right">Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">{userProfile?.name || 'Guest'}</td>
                  <td className="px-4 py-3 text-gray-500">{userProfile?.email || '-'}</td>
                  <td className="px-4 py-3 text-right text-emerald-600 font-medium">{formatCurrency(totalProfit)}</td>
                  <td className="px-4 py-3 text-right text-red-600 font-medium">{formatCurrency(totalLoss)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Payment Settings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Payment Settings</h3>
          {!isEditingPayment && (
            <Button variant="ghost" size="sm" onClick={startEditingPayment} className="text-indigo-600 h-8 text-xs">
              <Edit2 className="w-3 h-3 mr-1" /> Edit
            </Button>
          )}
        </div>
        
        <Card className="p-4">
          {isEditingPayment ? (
            <div className="space-y-3">
              <Input
                label="UPI ID"
                value={paymentForm.upiId}
                onChange={(e) => setPaymentForm({...paymentForm, upiId: e.target.value})}
                placeholder="e.g. business@upi"
              />
              <Input
                label="Premium Price (₹)"
                type="number"
                value={paymentForm.premiumPrice}
                onChange={(e) => setPaymentForm({...paymentForm, premiumPrice: e.target.value})}
                placeholder="499"
              />
              <div className="flex space-x-2 pt-2">
                <Button size="sm" onClick={savePaymentSettings} className="flex-1">
                  <Save className="w-4 h-4 mr-1" /> Save Changes
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsEditingPayment(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">UPI ID</p>
                    <p className="font-medium text-gray-900">{adminSettings?.upiId || 'Not set'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center text-gray-400 font-bold">₹</div>
                  <div>
                    <p className="text-xs text-gray-500">Premium Price</p>
                    <p className="font-medium text-gray-900">{formatCurrency(adminSettings?.premiumPrice || 0)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-900">Actions</h3>
        
        <Card className="p-4">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Send Update Notification</h4>
              <p className="text-xs text-gray-500 mt-1 mb-3">Notify users about new features or updates.</p>
              
              <textarea
                className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-3"
                rows={3}
                placeholder="Type your notification message here..."
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
              />
              
              <Button size="sm" variant="outline" className="w-full" onClick={sendNotification}>
                Send Notification
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
