function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-400 mx-auto"></div>
        <p className="text-blue-400 tracking-wide">Running AI Analysis...</p>
      </div>
    </div>
  );
}

export default LoadingOverlay;
