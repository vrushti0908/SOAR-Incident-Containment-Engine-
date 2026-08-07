export default function CardShell({ title, action, children }) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: 16,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {title}
          </span>

          {action}
        </div>
      )}

      {children}
    </div>
  );
}