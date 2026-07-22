import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckIcon } from './Icons';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  return (
    <div className={`toast ${toast.show ? 'show' : ''}`} id="toast">
      <CheckIcon />
      <span>{toast.msg}</span>
    </div>
  );
};
