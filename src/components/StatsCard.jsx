export default function StatsCard({ icon, label, value, hint, color = 'emerald' }) {
  const colorMap = {
    emerald: {
      bg: 'var(--color-primary-50)',
      text: 'var(--color-primary-600)',
      accent: 'var(--color-primary-500)',
    },
    blue: {
      bg: 'var(--color-info-light)',
      text: 'var(--color-info)',
      accent: 'var(--color-info)',
    },
    amber: {
      bg: 'var(--color-warning-light)',
      text: 'var(--color-warning)',
      accent: 'var(--color-warning)',
    },
    red: {
      bg: 'var(--color-danger-light)',
      text: 'var(--color-danger)',
      accent: 'var(--color-danger)',
    },
  };

  const c = colorMap[color] || colorMap.emerald;

  return (
    <div className="stat-card" style={{ '--stat-accent': c.accent }}>
      <div
        className="stat-card-icon"
        style={{ backgroundColor: c.bg, color: c.text }}
      >
        {icon}
      </div>
      <div className="stat-card-content">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value}</div>
        {hint && <div className="stat-card-hint">{hint}</div>}
      </div>
    </div>
  );
}
