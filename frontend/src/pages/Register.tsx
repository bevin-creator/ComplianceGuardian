import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, UserPlus, CheckCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import apiService from '@/services/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'analyst'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);
  
  const { setUser, setToken } = useAuthStore();
  const navigate = useNavigate();

  // Countdown and redirect after successful registration
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      navigate('/dashboard');
    }
  }, [success, countdown, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await apiService.register(registerData);
      
      if (response.success && response.data) {
        // Show success message
        setSuccess(true);
        setError('');
        
        // Auto-login after successful registration
        setUser(response.data);
        if (response.data.token) {
          setToken(response.data.token);
        }
        
        // Countdown will trigger redirect
      } else {
        setError(response.error || 'Registration failed');
        setSuccess(false);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error ||
                          err.response?.data?.message ||
                          'An error occurred during registration. Please try again.';
      setError(errorMessage);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ComplianceGuard</h1>
          <p className="text-dark-400">Create your account</p>
        </div>

        {/* Registration Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1 flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Sign Up
              </h2>
              <p className="text-sm text-dark-400">Join the compliance platform</p>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg animate-shake">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg animate-fade-in">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-400 mb-1">
                      Account Created Successfully!
                    </p>
                    <p className="text-sm text-green-300">
                      Welcome aboard, {formData.name}! Redirecting to dashboard in {countdown} second{countdown !== 1 ? 's' : ''}...
                    </p>
                  </div>
                  <Loader2 className="w-5 h-5 text-green-400 animate-spin flex-shrink-0" />
                </div>
              </div>
            )}

            <Input
              label="Full Name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />

            <Input
              label="Username"
              name="username"
              type="text"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="john.doe@company.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="analyst">Compliance Analyst</option>
                <option value="compliance_officer">Compliance Officer</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading || success}
            >
              {isLoading ? 'Creating Account...' : success ? 'Account Created!' : 'Create Account'}
            </Button>

            <div className="pt-4 border-t border-dark-700 text-center">
              <p className="text-sm text-dark-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-dark-500 mt-8">
          © 2024 ComplianceGuard. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;

// Made with Bob