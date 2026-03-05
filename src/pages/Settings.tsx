import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Input } from '../components/ui';
import { Crown, Check, User, Save } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export default function SettingsPage() {
  const { isPremium, togglePremium, userProfile, updateUserProfile, adminSettings } = useApp();
  const [name, setName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email });
    setIsEditing(false);
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-xs text-gray-500">Preferences & Membership</p>
      </header>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-500" />
            <h2 className="font-bold text-gray-900">User Profile</h2>
          </div>
          {!isEditing && (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-indigo-600 h-8 text-xs">
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <Input
              label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            <Input
              label="Your Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <div className="flex space-x-2">
              <Button type="submit" size="sm" className="flex-1">
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">{userProfile.name || 'Guest User'}</p>
            <p className="text-xs text-gray-500">{userProfile.email || 'No email set'}</p>
          </div>
        )}
      </Card>

      <Card className={`p-6 border-2 ${isPremium ? 'border-amber-400 bg-amber-50' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${isPremium ? 'bg-amber-100' : 'bg-gray-100'}`}>
              <Crown className={`w-6 h-6 ${isPremium ? 'text-amber-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">
                {isPremium ? 'Premium Plan' : 'Free Plan'}
              </h2>
              <p className="text-xs text-gray-500">
                {isPremium ? 'Active' : 'Basic features'}
              </p>
            </div>
          </div>
          {isPremium && (
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
              PRO
            </span>
          )}
        </div>

        <div className="space-y-3 mb-6">
          <FeatureItem text="Unlimited Product Entries" included={isPremium} />
          <FeatureItem text="Ad-Free Experience" included={isPremium} />
          <FeatureItem text="Faster Performance" included={isPremium} />
          <FeatureItem text="Premium Support" included={isPremium} />
        </div>

        {!isPremium && (
          <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200 text-center">
             <p className="text-xs text-gray-500 mb-1">Upgrade now for just</p>
             <p className="text-xl font-bold text-indigo-600">{formatCurrency(adminSettings.premiumPrice)}</p>
             <p className="text-[10px] text-gray-400 mt-1">Pay to UPI: {adminSettings.upiId}</p>
          </div>
        )}

        <Button
          fullWidth
          variant={isPremium ? 'outline' : 'primary'}
          className={isPremium ? 'border-amber-200 text-amber-700 hover:bg-amber-100' : 'bg-gradient-to-r from-amber-500 to-orange-600 border-none'}
          onClick={togglePremium}
        >
          {isPremium ? 'Downgrade to Free' : 'Upgrade to Premium'}
        </Button>
      </Card>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-900 ml-1">App Info</h3>
        <Card className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Build</span>
            <span className="font-medium">2024.10</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Developer</span>
            <span className="font-medium">Ankush Day</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

function FeatureItem({ text, included }: { text: string; included: boolean }) {
  return (
    <div className="flex items-center space-x-3 text-sm">
      {included ? (
        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
      ) : (
        <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
      )}
      <span className={included ? 'text-gray-700' : 'text-gray-400'}>{text}</span>
    </div>
  );
}
