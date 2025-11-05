import React, { useRef, useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner: React.FC = () => {
  const qrCodeRegionRef = useRef<HTMLDivElement | null>(null);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);

  const [scanning, setScanning] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  // Función para iniciar escaneo
  const startScanning = async () => {
    if (!qrCodeRegionRef.current) return;

    if (!html5QrcodeRef.current) {
      html5QrcodeRef.current = new Html5Qrcode(qrCodeRegionRef.current.id);
    }

    try {
      await html5QrcodeRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setQrCode(decodedText);
          console.log("QR detected:", decodedText);
        },
        (errorMessage) => {
          console.warn("QR scan error:", errorMessage);
        }
      );
      setScanning(true);
    } catch (err: unknown) {
      console.error("Error iniciando scanner:", err);
      alert("Error iniciando cámara: " + ((err as Error).message || err));
    }
  };

  // Función para detener escaneo
  const stopScanning = async () => {
    if (!html5QrcodeRef.current) return;

    try {
      await html5QrcodeRef.current.stop();
      await html5QrcodeRef.current.clear();
      setScanning(false);
      console.log("Scanner detenido");
    } catch (err) {
      console.error("Error deteniendo scanner:", err);
    }
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (html5QrcodeRef.current) {
        html5QrcodeRef.current
          .stop()
          .then(() => html5QrcodeRef.current?.clear())
          .catch(() => {});
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        id="qr-scanner"
        ref={qrCodeRegionRef}
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "600px",
          maxHeight: "600px",
        }}
      />

      {/* Botones flotantes */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          display: "flex",
          gap: "20px",
        }}
      >
        {!scanning ? (
          <button
            onClick={startScanning}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              borderRadius: "8px",
              background: "#4CAF50",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Iniciar
          </button>
        ) : (
          <button
            onClick={stopScanning}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              borderRadius: "8px",
              background: "#f44336",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Detener
          </button>
        )}
      </div>

      {/* Mostrar QR detectado */}
      {qrCode && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            background: "rgba(0,0,0,0.6)",
            color: "lightgreen",
            padding: "10px 20px",
            borderRadius: "8px",
            wordBreak: "break-all",
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          QR Code: {qrCode}
        </div>
      )}
    </div>
  );
};

export default QRScanner;
