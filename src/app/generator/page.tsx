"use client"

import { useState, FormEvent } from "react"

export default function GeneratorPage() {
  const [formData, setFormData] = useState({
    apiKey: "",
    apiSecret: "",
    walletAddress: "",
    silo: "auroracloud.dev",
    fiatAmount: "50",
    fiatCurrency: "EUR",
    defaultFiatAmount: "0",
    defaultCryptoAmount: "0",
    cryptoCurrencyCode: "NEAR",
    environment: "staging",
  })

  const [generatedLink, setGeneratedLink] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const baseUrl = "https://transak.auroracloud.dev/"
    const params = new URLSearchParams()

    // Add all non-empty fields to params
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        params.append(key, value)
      }
    })

    setGeneratedLink(`${baseUrl}?${params.toString()}`)
  }

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f7",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#333",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          Transak Link Generator
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="apiKey">API Key *</label>
            <input
              style={inputStyle}
              type="text"
              id="apiKey"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              required
              placeholder="Enter API Key"
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="apiSecret">API Secret *</label>
            <input
              style={inputStyle}
              type="password"
              id="apiSecret"
              name="apiSecret"
              value={formData.apiSecret}
              onChange={handleChange}
              required
              placeholder="Enter API Secret"
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="walletAddress">Wallet Address *</label>
            <input
              style={inputStyle}
              type="text"
              id="walletAddress"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              required
              placeholder="0x..."
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle} htmlFor="fiatAmount">Fiat Amount</label>
              <input
                style={inputStyle}
                type="number"
                id="fiatAmount"
                name="fiatAmount"
                value={formData.fiatAmount}
                onChange={handleChange}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle} htmlFor="fiatCurrency">Fiat Currency</label>
              <input
                style={inputStyle}
                type="text"
                id="fiatCurrency"
                name="fiatCurrency"
                value={formData.fiatCurrency}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
             <div style={inputGroupStyle}>
              <label style={labelStyle} htmlFor="defaultFiatAmount">Default Fiat Amount</label>
              <input
                style={inputStyle}
                type="number"
                id="defaultFiatAmount"
                name="defaultFiatAmount"
                value={formData.defaultFiatAmount}
                onChange={handleChange}
              />
            </div>
             <div style={inputGroupStyle}>
              <label style={labelStyle} htmlFor="defaultCryptoAmount">Default Crypto Amount</label>
              <input
                style={inputStyle}
                type="number"
                id="defaultCryptoAmount"
                name="defaultCryptoAmount"
                value={formData.defaultCryptoAmount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle} htmlFor="cryptoCurrencyCode">Crypto Currency Code</label>
              <input
                style={inputStyle}
                type="text"
                id="cryptoCurrencyCode"
                name="cryptoCurrencyCode"
                value={formData.cryptoCurrencyCode}
                onChange={handleChange}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle} htmlFor="environment">Environment</label>
              <select
                style={inputStyle}
                id="environment"
                name="environment"
                value={formData.environment}
                onChange={handleChange}
              >
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: "20px",
              padding: "12px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Generate Link
          </button>
        </form>

        {generatedLink && (
          <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>Generated Link:</p>
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "12px",
                borderRadius: "6px",
                wordBreak: "break-all",
                fontSize: "14px",
                marginBottom: "10px",
                fontFamily: "monospace",
                border: "1px solid #e1e4e8",
              }}
            >
              {generatedLink}
            </div>
            <button
              onClick={copyToClipboard}
              style={{
                padding: "8px 16px",
                backgroundColor: "#fff",
                color: "#333",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "6px",
}

const labelStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#374151",
}

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  outline: "none",
}

