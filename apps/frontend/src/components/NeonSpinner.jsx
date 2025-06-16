import React from 'react';

const NeonSpinner = ({ size = 'w-10 h-10', color = 'text-accent-cyan' }) => {
  return (
    <div className={`neon-spinner ${size} ${color}`}></div>
  );
};

export default NeonSpinner;
