import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { LetterheadTemplate } from '../../components/letterhead/LetterheadTemplate';
import { FileText } from 'lucide-react';

export const LetterheadPage = () => {
  const [orgSettings, setOrgSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      if (res.data.success) {
        setOrgSettings(res.data.settings || null);
      }
    } catch (err) {
      console.error('Error fetching org settings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LetterheadTemplate orgSettings={orgSettings} />
    </div>
  );
};
