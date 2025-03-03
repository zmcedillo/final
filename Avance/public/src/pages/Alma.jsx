import React from 'react';
import { useNavigate } from 'react-router-dom';
import Contrato from '../assets/Contrato.png';
import './Alma.css';

function Alma() {
    const navigate = useNavigate();
    const handleSellSoul = () => {
        alert('¡Gracias por confiarnos tu alma! Tus productos se enviaran una vez nuestro becario Jacobo confirme que recibimos su alma correctamente'); // Replace this with your actual logic
        navigate('/home'); // Optionally redirect after selling
    };

    return (
        <div className="alma-container">
            <h1>Contrato de Venta de Alma entre el comprador y © HardwareZone</h1>
            <div className="contract-template">
                {/* Placeholder for your contract image */}
                <img src={Contrato} alt="Contrato" className="contract-image"/>
            </div>
            <div className="input-fields">
                <label htmlFor="name">Nombre:</label>
                <input type="text" id="name" name="name" />
            </div>
            <div className="signature-area">
                <label htmlFor="signature">Firma:</label>
                <input type="text" id="signature" name="signature" />
            </div>
            <button className="sell-soul-button" onClick={handleSellSoul}>Vender tu Alma</button>
        </div>
    );
}

export default Alma;