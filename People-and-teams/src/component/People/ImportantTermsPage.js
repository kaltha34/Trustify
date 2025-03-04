import React from "react";

const ImportantTermsPage = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Important Terms</h2>
      <div style={styles.content}>
        <div style={styles.card}>
          <h3 style={styles.termTitle}>Blockchain</h3>
          <p style={styles.text}>
            A decentralized, tamper-proof digital ledger.
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.termTitle}>DID (Decentralized Identifier)</h3>
          <p style={styles.text}>
            A unique, self-owned digital identity.
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.termTitle}>VC (Verifiable Credential)</h3>
          <p style={styles.text}>
            A digitally signed identity document.
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.termTitle}>Smart Contracts</h3>
          <p style={styles.text}>
            Automated agreements ensuring data integrity.
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.termTitle}>KYC (Know Your Customer)</h3>
          <p style={styles.text}>
            A process for identity verification.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginLeft: "250px",  // Make space for the sidebar
    padding: "20px",
    backgroundColor: "#f4f4f4",
    height: "100vh",
  },
  header: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
    color:"black",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    backgroundColor: "#e0e0e0",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
  },
  termTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
    color:"black",
  },
  text: {
    fontSize: "1rem",
 
    color:"black",
  },
};

export default ImportantTermsPage;
