export default function LoadingSpinner({ text = 'Memuat data...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner" />
      <span className="spinner-text">{text}</span>
    </div>
  );
}
