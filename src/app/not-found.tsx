import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px",
        textAlign: "center",
        fontFamily: "var(--font-inter-next, sans-serif)",
        backgroundColor: "var(--ams-color-surface-page, #f8f9fa)",
        color: "var(--ams-color-text-primary, #1e293b)",
      }}
    >
      <h1 style={{ fontSize: "72px", fontWeight: 700, margin: "0 0 16px 0", color: "#1b84ff" }}>
        404
      </h1>
      <h2 style={{ fontSize: "24px", fontWeight: 600, margin: "0 0 12px 0" }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: "14px", color: "var(--ams-color-text-secondary, #64748b)", margin: "0 0 24px 0", maxWidth: "420px" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 20px",
          borderRadius: "8px",
          backgroundColor: "#1b84ff",
          color: "#ffffff",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
