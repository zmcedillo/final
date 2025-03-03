import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Success.css';

const Success = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const BACKEND_URL = 'https://final-backend-r0x7.onrender.com/api/auth';

  const checkPaymentStatus = async (sessionId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/check-payment-status/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al verificar el estado del pago.');
      }

      const data = await response.json();
      if (data.status === 'paid') {
        //alert('Pago completado y carrito vaciado.' );
      } else {
        console.log('Pago no completado:', data.message);
        alert('Pago no completado');
      }
    } catch (error) {
      console.error('Error al verificar el estado del pago:', error);
      alert('Error al verificar el estado del pago.');
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      checkPaymentStatus(sessionId);
    }
  }, []);

  return (
    <div className="success-container">
      <div className="success-content">
        <div className="check-icon">✓</div>
        <h1>Pago Finalizado</h1>
        <Link to="/home" className="continue-shopping-button" onClick={()=> navigate('/home')}>Seguir Comprando</Link>
      </div>
    </div>
  );
};

export default Success;