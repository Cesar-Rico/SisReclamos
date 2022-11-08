import React, { useEffect, useState } from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link, useLocation } from "react-router-dom"
import { Table, Paper, TableContainer, TableHead, TableCell, TableRow, TableBody, tableCellClasses } from '@mui/material';
import {styled} from '@mui/material/styles'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import loadingGIF from '../images/loading.gif'
import Modal from 'react-bootstrap/Modal'
function ModalCentrado(props) {

    return (
        <Modal
          {...props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          dialogClassName="modal-100h"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <small>Información Solicitada</small>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body >
            <div style={{minHeight: '5rem'}}>
            {props.urlFile != "" ?
            <div>
                <label for="numeroCliente" style={{fontSize: '18px'}}>{props.informacionAdicional.nombreArchivo}</label>
                <button onClick={() => {
                    const link = document.createElement('a');
                    link.href = props.urlFile;
                    link.setAttribute(
                      'download',
                      props.informacionAdicional.nombreArchivo + ".pdf",
                    );
                
                    // Append to html link element page
                    document.body.appendChild(link);
                
                    // Start download
                    link.click();
                
                    // Clean up and remove the link
                    link.parentNode.removeChild(link);
                }}>Descargar</button>
            </div>
            : null}
            {props.texto != "" ? 
            <div>
                <label for="numeroCliente" style={{fontSize: '18px'}}>{props.informacionAdicional.nombreTexto}</label>
                <textarea value={props.informacionAdicional.texto} rows="4" cols="40"></textarea>
            </div>
            : null}
            </div>
          </Modal.Body>
          <Modal.Footer>
                <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '2rem'}} onClick={props.onHide}>Volver</button>
          </Modal.Footer>
        </Modal>
      );
}

function ModalCentradoGenerarTicket(props) {
    const navigate = useNavigate();
    const [personalEmpresaSeleccionada, setPersonalEmpresaSeleccionada] = useState(props.personalEmpresa[0].idPersonalEmpresa)
    const [descripcion, setDescripcion] = useState("")
    const generacionTicket = () => {
        const result = axios({
            method: 'POST',
            url: 'http://127.0.0.1:5000/ticket/registrar',
            data: {
                numeroCliente: props.numeroCliente,
                descripcion: descripcion,
                idPersonal: personalEmpresaSeleccionada,
                idAtencionComercial: props.idAtencionComercial
            },
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1234'
            }
        })
        .then(function(response){
            const mensajeAlerta = "Generaste un ticket para la atención comercial seleccionada";
            navigate('/atencionComercial', {state: {mensajeAlerta: mensajeAlerta}});
        });
    }
    return (
        <Modal
          {...props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          dialogClassName="modal-100h"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <small>¿Está seguro que desea declarar la Atención Comercial como Ticket?</small>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body >
            <div style={{minHeight: '5rem'}}>
            <label for="instancia" style={{fontSize: '18px'}}>Seleccione Personal Asignado:</label>
            <select style={{width: '20rem'}} value={personalEmpresaSeleccionada} onChange={e => setPersonalEmpresaSeleccionada(e.target.value)}>
                {props.personalEmpresa.map((personal, id) => (
                            <option value={personal.idPersonalEmpresa} key={id}>
                                {personal.nombre}
                            </option>
                        ))}
            </select>
            <label for="descripcionTicket" style={{fontSize: '18px', marginTop: '1rem'}}>Ingrese descripción ticket:</label>
            <textarea id="descripcionTicket" rows="4" cols="40" type="text" name="descripcionTicket" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div>
            <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '2rem'}} onClick={props.onHide}>Cancelar</button>
            <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '6rem', marginRight: '2rem'}} onClick={() => generacionTicket()}>Aceptar</button>
            </div>
          </Modal.Footer>
        </Modal>
      );
}

