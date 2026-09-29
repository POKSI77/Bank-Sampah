export default function LoadingSkeleton({ variant = 'page' }) {
  if (variant === 'table') {
    return (
      <div className="skeleton-page" aria-label="Memuat data" role="status">
        <div className="skeleton-block skeleton-eyebrow" />
        <div className="skeleton-block skeleton-title" />
        <div className="skeleton-block skeleton-subtitle" />
        <div className="skeleton-card skeleton-table">
          <div className="skeleton-block skeleton-row skeleton-row-heading" />
          <div className="skeleton-block skeleton-row" />
          <div className="skeleton-block skeleton-row" />
          <div className="skeleton-block skeleton-row" />
          <div className="skeleton-block skeleton-row" />
        </div>
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div className="skeleton-page" aria-label="Memuat formulir" role="status">
        <div className="skeleton-block skeleton-eyebrow" />
        <div className="skeleton-block skeleton-title" />
        <div className="skeleton-block skeleton-subtitle" />
        <div className="skeleton-card skeleton-form">
          <div className="skeleton-block skeleton-field" />
          <div className="skeleton-block skeleton-field" />
          <div className="skeleton-block skeleton-field" />
          <div className="skeleton-block skeleton-button" />
        </div>
      </div>
    );
  }

  return (
    <div className="skeleton-page" aria-label="Memuat halaman" role="status">
      <div className="skeleton-block skeleton-eyebrow" />
      <div className="skeleton-block skeleton-title" />
      <div className="skeleton-block skeleton-subtitle" />
      <div className="skeleton-stats">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
      <div className="skeleton-card skeleton-content" />
    </div>
  );
}
