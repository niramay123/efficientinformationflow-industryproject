import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Mail, Lock, User, KeyRound } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import apiClient from '../apiClient';
import { useTranslation } from 'react-i18next';

export function RegisterForm() {
  const { t } = useTranslation();
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'operator' as 'operator' | 'supervisor',
  });
  const [otp, setOtp] = useState('');
  const [activationToken, setActivationToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleRoleChange = (value: 'operator' | 'supervisor') => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await apiClient.post('/user/register', formData);
      setActivationToken(response.data.activationToken);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || t('registrationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await apiClient.post('/user/verify-user', { activationToken, otp });
      // On success, redirect to login with a success message/state
      navigate('/login', { state: { message: t('registrationSuccess') } });
    } catch (err: any) {
      setError(err.response?.data?.message || t('otpFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-3 overflow-hidden"
            style={{
              backgroundColor: 'rgb(33,79,142)',
              boxShadow: '0 4px 6px rgba(33,79,142,0.5)'
            }}
          >
            <img
              src="/fc-logo.jpg"
              alt="Fluid Controls Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900"> {t('appTitle')}</h1>
          <p className="text-slate-600 mt-2">{t('registerSubtitle')}</p>
        </div>

        <Card className="border-0 shadow-xl">
          {step === 'details' ? (
            <>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{t('registerTitle')}</CardTitle>
                <CardDescription>{t('registerSubtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
                  )}
                  {/* Name, Email, Password, Role Inputs */}
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('fullName')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} className="pl-9" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="email" type="email" placeholder="you@company.com" value={formData.email} onChange={handleInputChange} className="pl-9" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} className="pl-9" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">{t('role')}</Label>
                    <Select value={formData.role} onValueChange={handleRoleChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectRole')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operator">{t('operator')}</SelectItem>
                        <SelectItem value="supervisor">{t('supervisor')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? t('registering') : t('signUp')}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{t('verifyEmailTitle')}</CardTitle>
                <CardDescription>{t('otpSentTo', { email: formData.email })}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="otp">{t('enterOtp')}</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="otp" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} className="pl-9" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? t('verifying') : t('verifyAndCreate')}
                  </Button>
                </form>
              </CardContent>
            </>
          )}
          <CardContent className="text-center text-sm">
            <p className="text-slate-600">
              {t('alreadyHaveAccount')}{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:underline">
                {t('signIn')}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
