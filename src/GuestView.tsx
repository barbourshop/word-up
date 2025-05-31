import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'tv-remote-content-options';
const DEVICE_KEY = 'tv-remote-device-id';
const DEFAULT_OPTIONS = [
  {
    label: 'Watch Warriors Game',
    contentId: 'warriors',
    sequence: [
      { type: 'ir', command: 'KEY_7' },
      { type: 'delay', ms: 1000 },
      { type: 'ir', command: 'KEY_2' },
      { type: 'delay', ms: 1000 },
      { type: 'ir', command: 'KEY_0' },
      { type: 'delay', ms: 1000 },
      { type: 'ir', command: 'KEY_SELECT' },
    ],
  },
  { label: 'Watch Giants Game', contentId: 'giants', sequence: [] },
  { label: 'Watch the News', contentId: 'news', sequence: [] },
  { label: 'Watch Comedy Central', contentId: 'comedy_central', sequence: [] },
  { label: 'Watch Discovery Channel', contentId: 'discovery', sequence: [] },
  { label: 'Watch Local Sports', contentId: 'local_sports', sequence: [] },
];

const GuestView = () => {
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setOptions(JSON.parse(stored));
      } catch {}
    }
    const storedDevice = localStorage.getItem(DEVICE_KEY);
    if (storedDevice) {
      setDeviceId(storedDevice);
    }
  }, []);

  const handleSelect = async (contentId: string) => {
    setSelected(contentId);
    setError(null);
    try {
      const option = options.find(o => o.contentId === contentId);
      if (!option) throw new Error('Option not found');
      const body: any = { sequence: option.sequence };
      if (deviceId) body.deviceId = deviceId;
      const res = await fetch('/api/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to send request');
    } catch (e) {
      setError('Could not send request. Please try again.');
      setSelected(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-8 pb-24">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">What would you like to watch?</h1>
        <div className="w-full max-w-md grid grid-cols-1 gap-4">
          {options.map(option => (
            <button
              key={option.contentId}
              className={`w-full py-6 rounded-xl text-lg font-semibold shadow-md transition bg-blue-600 text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 ${selected === option.contentId ? 'opacity-60' : ''}`}
              onClick={() => handleSelect(option.contentId)}
            >
              {option.label}
            </button>
          ))}
        </div>
        {error && <div className="mt-4 text-red-500">{error}</div>}
        {selected && !error && <div className="mt-4 text-green-600">Request sent!</div>}
      </div>
      <footer className="text-center text-gray-400 text-sm py-4 border-t bg-gray-50">TV powered by VenueName 🎉</footer>
    </div>
  );
};

export default GuestView; 