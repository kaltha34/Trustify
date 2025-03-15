import { height, letterSpacing, padding, width } from "@mui/system";
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
          <p style={styles.text}>Manage the platform and ensure security.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginLeft: "270px", // Make space for the sidebar
    padding: "20px 40px 20px 20px",
    height: "100vh",
  },
  header: {
    fontSize: "3rem",
    fontWeight: "bolder",
    letterSpacing: "3px",
    marginBottom: "30px",
    textAlign: "center",
  },
  content: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: "50px",
    gap: "20px",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#e0e0e0",
    padding: "20px",
    width: "45%",
    minWidth: "250px",
    height: "150px",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.5)",
  },
  roleTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "black",
  },
  text: {
    fontSize: "1rem",
    color: "black",
  },
};

export default DetailsPage;
