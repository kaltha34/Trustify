import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaFileAlt } from "react-icons/fa";

const PeopleAndTerms = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.peoplehead}>
      <h1 style={styles.title}>People & Terms</h1>
      <div style={styles.container}>
        <div
          style={styles.card}
          onClick={() => navigate("/people-details")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <FaUser size={50} style={styles.icon} />
          <p style={styles.text}>Key People in Trustify</p>
        </div>

        <div
          style={styles.card}
          onClick={() => navigate("/terms-details")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <FaFileAlt size={50} style={styles.icon} />
          <p style={styles.text}>Important Terms</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    marginTop: "50px",
    gap: "90px",
    height: "100vh",
    marginLeft: "350px",
    flexWrap: "wrap",
    padding: "0 20px",
  },
  title: {
    fontSize: "34px",
    fontWeight: "bold",
    letterSpacing: "1px",
    textAlign: "left",
    marginTop: "60px",
    marginLeft: "300px",
  },
  card: {
    width: "450px",
    marginTop: "40px",
    marginBottom: "10px",
    height: "350px",
    backgroundColor: "white",
    borderRadius: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.9)",
    cursor: "pointer",
    transition: "transform 0.2s", // Smooth transition
  },
  icon: {
    color: "#000",
    marginBottom: "10px",
  },
  text: {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
};

export default PeopleAndTerms;
