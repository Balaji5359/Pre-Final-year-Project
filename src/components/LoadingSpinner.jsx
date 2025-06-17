import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;