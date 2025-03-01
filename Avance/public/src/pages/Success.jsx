import React from 'react';
import { Link } from 'react-router-dom';
import './Success.css';

const Success = () => {
  return (
    <div className="success-container">
      <div className="success-content">
        <div className="check-icon">✓</div>
        <h1>Pago Finalizado</h1>
        <Link to="/home" className="continue-shopping-button">Seguir Comprando</Link>
      </div>
    </div>
  );
};

export default Success;