import React from 'react';
import { useNavigate } from 'react-router-dom';
import Contrato from '../assets/Contrato.png';
import './Alma.css';

function Alma() {
  const navigate = useNavigate();
  const handleSellSoul = () => {
    alert(
      '¡Gracias por confiarnos tu alma! Tus productos se enviaran una vez nuestro becario Jacobo confirme que recibimos su alma correctamente'
    );
    navigate('/home');
  };

  return (
    <div className="alma-container">
      <h1>Contrato de Venta de Alma entre el comprador y © HardwareZone</h1>
      <div className="contract-wrapper"> {/* New wrapper for relative positioning */}
        <img src={Contrato} alt="Contrato" className="contract-image" />
        <div className="input-fields-on-image"> {/* Container for absolute positioning */}
          <div className="name-field">
            <label htmlFor="name">Nombre:</label>
            <input type="text" id="name" name="name" />
          </div>
          <div className="signature-field">
            <label htmlFor="signature">Firma:</label>
            <input type="text" id="signature" name="signature" />
          </div>
        </div>
      </div>
      <button className="sell-soul-button" onClick={handleSellSoul}>
        Vender tu Alma
      </button>
    </div>
  );
}

export default Alma;
