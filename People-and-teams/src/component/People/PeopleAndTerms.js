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
    marginLeft: "390px",
    flexWrap: "wrap",
    padding: "0 20px",
  },
  title: {
    fontSize: "42px",
    fontWeight: "bold",
    letterSpacing: "1px",
    textAlign: "center",
    marginTop: "60px",
    marginLeft: "300px",
  },
  card: {
    width: "450px",
    marginTop: "40px",
    marginBottom: "10px",
    height: "350px",
    backgroundColor: "#e0e0e0",
    borderRadius: "40px",
    border: "5px, solid black",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s", // Smooth transition
  },
  icon: {
    color: "#000",
    marginBottom: "10px",
  },
  text: {
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
};

export default PeopleAndTerms;
