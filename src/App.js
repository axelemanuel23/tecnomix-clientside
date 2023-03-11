import './App.css';

import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function App() {
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [user, setUser] = useState({});
  const [work, setWork] = useState({});
  const [checkingIsOpen, setCheckingIsOpen] = useState(false);
  const [descriptionIsOpen, setDescriptionIsOpen] = useState(false);

  const handleIdChange = (event) => {
    setId(event.target.value);
  };

  const handleSecretChange = (event) => {
    setPhone(event.target.value);
  };

  const handleButtonClick = () => {
    axios.get("https://tecnomix-backend-production.up.railway.app/api/v1/works/" + id,{
      headers: {
       apikey: "axel"
       }
     }).then((response) => {
       setWork(response.data.data)
       console.log(response.data.data)
 
       axios.get("https://tecnomix-backend-production.up.railway.app/api/v1/users/" + response.data.data.user,{
       headers: {
       apikey: "axel"
       }
     }).then((response) => {
       setUser(response.data.data)
       console.log(response.data.data)
       setCheckingIsOpen(true)
     })
     })
 };

 const handleCheckingClose = () => {
  setCheckingIsOpen(false);
}; 
const handleDescriptionClose = () => {
  setDescriptionIsOpen(false);
};

  const handleModalSubmit = () => {

    if (phone == user.phone) {
      setCheckingIsOpen(false);
      setDescriptionIsOpen(true);
    } else {
      alert('El número de teléfono es incorrecto.');
    }
  };

  return (
    <div className='main'>
      <label htmlFor="id-input"><p>ID:</p></label>
      <input type="text" id="id-input" value={id} onChange={handleIdChange} />

      <button className='search-button' onClick={handleButtonClick}>Consultar</button>

      {
        !!checkingIsOpen && (
        <Modal
        isOpen={checkingIsOpen}
        onRequestClose={handleCheckingClose}
        style={customModalStyles}
        contentLabel="Número de seguridad"
      > 
      <div className='secret-modal'>
        <h2>Número de seguridad</h2>
        <label htmlFor="secret-input">Por favor ingrese el número de seguridad:</label>
        <input id="secret-input" type="text" value={phone} onChange={handleSecretChange} />
        <button className='verify-button' onClick={handleModalSubmit}>Verificar</button>
      </div>
      </Modal>)
      }
      
      {
        !!descriptionIsOpen && (<Modal
          isOpen={descriptionIsOpen}
          onRequestClose={handleDescriptionClose}
          style={customModalStyles}
          contentLabel="Descripcion"
        >
          <div className='description-modal'>
          <h2>Servicio N°:</h2>
          <h3>{id}</h3>
          <ul>
            <li>Descripcion: {work.description}</li>
            <li>Cliente: {user.name}</li>
            <li>Teléfono: {user.phone}</li>
            <li>Fecha de Recepcion: {work.receptionDate}</li>
            <li>Accesorios: {work.accesories}</li>
            <li>En proceso: {(!!work.finished && "Terminado") || "En reparación"}</li>
            <li>Fecha de entrega: {work.deliveryDate ?? "Sin fecha de entrega"}</li>
            <li>Entregado: {(!!work.delivered && "Entregado" ) || "Sin entregar"}</li>
            <li>Precio: {work.price ?? "Sin datos disponibles"}</li>
          </ul>
          {
            !work.finished && (<button onClick={handleDescriptionClose}>Cerrar</button>)
          }
          {
            (!!work.finished && !work.deliveryDate) && (<div><button>Coordinar retiro</button> <button>Coordinar entrega</button></div>)
          }
          {
            (!!work.deliveryDate && !work.delivered) && (<span>En proceso de entrega/retiro, consulte su fecha y horario seleccionado.</span>)
          }
          {
            !!work.delivered && <span>Producto entregado, gracias por elegirnos!</span>
          }
          </div>
        </Modal>)
      }
      
    </div>
  );
}

export default App;