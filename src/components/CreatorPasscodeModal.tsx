import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface CreatorPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SECRET_PASSCODE = '!@#$%^&*()_+';

export const CreatorPasscodeModal: React.FC<CreatorPasscodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useApp();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === SECRET_PASSCODE) {
      setError(false);
      onSuccess();
      showToast('Creator Mode Unlocked ✏️');
      setPasscode('');
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="card bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-xl max-w-sm w-full space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <h3 className="font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
            🔐 Instructor / Creator Mode
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--text-dim)] hover:text-[var(--text-main)] text-sm"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-[var(--text-dim)]">
          Enter the secret creator passcode to edit course structure and lessons.
        </p>

        {error && (
          <div className="p-2 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded">
            Incorrect passcode. Access denied.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            autoFocus
            className="w-full px-3 py-2 rounded bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
            placeholder="Passcode…"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-[var(--border-color)] text-xs text-[var(--text-dim)] hover:bg-[var(--bg-main)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded bg-[var(--accent-color)] text-white font-medium text-xs hover:opacity-90"
            >
              Unlock Mode
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
