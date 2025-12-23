import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import apiClient from '../apiClient';

export function ResetPasswordForm() {
  const { t } = useTranslation();
  // The 'token' comes from the URL, e.g., /reset-password/THIS_PART_IS_THE_TOKEN
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError(t('noTokenFound'));
    }
  }, [token]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError(t('passwordsNoMatch'));
      return;
    }
    if (password.length < 6) {
      setError(t('passwordLength'));
      return;
    }

    setIsLoading(true);

    try {
      // Your backend expects the token in the query and password in the body.
      // We'll send the request to `/user/reset` and add the token as a query parameter.
      const response = await apiClient.post(`/user/reset?token=${token}`, { password });

      setSuccessMessage(response.data.message || t('resetSuccess'));

      // After a short delay, redirect to the login page.
      setTimeout(() => {
        navigate('/login', { state: { successMessage: t('loginWithNewPass') } });
      }, 3000);

    } catch (err: any) {
      console.error("Reset password error:", err);
      const message = err.response?.data?.message || t('resetFailed');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">TM</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{t('setNewPassword')}</h1>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-center">{t('createNewPassword')}</CardTitle>
            <CardDescription className="text-center">{t('newPasswordDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {successMessage && (
                <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">{t('newPassword')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('enterNewPassword')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10"
                    required
                    disabled={!!successMessage}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirmNewPassword')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('confirmNewPasswordPlaceholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9 pr-10"
                    required
                    disabled={!!successMessage}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading || !token || !!successMessage}
              >
                {isLoading ? t('resetting') : t('resetPassword')}
              </Button>
            </form>
            {successMessage && (
              <div className="mt-4 text-center text-sm">
                <p className="text-slate-600">{t('redirectingLogin')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

