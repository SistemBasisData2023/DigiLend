import React from "react";
import styled, { keyframes } from "styled-components";

export const TextAnimation = ({ word }) => {
  const reactArray = word.split("");
  return (
    <Wrapper className="md:text-7xl sm:text-5xl text-4xl font-bold font-Montserrat text-accent-focus">
      {reactArray.map((item, index) => (
        <span key={index}>{item}</span>
      ))}
    </Wrapper>
  );
};

const animation = keyframes`
  0% { opacity: 0; transform: translateY(-100px) skewX(10deg) skewY(10deg) rotateZ(30deg); filter: blur(10px); }
  25% { opacity: 1; transform: translateY(0) skewX(0deg) skewY(0deg) rotateZ(0deg); filter: blur(0px); }
  75% { opacity: 1; transform: translateY(0) skewX(0deg) skewY(0deg) rotateZ(0deg); filter: blur(0px); }
  100% { opacity: 0; transform: translateY(-100px) skewX(10deg) skewY(10deg) rotateZ(30deg); filter: blur(10px); }
`;

const Wrapper = styled.div`
  display: inline-block;

  span {
    display: inline-block;
    opacity: 0;
    animation-name: ${animation};
    animation-duration: 6s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  span:nth-child(1) {
    animation-delay: 0.1s;
  }
  span:nth-child(2) {
    animation-delay: 0.2s;
  }
  span:nth-child(3) {
    animation-delay: 0.3s;
  }
  span:nth-child(4) {
    animation-delay: 0.4s;
  }
  span:nth-child(5) {
    animation-delay: 0.5s;
  }
  span:nth-child(6) {
    animation-delay: 0.6s;
  }
  span:nth-child(7) {
    animation-delay: 0.7s;
  }
  span:nth-child(8) {
    animation-delay: 0.8s;
  }
  span:nth-child(9) {
    animation-delay: 0.9s;
  }
`;
