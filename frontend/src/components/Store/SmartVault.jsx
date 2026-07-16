import React from "react";

export default function SmartVault({ files, onInlineView, onDownload }) {
  if (!files || files.length === 0) {
    return (
      <div style={{ background: "#09090b", padding: "15px", borderRadius: "12px", textAlign: "center", color: "#71717a" }}>
        📂 આ બંડલમાં કોઈ ફાઇલો ઉપલબ્ધ નથી.
      </div>
    );
  }

  const handleDownloadAll = () => {
    files.forEach(file => {
      onDownload(file.fileUrl, file.fileName);
    });
  };

  return (
    <div style={{ marginTop: "20px", background: "rgba(34, 197, 94, 0.05)", border: "1px solid rgba(34, 197, 94, 0.2)", padding: "20px", borderRadius: "16px" }}>
      <h4 style={{ color: "#22c55e", margin: "0 0 15px 0", display: "flex", alignItems: "center", gap: "6px" }}>
        🔓 ⚡ SMART VAULT DELIVERY PROTOCOL ACTIVE
      </h4>

      {/* MASTER SINGLE-CLICK DOWNLOAD BUTTON */}
      {files.length > 1 && (
        <button 
          onClick={handleDownloadAll} 
          style={{ 
            background: "#16a34a", 
            color: "#fff", 
            border: "none", 
            padding: "10px 16px", 
            borderRadius: "8px", 
            cursor: "pointer", 
            marginBottom: "15px", 
            width: "100%",
            fontWeight: "bold",
            fontSize: "13px"
          }}
        >
          ⚡ Download All Files (Single Click)
        </button>
      )}

      {/* INDIVIDUAL INTERNAL FILE DELIVERY LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {files.map((file, idx) => (
          <div key={idx} style={{ background: "#09090b", padding: "12px 16px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #27272a" }}>
            <span style={{ fontSize: "13px", color: "#d4d4d8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>
              📄 {file.fileName}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                onClick={() => onInlineView(file.fileUrl)} 
                style={{ background: "#27272a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
              >
                View
              </button>
              <button 
                onClick={() => onDownload(file.fileUrl, file.fileName)} 
                style={{ background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}