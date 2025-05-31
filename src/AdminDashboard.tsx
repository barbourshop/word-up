import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'tv-remote-content-options';
const DEVICE_KEY = 'tv-remote-device-id';
const ENDPOINT_KEY = 'tv-remote-device-endpoint';
const DEFAULT_DEVICE = 'Living Room TV';
const DEFAULT_ENDPOINT = 'http://192.168.1.100:8080/api/receive';
const initialContent = [
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
];
const initialLogs = [
  { time: '10:01 AM', action: 'Warriors Game selected' },
  { time: '9:45 AM', action: 'Comedy Central selected' },
];

const AdminDashboard = () => {
  const [content, setContent] = useState(initialContent);
  const [logs, setLogs] = useState(initialLogs);
  const [autoCuration, setAutoCuration] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newId, setNewId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [deviceInput, setDeviceInput] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [endpointInput, setEndpointInput] = useState('');
  const [deviceSaved, setDeviceSaved] = useState(false);
  const [editingSequenceId, setEditingSequenceId] = useState<string | null>(null);
  const [newStepType, setNewStepType] = useState<'ir' | 'delay'>('ir');
  const [newIrCommand, setNewIrCommand] = useState('');
  const [newDelayMs, setNewDelayMs] = useState(1000);
  const [editingStep, setEditingStep] = useState<{ contentId: string; idx: number } | null>(null);
  const [editStepType, setEditStepType] = useState<'ir' | 'delay'>('ir');
  const [editIrCommand, setEditIrCommand] = useState('');
  const [editDelayMs, setEditDelayMs] = useState(1000);

  // Load from localStorage on mount, or set default device/endpoint if not present
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setContent(JSON.parse(stored));
      } catch {}
    }
    let storedDevice = localStorage.getItem(DEVICE_KEY);
    if (!storedDevice) {
      localStorage.setItem(DEVICE_KEY, DEFAULT_DEVICE);
      storedDevice = DEFAULT_DEVICE;
    }
    setDeviceId(storedDevice);
    setDeviceInput(storedDevice);

    let storedEndpoint = localStorage.getItem(ENDPOINT_KEY);
    if (!storedEndpoint) {
      localStorage.setItem(ENDPOINT_KEY, DEFAULT_ENDPOINT);
      storedEndpoint = DEFAULT_ENDPOINT;
    }
    setEndpoint(storedEndpoint);
    setEndpointInput(storedEndpoint);
  }, []);

  // Save to localStorage whenever content changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const addContent = () => {
    if (newLabel && newId) {
      setContent([...content, { label: newLabel, contentId: newId }]);
      setNewLabel('');
      setNewId('');
    }
  };
  const removeContent = (contentId: string) => {
    setContent(content.filter(c => c.contentId !== contentId));
  };

  const handleDeviceSave = () => {
    setDeviceId(deviceInput);
    setEndpoint(endpointInput);
    localStorage.setItem(DEVICE_KEY, deviceInput);
    localStorage.setItem(ENDPOINT_KEY, endpointInput);
    setDeviceSaved(true);
    setTimeout(() => setDeviceSaved(false), 1500);
  };

  const handleAddStep = (contentId: string) => {
    setContent(content => content.map(option => {
      if (option.contentId !== contentId) return option;
      const newStep = newStepType === 'ir'
        ? { type: 'ir', command: newIrCommand }
        : { type: 'delay', ms: newDelayMs };
      return {
        ...option,
        sequence: [...(option.sequence || []), newStep],
      };
    }));
    setNewIrCommand('');
    setNewDelayMs(1000);
  };

  const handleRemoveStep = (contentId: string, idx: number) => {
    setContent(content => content.map(option => {
      if (option.contentId !== contentId) return option;
      return {
        ...option,
        sequence: option.sequence.filter((_, i) => i !== idx),
      };
    }));
  };

  const handleEditStep = (contentId: string, idx: number, step: any) => {
    setEditingStep({ contentId, idx });
    setEditStepType(step.type);
    if (step.type === 'ir') {
      setEditIrCommand(step.command);
      setEditDelayMs(1000);
    } else {
      setEditDelayMs(step.ms);
      setEditIrCommand('');
    }
  };

  const handleSaveStep = () => {
    if (!editingStep) return;
    setContent(content => content.map(option => {
      if (option.contentId !== editingStep.contentId) return option;
      const newStep = editStepType === 'ir'
        ? { type: 'ir', command: editIrCommand }
        : { type: 'delay', ms: editDelayMs };
      return {
        ...option,
        sequence: option.sequence.map((step, i) => i === editingStep.idx ? newStep : step),
      };
    }));
    setEditingStep(null);
  };

  const handleCancelEditStep = () => {
    setEditingStep(null);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <nav className="w-48 bg-white border-r p-6 flex flex-col gap-4">
        <div className="font-bold text-lg mb-8">Admin Panel</div>
        <a href="#device" className="text-blue-600 hover:underline">Device Config</a>
        <a href="#content" className="text-blue-600 hover:underline">Content Options</a>
        <a href="#curation" className="text-blue-600 hover:underline">Auto-Curation</a>
        <a href="#logs" className="text-blue-600 hover:underline">Logs</a>
      </nav>
      <main className="flex-1 p-6 space-y-10">
        <section id="device">
          <h2 className="text-xl font-semibold mb-4">Device Configuration</h2>
          <div className="flex flex-col gap-2 mb-2 max-w-lg">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Device name"
                className="px-2 py-1 border rounded flex-1"
                value={deviceInput}
                onChange={e => setDeviceInput(e.target.value)}
              />
              <input
                type="text"
                placeholder="Device endpoint (URL or IP)"
                className="px-2 py-1 border rounded flex-1"
                value={endpointInput}
                onChange={e => setEndpointInput(e.target.value)}
              />
              <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={handleDeviceSave}>
                Save
              </button>
            </div>
            {deviceSaved && <span className="text-green-600 text-sm">Saved!</span>}
            <div className="text-gray-600 text-sm mt-1">
              <div>Current device: <span className="font-mono">{deviceId}</span></div>
              <div>Endpoint: <span className="font-mono">{endpoint}</span></div>
            </div>
          </div>
        </section>
        <section id="content">
          <h2 className="text-xl font-semibold mb-4">Curated Content Options</h2>
          <ul className="mb-4">
            {content.map(c => (
              <li key={c.contentId} className="flex flex-col gap-2 py-2 border-b">
                <div className="flex items-center justify-between">
                  <span>{c.label}</span>
                  <div className="flex gap-2">
                    <button className="text-blue-500 hover:underline" onClick={() => setEditingSequenceId(editingSequenceId === c.contentId ? null : c.contentId)}>
                      {editingSequenceId === c.contentId ? 'Close Sequence Editor' : 'Edit Sequence'}
                    </button>
                    <button className="text-red-500 hover:underline" onClick={() => removeContent(c.contentId)}>Remove</button>
                  </div>
                </div>
                {editingSequenceId === c.contentId && (
                  <div className="bg-gray-100 p-3 rounded mt-2">
                    <div className="mb-2 font-semibold">Sequence Steps:</div>
                    <ol className="mb-2 list-decimal list-inside">
                      {(c.sequence || []).map((step, idx) => (
                        <li key={idx} className="flex items-center gap-2 mb-1">
                          {editingStep && editingStep.contentId === c.contentId && editingStep.idx === idx ? (
                            <>
                              <select value={editStepType} onChange={e => setEditStepType(e.target.value as 'ir' | 'delay')} className="border rounded px-2 py-1">
                                <option value="ir">IR Command</option>
                                <option value="delay">Delay</option>
                              </select>
                              {editStepType === 'ir' ? (
                                <input type="text" placeholder="Command (e.g. KEY_7)" value={editIrCommand} onChange={e => setEditIrCommand(e.target.value)} className="border rounded px-2 py-1" />
                              ) : (
                                <input type="number" min={100} step={100} placeholder="Delay (ms)" value={editDelayMs} onChange={e => setEditDelayMs(Number(e.target.value))} className="border rounded px-2 py-1 w-24" />
                              )}
                              <button className="bg-green-500 text-white px-2 py-1 rounded ml-2" onClick={handleSaveStep} disabled={editStepType === 'ir' ? !editIrCommand : editDelayMs < 100}>Save</button>
                              <button className="bg-gray-400 text-white px-2 py-1 rounded ml-1" onClick={handleCancelEditStep}>Cancel</button>
                            </>
                          ) : (
                            <>
                              {step.type === 'ir' ? (
                                <span>IR Command: <span className="font-mono">{step.command}</span></span>
                              ) : (
                                <span>Delay: <span className="font-mono">{step.ms} ms</span></span>
                              )}
                              <button className="text-xs text-blue-500 ml-2" onClick={() => handleEditStep(c.contentId, idx, step)}>Edit</button>
                              <button className="text-xs text-red-500 ml-2" onClick={() => handleRemoveStep(c.contentId, idx)}>Remove</button>
                            </>
                          )}
                        </li>
                      ))}
                    </ol>
                    <div className="flex gap-2 items-end">
                      <select value={newStepType} onChange={e => setNewStepType(e.target.value as 'ir' | 'delay')} className="border rounded px-2 py-1">
                        <option value="ir">IR Command</option>
                        <option value="delay">Delay</option>
                      </select>
                      {newStepType === 'ir' ? (
                        <input type="text" placeholder="Command (e.g. KEY_7)" value={newIrCommand} onChange={e => setNewIrCommand(e.target.value)} className="border rounded px-2 py-1" />
                      ) : (
                        <input type="number" min={100} step={100} placeholder="Delay (ms)" value={newDelayMs} onChange={e => setNewDelayMs(Number(e.target.value))} className="border rounded px-2 py-1 w-24" />
                      )}
                      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleAddStep(c.contentId)} disabled={newStepType === 'ir' ? !newIrCommand : newDelayMs < 100}>
                        Add Step
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Label"
              className="px-2 py-1 border rounded flex-1"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
            />
            <input
              type="text"
              placeholder="Content ID"
              className="px-2 py-1 border rounded flex-1"
              value={newId}
              onChange={e => setNewId(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={addContent}>Add</button>
          </div>
        </section>
        <section id="curation">
          <h2 className="text-xl font-semibold mb-4">Auto-Curation Mode</h2>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoCuration}
              onChange={e => setAutoCuration(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>{autoCuration ? 'Enabled' : 'Disabled'}</span>
          </label>
        </section>
        <section id="logs">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul>
            {logs.map((log, i) => (
              <li key={i} className="text-gray-700 mb-1">{log.time} — {log.action}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard; 