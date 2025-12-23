import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';

// This is a named export, which is correct for interfaces.
export interface NewUserFormData {
  name: string;
  email: string;
  password: string;
  role: 'supervisor' | 'operator';
  skills?: string;
}

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: NewUserFormData) => Promise<{ success: boolean; message?: string }>;
}

// --- FIX --- Changed to a default export for the main component.
export default function AddUserDialog({ isOpen, onClose, onSubmit }: AddUserDialogProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<NewUserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'operator',
    skills: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (value: 'supervisor' | 'operator') => {
    setFormData(prev => ({ ...prev, role: value, skills: value === 'supervisor' ? '' : prev.skills }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await onSubmit(formData);

    if (!result.success) {
      setError(result.message || t('unexpectedError'));
    } else {
      onClose(); // Close dialog on success
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('addNewUser')}</DialogTitle>
          <DialogDescription>
            {t('addUserDesc')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">{t('name')}</Label>
              <Input id="name" value={formData.name} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">{t('email')}</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">{t('password')}</Label>
              <Input id="password" type="password" value={formData.password} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">{t('role')}</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('selectRole')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operator">{t('operator')}</SelectItem>
                  <SelectItem value="supervisor">{t('supervisor')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.role === 'operator' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skills" className="text-right">{t('skills')}</Label>
                <Input
                  id="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder={t('skillsPlaceholder')}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {t('cancel')}
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? t('creating') : t('createUser')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

