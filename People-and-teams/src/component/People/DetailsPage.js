import React from "react";

const DetailsPage = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Trustify Users and Roles</h2>
      <div style={styles.content}>
        <div style={styles.card}>
          <h3 style={styles.roleTitle}>Users (Citizens)</h3>
          <p style={styles.text}>
            Individuals using Trustify to verify their identity.
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.roleTitle}>Government Authorities</h3>
          <p style={styles.text}>
            Institutions verifying and approving digital identities.
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.roleTitle}>Service Providers</h3>
          <p style={styles.text}>
            Banks, telecom providers, and businesses using Trustify for
            authentication.
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.roleTitle}>System Administrators</h3>
          <p style={styles.text}>
            Manage the platform and ensure security.
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
    color:"Black",
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
  roleTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
    color:"black"
  },
  text: {
    fontSize: "1rem",
    color: "black",
  },
};

export default DetailsPage;
