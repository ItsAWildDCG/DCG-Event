export function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="pixel-spinner">
        <div className="pixel-box" style={{ animationDelay: '0s' }} />
        <div className="pixel-box" style={{ animationDelay: '0.1s' }} />
        <div className="pixel-box" style={{ animationDelay: '0.2s' }} />
        <div className="pixel-box" style={{ animationDelay: '0.3s' }} />
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
}
