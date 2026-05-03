import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-dark-400">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-white">Profile Settings</h3>
            </div>
            <div className="space-y-4">
              <Input label="Full Name" defaultValue="John Doe" />
              <Input label="Email" type="email" defaultValue="john.doe@complianceguard.com" />
              <Input label="Role" defaultValue="Compliance Analyst" disabled />
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
            </div>
            <div className="space-y-3">
              {[
                'Critical alerts',
                'New case assignments',
                'Report generation',
                'System updates'
              ].map((item) => (
                <label key={item} className="flex items-center space-x-3 text-white">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-white">Security</h3>
            </div>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full">
                Change Password
              </Button>
              <Button variant="secondary" className="w-full">
                Two-Factor Auth
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-white">System</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-400">Version</span>
                <span className="text-white">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Last Sync</span>
                <span className="text-white">2 min ago</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;

// Made with Bob
