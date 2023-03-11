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
    axios.get(`${process.env.ORIGIN}/works/${id}`,{
      headers: {
       apikey: process.env.APIKEY
       }
     }).then((response) => {
       setWork(response.data.data)
       console.log(response.data.data)
 
       axios.get(`${process.env.ORIGIN}/users/${response.data.data.user}`,{
       headers: {
       apikey: process.env.APIKEY
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

      <button onClick={handleButtonClick}>Consultar</button>

      {
        !!checkingIsOpen && (<Modal
        isOpen={checkingIsOpen}
        onRequestClose={handleCheckingClose}
        style={customModalStyles}
        contentLabel="Número de seguridad"
      >
        <h2>Número de seguridad</h2>
        <p>Por favor ingrese el número de seguridad:</p>
        <input type="text" value={phone} onChange={handleSecretChange} />
        <button onClick={handleModalSubmit}>Verificar</button>
      </Modal>)
      }
      
      {
        !!descriptionIsOpen && (<Modal
          isOpen={descriptionIsOpen}
          onRequestClose={handleDescriptionClose}
          style={customModalStyles}
          contentLabel="Descripcion"
        >
          <h2>{id}</h2>
          <ul>
            <li>Descripcion: {work.description}</li>
            <li>Cliente: {user.name}</li>
            <li>Teléfono: {user.phone}</li>
            <li>Fecha de Recepcion: {work.receptionDate}</li>
            <li>Fecha de entrega: {work.deliveryDate ?? "sin fecha"}</li>
            <li>En proceso: {(work.finished && "terminado") || "sin terminar"}</li>
            <li>Precio: {work.price ?? "sin datos"}</li>
          </ul>
          {
            !work.finished && (<button onClick={handleDescriptionClose}>Cerrar</button>)
          }
          {
            !!work.finished && <button>Coordinar Retiro</button> && <button>Coordinar entrega</button>
          }
        </Modal>)
      }
      
    </div>
  );
}

export default App;