export default function VisualizarAtencionComercial(props){

    const navigate = useNavigate();
    const [atencionComercial, setAtencionComercial] = useState({});
    const [showModalInformacion, setShowModalInformacion] = useState(false);
    const [showModalGeneracionTicket, setShowModalGeneracionTicket] = useState(false);
    const [personalEmpresa, setPersonalEmpresa] = useState([]);
    const [urlFile, setUrlFile] = useState("");
    const [informacionAdicional, setInformacionAdicional] = useState({});
    const estado = useLocation();
    const codigoAtencionComercial = estado.state.codigoAtencionComercial;
    console.log("codigo wea", codigoAtencionComercial)
    useEffect(() => {
        axios.get('http://127.0.0.1:5000/atencionComercial/visualizar/' + codigoAtencionComercial,{headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => {
            setAtencionComercial(res.data);
            console.log("Data", res.data);
        });
        axios.get('http://127.0.0.1:5000/listarPersonal',{headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => setPersonalEmpresa(res.data));
    }, [])

    const llamarSolicitarInformacion = (idAtencionComercial) => {
        
        axios({
            url: "http://127.0.0.1:5000/atencionComercial/solicitarInformacionAdicionalArchivo/" + idAtencionComercial,
            method: "GET",
            responseType: "blob",
            headers: { "Content-Type": "multipart/form-data", 'ngrok-skip-browser-warning': '1234'}
        }).then((res) => {
            console.log("data", res.data);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            setUrlFile(url);
        })
        axios({
            url: "http://127.0.0.1:5000/atencionComercial/solicitarInformacionAdicionalTexto/" + idAtencionComercial,
            method: "GET",
            headers: { "Content-Type": "multipart/form-data", 'ngrok-skip-browser-warning': '1234'}
        }).then((res) => {
            console.log("data", res.data);
            setInformacionAdicional(res.data);
            setShowModalInformacion(true);
        })       
        setShowModalInformacion(true);
    }

    const setShowModalGenerarTicket = () => {
        setShowModalGeneracionTicket(true);
    }
    return(
        <div className="containerApp">
            <div className='sidebar'>
            <ProSidebar>
                <Menu iconShape="square" style={{backgroundColor: 'white', height: '100%', position: 'relative'}}>
                    <MenuItem id="primeraOpcion" style={{color: 'black'}}>
                        Reclamos canal de atención
                        <Link to="/personal"/>
                    </MenuItem>
                    <div id="hola" style={{backgroundColor: '#5d5fef', borderRadius: '5px'}}>
                    <MenuItem style={{color: 'white'}}>
                        Atenciones Comerciales
                        <Link to="/atencionComercial" />
                        </MenuItem>
                    </div>
                    <MenuItem style={{color: 'black'}}>
                        Tickets
                        <Link to="/tickets" />
                        </MenuItem>
                        <MenuItem style={{bottom: '0', position: 'absolute', color: 'black'}}>
                            Cerrar sesión
                            <Link to="/" />
                        </MenuItem>
                </Menu>
            </ProSidebar>
            </div>
            <div className="content" style={{marginLeft: '4rem'}}>
            <div style={{ boxShadow: '0 0 3px #ccc', marginTop: '2rem', padding: '25px 0', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))', fontWeight: '500', fontSize: '28px', lineHeight: '34.13px', width: '78rem'}}>Visualizar Atención Comercial</div>
            {Object.keys(atencionComercial).length === 0 ? <img id="loading" style={{position : 'absolute', left: '0', right: '0', marginLeft: 'auto', marginRight: 'auto', width: '100px', top: '0', bottom: '0', marginTop: 'auto', marginBottom: 'auto', height: '100px'}} src={loadingGIF} alt="loading..." /> :
            <div>
            <div style={{width: '100rem', display: 'flex', width: '78rem'}}>
                <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="codigoAtencionComercial" style={{fontSize: '18px'}}>Código Atención Comercial</label>
                        <input id="codigoAtencionComercial" type="number" value={atencionComercial.idAtencionComercial} name="codigoAtencionComercial" disabled></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="numeroCliente" style={{fontSize: '18px'}}>Número Cliente</label>
                        <input id="numeroCliente" type="number" value={atencionComercial.numeroCliente} name="numeroCliente" disabled></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="dniCliente" style={{fontSize: '18px'}}>DNI Cliente</label>
                        <input id="dniCliente" type="number" value={atencionComercial.dniCliente} name="dniCliente" disabled></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="tipoCliente" style={{fontSize: '18px'}}>Tipo Cliente</label>
                        <input id="tipoCliente" type="text" value={atencionComercial.tipoCliente} name="tipoCliente" disabled></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="fechaRegistro" style={{fontSize: '18px'}}>Fecha Procesado</label>
                        <input id="fechaRegistro" value={atencionComercial.fechaProcesado} name="fechaRegistro" disabled></input>
                    </div>                   
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="descripcion" style={{fontSize: '18px'}}>Descripcion</label>
                        <textarea id="descripcion" rows="5" cols="50" type="text" name="descripcion" value={atencionComercial.descripcion} disabled></textarea>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="ubicacion" style={{fontSize: '18px'}}>Ubicacion</label>
                        <input id="ubicacion" type="text" value={atencionComercial.ubicacion} name="ubicacion" disabled></input>
                    </div>

                </div>
                <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="instancia" style={{fontSize: '18px'}}>Instancia</label>
                        <input id="instancia" type="text" name="instancia" disabled value={atencionComercial.instancia}></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="fechaRegistrado" style={{fontSize: '18px'}}>Fecha reclamo registrado</label>
                        <input id="fechaRegistrado" name="fechaRegistrado" value={atencionComercial.fechaRegistro} disabled></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="tarifa" style={{fontSize: '18px'}}>Tarifa</label>
                        <input id="tarifa" type="text" name="tarifa" disabled value={atencionComercial.tarifa}></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="tipoClasificacion" style={{fontSize: '18px'}}>Tipo Clasificación</label>
                        <input id="tipoClasificacion" type="text" name="tipoClasificacion" disabled value={atencionComercial.tipoClasificacion}></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="potenciaMinima" style={{fontSize: '18px'}}>Potencia mínima</label>
                        <input id="potenciaMinima" type="text" name="potenciaMinima" disabled value={atencionComercial.potenciaMinima}></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="potenciaMaxima" style={{fontSize: '18px'}}>Potencia máxima</label>
                        <input id="potenciaMaxima" type="text" name="potenciaMaxima" disabled value={atencionComercial.potenciaMaxima}></input>
                    </div>

                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="numeroTicketAsociado" style={{fontSize: '18px'}}>Número ticket asociado</label>
                        <input id="numeroTicketAsociado" type="text" name="numeroTicketAsociado" disabled value={atencionComercial.numeroTicketAsociado} style={{backgroundColor: '#DCDCDC'}}></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem',width: '17rem'}}>                       
                        <label for="numeroTicketAsociado" style={{fontSize: '18px'}}>Información adicional solicitada</label>
                        <div style={{display: 'flex', position: 'relative'}}>
                        <input id="numeroTicketAsociado" type="text" name="numeroTicketAsociado" disabled style={{backgroundColor: '#DCDCDC'}}></input>
                        <VisibilityIcon style={{position: 'absolute', marginLeft: '14.5rem',marginTop: '3px', cursor: 'pointer'}} onClick={() => {
                            if(!atencionComercial.necesitaInformacionAdicional){
                                llamarSolicitarInformacion(atencionComercial.idAtencionComercial);
                            }                         
                        }}/>
                        </div>
                        {atencionComercial.necesitaInformacionAdicional ? <label style={{fontSize: '10px', color: 'red'}}>Requiere información del cliente</label> : null}
                    </div>
                </div>
            </div>
            <div style={{textAlign: 'center', marginTop: '1rem'}}>
            <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '3rem'}} onClick={() => navigate('/atencionComercial')}>Volver</button>
            <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '9rem'}} onClick={() => setShowModalGenerarTicket()} disabled={atencionComercial.necesitaInformacionAdicional || atencionComercial.numeroTicketAsociado != ""}>Generar Ticket</button>
            </div>
            </div>
            }
            {showModalInformacion ? <ModalCentrado show={showModalInformacion} urlFile={urlFile} informacionAdicional={informacionAdicional} onHide={() => {setShowModalInformacion(false);}} ></ModalCentrado> : null }
            {showModalGeneracionTicket ? <ModalCentradoGenerarTicket show={showModalGeneracionTicket} idAtencionComercial={atencionComercial.idAtencionComercial} numeroCliente={atencionComercial.numeroCliente} personalEmpresa={personalEmpresa} onHide={() => {setShowModalGeneracionTicket(false)}}></ModalCentradoGenerarTicket> : null}
            </div>
        </div>
    )
}