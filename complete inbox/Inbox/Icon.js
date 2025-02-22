import React from "react";
import styled from "styled-components";

const Loader = () => {
  const cells = Array.from({ length: 9 }); // Generates 9 cells dynamically

  return (
    <StyledWrapper aria-label="Loading">
      <div className="loader">
        {cells.map((_, index) => (
          <div key={index} className={`cell d-${index % 5}`} />
        ))}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader {
    --cell-size: 52px;
    --cell-spacing: 1px;
    --cells: 3;
    --total-size: calc(
      var(--cells) * (var(--cell-size) + 2 * var(--cell-spacing))
    );
    display: flex;
    flex-wrap: wrap;
    width: var(--total-size);
    height: var(--total-size);
  }

  .cell {
    flex: 0 0 var(--cell-size);
    margin: var(--cell-spacing);
    background-color: transparent;
    border-radius: 4px;
    animation: ripple 1.5s ease infinite;
  }

  ${[...Array(5)]
    .map(
      (_, i) => `
      .cell.d-${i} {
        animation-delay: ${i * 100}ms;
      }
    `
    )
    .join("")}

  .cell:nth-child(1) {
    --cell-color: #00ff87;
  }
  .cell:nth-child(2) {
    --cell-color: #0cfd95;
  }
  .cell:nth-child(3) {
    --cell-color: #17fba2;
  }
  .cell:nth-child(4) {
    --cell-color: #23f9b2;
  }
  .cell:nth-child(5) {
    --cell-color: #30f7c3;
  }
  .cell:nth-child(6) {
    --cell-color: #3df5d4;
  }
  .cell:nth-child(7) {
    --cell-color: #45f4de;
  }
  .cell:nth-child(8) {
    --cell-color: #53f1f0;
  }
  .cell:nth-child(9) {
    --cell-color: #60efff;
  }

  @keyframes ripple {
    0%,
    100% {
      background-color: transparent;
    }
    30% {
      background-color: var(--cell-color);
    }
    60% {
      background-color: transparent;
    }
  }
`;

export default Loader;
