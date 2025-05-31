import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const DEVICES_KEY = 'tv-remote-devices';
const CONTENT_KEY = 'tv-remote-content-options';

const GuestView = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  let devices: { id: number; name: string; ip: string }[] = [];
  let content: { label: string; contentId: string; sequence: any[] }[] = [];
  try {
    const stored = localStorage.getItem(DEVICES_KEY);
    if (stored) devices = JSON.parse(stored);
    const storedContent = localStorage.getItem(CONTENT_KEY);
    if (storedContent) content = JSON.parse(storedContent);
  } catch {}
  const device = devices.find(d => String(d.id) === deviceId);

  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!device) {
    return <div>Device not found.</div>;
  }

  const handleSelect = async (contentId: string) => {
    setSelected(contentId);
    setApiError(null);
    setApiSuccess(null);
    setLoading(true);
    try {
      const option = content.find(o => o.contentId === contentId);
      if (!option) throw new Error('Option not found');
      const res = await fetch('/api/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          deviceId: device.id,
          sequence: option.sequence,
        }),
      });
      if (!res.ok) throw new Error('Failed to send request');
      setApiSuccess('Request sent!');
    } catch (e: any) {
      setApiError('Could not send request. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setApiSuccess(null);
        setSelected(null);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to {device.name}</h1>
      <p className="mb-4">What would you like to watch?</p>
      <div className="w-full max-w-md grid grid-cols-1 gap-4 mb-4">
        {content.map(option => (
          <button
            key={option.contentId}
            className={`w-full py-4 rounded-xl text-lg font-semibold shadow-md transition bg-blue-600 text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 ${selected === option.contentId ? 'opacity-60' : ''}`}
            onClick={() => handleSelect(option.contentId)}
            disabled={loading}
          >
            {option.label}
          </button>
        ))}
      </div>
      {apiError && <div className="text-red-500 mt-2">{apiError}</div>}
      {apiSuccess && <div className="text-green-600 mt-2">{apiSuccess}</div>}
    </div>
  );
};

export default GuestView; 