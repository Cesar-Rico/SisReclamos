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

function ModalCentradoOrdenTrabajo(props) {

    const navigate = useNavigate();
    const [informacionBrindada, setInformacionBrindada] = useState({})
    const [selectedFile, setSelectedFile] = useState({});
    const [isFile, setIsFile] = useState(false);

    const finalizarOrdenTrabajo = () => {
        const result = axios({
            method: 'POST',
            url: 'http://127.0.0.1:5000/ticket/ordenDeTrabajo/cerrar/' + props.ordenTrabajo.idNumeroOrden,
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1234'
            }
        })
        .then(function(response){
            const mensajeAlerta = "Cerraste la orden de trabajo";
            navigate('/tickets', {state: {mensajeAlerta: mensajeAlerta}});
        });
    }
    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          dialogClassName="modal-100h"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <small>Orden de trabajo</small>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body >
            <div style={{minHeight: '5rem'}}>
            {Object.keys(props.ordenTrabajo).length === 0 ? <img id="loading" style={{position : 'absolute', left: '0', right: '0', marginLeft: 'auto', marginRight: 'auto', width: '100px', top: '0', bottom: '0', marginTop: 'auto', marginBottom: 'auto', height: '100px'}} src={loadingGIF} alt="loading..." /> :
            <div style={{display: 'flex'}}>
                <div style={{display: 'flex', flexDirection: 'column', width: '50%', marginLeft: '2rem'}}>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="numeroOrden" style={{fontSize: '18px'}}>Número de orden</label>
                        <input id="numeroOrden" value={props.ordenTrabajo.numeroOrden} disabled style={{backgroundColor: '#DCDCDC'}}></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="fechaEmision" style={{fontSize: '18px'}}>Fecha Emision</label>
                        <input id="fechaEmision" value={props.ordenTrabajo.fechaEmision} disabled style={{backgroundColor: '#DCDCDC'}}></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="fechaEntrega" style={{fontSize: '18px'}}>Fecha Entrega</label>
                        <input id="fechaEntrega" value={props.ordenTrabajo.fechaEntrega} disabled style={{backgroundColor: '#DCDCDC'}}></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem',width: '17rem'}}>                       
                        <label for="documentoOrdenTrabajo" style={{fontSize: '18px'}} >Documento orden de trabajo</label>
                        <div style={{display: 'flex', position: 'relative'}}>
                        <button onClick={() => {
                            const link = document.createElement('a');
                            link.href = props.urlFile;
                            link.setAttribute(
                            'download',
                            "OrdenDeTrabajo.pdf",
                            );
                        
                            // Append to html link element page
                            document.body.appendChild(link);
                        
                            // Start download
                            link.click();
                        
                            // Clean up and remove the link
                            link.parentNode.removeChild(link);
                        }}>Descargar</button>
                        </div>
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="numeroOrden" style={{fontSize: '18px'}}>Descripción servicio</label>
                        <textarea id="descripcionTicket" rows="4" cols="30" type="text" name="descripcionTicket" value={props.ordenTrabajo.descripcionServicio} disabled style={{backgroundColor: '#DCDCDC'}}></textarea>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="fechaEmision" style={{fontSize: '18px'}}>Contratista Asignado</label>
                        <input id="fechaEmision" value={props.ordenTrabajo.personalAsignado} disabled style={{backgroundColor: '#DCDCDC'}}></input>
                    </div>
                </div>
            </div>
            }
            </div>
          </Modal.Body>
          <Modal.Footer>

            <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '2rem'}} onClick={props.onHide}>Volver</button>
            {!props.ticketFinalizado ?
            <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '14rem'}} onClick={() => finalizarOrdenTrabajo()}>Finalizar Orden de Trabajo</button>

            : null}
          </Modal.Footer>
        </Modal>
      );
}

function ModalCentradoGenerarOrdenTrabajo(props) {
    const navigate = useNavigate();
    const [file, setFile] = useState({})
    
    const generacionOrdenTrabajo = () => {
        
        const result = axios({
            method: 'POST',
            url: 'http://127.0.0.1:5000/ticket/ordenDeTrabajo/registrar',
            data: {
                idAtencionComercial: props.idAtencionComercial,
                fechaEntrega: props.fechaEntrega,
                descripcion: props.descripcion,
                tipoServicio: props.tipoServicio,
                notas: props.notas,
                costo: props.costo,
                resultados: props.resultados
            },
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1234'
            }
        })
        .then(function(response){
            const formData = new FormData();
            formData.append("file", file);
            axios({
                method: "post",
                url: "http://127.0.0.1:5000/ticket/ordenDeTrabajo/subirDocumento/" + response.data.idOrdenTrabajo,
                data: formData,
                headers: { "Content-Type": "multipart/form-data", 'ngrok-skip-browser-warning': '1234'}
            })
            .then(function(response){
                const mensajeAlerta = "Generaste una orden de trabajo para el ticket";
                navigate('/tickets', {state: {mensajeAlerta: mensajeAlerta}});
            })
            .catch(function(response){
                alert("Error al subir archivo");
            });  
        });
    }

    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          dialogClassName="modal-100h"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <small style={{fontSize: '18px'}}>¿Está seguro que desea generar una orden de trabajo para aprobación del cliente?</small>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <label for="ordenTrabajo" style={{fontSize: '18px'}}>Documento Orden de Trabajo</label>
          <input id="ordenTrabajo" onChange={(e) => setFile(e.target.files[0])} type="file" ></input>
          </Modal.Body>

          <Modal.Footer>
            <div>
            <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '2rem'}} onClick={props.onHide}>Cancelar</button>
            <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '6rem', marginRight: '2rem'}} onClick={() => generacionOrdenTrabajo()}>Aceptar</button>
            </div>
          </Modal.Footer>
        </Modal>
      );
}

function ModalEnviarDocumentoRespuesta(props) {
    const navigate = useNavigate();
    const [file, setFile] = useState({})
    
    const enviarDocumentoRespuesta = () => {
        
        const formData = new FormData();
        formData.append("file", file);
        axios({
            method: "post",
            url: "http://127.0.0.1:5000/ticket/documentoRespuesta/subirDocumento/" + props.idOrdenTrabajo,
            data: formData,
            headers: { "Content-Type": "multipart/form-data", 'ngrok-skip-browser-warning': '1234'}
        })
        .then(function(response){
            const mensajeAlerta = "Enviaste el documento respuesta al cliente";
            navigate('/tickets', {state: {mensajeAlerta: mensajeAlerta}});
        })
        .catch(function(response){
            alert("Error al subir archivo");
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
              <small style={{fontSize: '18px'}}>Adjuntar Documento Respuesta</small>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <label for="documentoRespuesta" style={{fontSize: '18px'}}>Documento Respuesta</label>
          <input id="documentoRespuesta" onChange={(e) => setFile(e.target.files[0])} type="file" ></input>
          </Modal.Body>

          <Modal.Footer>
            <div>
            <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '2rem'}} onClick={props.onHide}>Cancelar</button>
            <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '6rem', marginRight: '2rem'}} onClick={() => enviarDocumentoRespuesta()}>Aceptar</button>
            </div>
          </Modal.Footer>
        </Modal>
      );
}


export default function EditarTicket(props){

    const navigate = useNavigate();
    const [ticket, setTicket] = useState({});
    const [showModalInformacion, setShowModalInformacion] = useState(false);
    const [showModalGeneracionOrdenTrabajo, setShowModalGeneracionOrdenTrabajo] = useState(false);
    const [notas, setNotas] = useState("")
    const [costo, setCosto] = useState("")
    const [resultados, setResultados] = useState("")
    const [descripcionTicket, setDescripcionTicket] = useState("")
    const [tipoServicio, setTipoServicio] = useState("")
    const [ordenTrabajo, setOrdenTrabajo] = useState({})
    const [showModalOrdenTrabajo, setShowModalOrdenTrabajo] = useState(false);
    const [showModalEnviarDocumentoRespuesta, setShowModalEnviarDocumentoRespuesta] = useState(false);
    const [urlFile, setUrlFile] = useState("");
    const [nombreArchivo, setNombreArchivo] = useState("");
    const estado = useLocation();
    const codigoTicket = estado.state.codigoTicket;
    console.log("codigo ticket", codigoTicket)


    useEffect(() => {
        axios.get('http://127.0.0.1:5000/ticket/visualizar/' + codigoTicket,{headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => {
            setTicket(res.data);
            console.log("Data", res.data);
            setNotas(res.data.notas);
            setCosto(res.data.costo);
            setTipoServicio(res.data.tipoServicio);
            setResultados(res.data.resultados);
            setDescripcionTicket(res.data.descripcion);
        });
    }, [])

    const setShowGenerarOrdenDeTrabajo = () => {
        setShowModalGeneracionOrdenTrabajo(true);
    }

    const abrirModalDocumentoRespuesta = () => {
        setShowModalEnviarDocumentoRespuesta(true);

    }

    const abrirModalOrdenTrabajo = (idOrdenTrabajo) => {
        
        axios.get("http://127.0.0.1:5000/ticket/verOrdenTrabajo/" + idOrdenTrabajo, {headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => {
            setOrdenTrabajo(res.data);
            console.log(res.data);
            setShowModalOrdenTrabajo(true);
        });

        axios({
            url: "http://127.0.0.1:5000/ticket/descargarOrdenTrabajo/" + idOrdenTrabajo,
            method: "GET",
            responseType: "blob",
            headers: { "Content-Type": "multipart/form-data", 'ngrok-skip-browser-warning': '1234'}
        }).then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            console.log("url", url);
            setUrlFile(url);
            setShowModalOrdenTrabajo(true);
        })

    }
    const actualizarTicket = () => {
        const result = axios({
            method: 'POST',
            url: 'http://127.0.0.1:5000/ticket/ordenDeTrabajo/registrar',
            data: {
                idOrdenTrabajo : ticket.idOrdenTrabajo,
                notas: notas,
                tipoServicio: tipoServicio,
                costo: costo,
                resultados: resultados
            },
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1234'
            }
        })
        .then(function(response){
            const mensajeAlerta = "Actualizaste el ticket";
            navigate('/tickets', {state: {mensajeAlerta: mensajeAlerta}});
        });
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
                    
                    <MenuItem style={{color: 'black'}}>
                        Atenciones Comerciales
                        <Link to="/atencionComercial" />
                    </MenuItem>
                    <div id="hola" style={{backgroundColor: '#5d5fef', borderRadius: '5px'}}>
                    <MenuItem style={{color: 'white'}}>
                        Tickets
                        <Link to="/tickets" />
                        </MenuItem>
                    </div>
                        <MenuItem style={{bottom: '0', position: 'absolute', color: 'black'}}>
                            Cerrar sesión
                            <Link to="/" />
                        </MenuItem>
                    
                </Menu>
            </ProSidebar>
            </div>
            <div className="content" style={{marginLeft: '4rem'}}>
            <div style={{ boxShadow: '0 0 3px #ccc', marginTop: '2rem', padding: '25px 0', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))', fontWeight: '500', fontSize: '28px', lineHeight: '34.13px', width: '78rem'}}>Editar Ticket</div>
            {Object.keys(ticket).length === 0 ? <img id="loading" style={{position : 'absolute', left: '0', right: '0', marginLeft: 'auto', marginRight: 'auto', width: '100px', top: '0', bottom: '0', marginTop: 'auto', marginBottom: 'auto', height: '100px'}} src={loadingGIF} alt="loading..." /> :
            <div>
            <div style={{width: '100rem', display: 'flex', width: '78rem'}}>
                <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
                    <div style={{float:'left', marginRight: '20px', marginTop: '3rem'}}>
                        <label for="codigoAtencionComercial" style={{fontSize: '18px'}}>Código Ticket</label>
                        <input id="codigoAtencionComercial" value={ticket.idTicket} name="codigoAtencionComercial" disabled style={{backgroundColor: '#DCDCDC'}}></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '3rem'}}>
                        <label for="numeroCliente" style={{fontSize: '18px'}}>Fecha Maxima Atencion</label>
                        <input id="numeroCliente" value={ticket.fechaMaximaAtencion} name="numeroCliente" disabled style={{backgroundColor: '#DCDCDC'}}></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '3rem'}}>
                        <label for="dniCliente" style={{fontSize: '18px'}}>Fecha Procesado</label>
                        <input id="dniCliente" value={ticket.fechaProcesado} name="dniCliente" disabled style={{backgroundColor: '#DCDCDC'}}></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '3rem'}}>
                        <label for="tipoCliente" style={{fontSize: '18px'}}>Descripción servicio</label>
                        {ticket.idOrdenTrabajo == -1 ?
                        <textarea id="tipoCliente" type="text" value={descripcionTicket} onChange={e => setDescripcionTicket(e.target.value)} name="tipoCliente" rows="3" cols="30"></textarea>
                        :
                        <textarea id="tipoCliente" type="text" value={descripcionTicket} onChange={e => setDescripcionTicket(e.target.value)} name="tipoCliente" rows="3" cols="30" disabled style={{backgroundColor: '#DCDCDC'}}></textarea>
                        }
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '3rem'}}>
                        <label for="nombrePersonal" style={{fontSize: '18px'}}>Personal Asignado</label>
                        <input id="nombrePersonal" value={ticket.nombrePersonal} name="nombrePersonal" disabled style={{backgroundColor: '#DCDCDC'}}></input>
                    </div>                   

                </div>
                <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="instancia" style={{fontSize: '18px'}}>Notas</label>
                        {ticket.ordenDeTrabajoRechazada || !ticket.ordenDeTrabajoAprobada?
                        <textarea id="instancia" name="instancia" value={notas} onChange={e => setNotas(e.target.value)} rows="3" cols="30" type="text" disabled style={{backgroundColor: '#DCDCDC'}} ></textarea>
                        :
                        <textarea id="instancia" name="instancia" value={notas} onChange={e => setNotas(e.target.value)} rows="3" cols="30" type="text" ></textarea>
                        }   
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="instancia" style={{fontSize: '18px'}}>Tipo Servicio</label>
                        {ticket.ordenDeTrabajoRechazada || !ticket.ordenDeTrabajoAprobada?
                            <input id="instancia" name="instancia" value={tipoServicio} onChange={e => setTipoServicio(e.target.value)} type="text" disabled style={{backgroundColor: '#DCDCDC'}}></input>
                        :
                            <input id="instancia" name="instancia" value={tipoServicio} onChange={e => setTipoServicio(e.target.value)} type="text" ></input>             
                        }
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="fechaRegistrado" style={{fontSize: '18px'}}>Costo</label>
                        {ticket.ordenDeTrabajoRechazada || !ticket.ordenDeTrabajoAprobada?
                        <textarea id="fechaRegistrado" name="fechaRegistrado" value={costo} onChange={e => setCosto(e.target.value)}rows="2" cols="30" type="text" disabled style={{backgroundColor: '#DCDCDC'}}></textarea>
                        :
                        <textarea id="fechaRegistrado" name="fechaRegistrado" value={costo} onChange={e => setCosto(e.target.value)}rows="2" cols="30" type="text" ></textarea>
                        }
                        </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="tarifa" style={{fontSize: '18px'}}>Resultados</label>
                        {ticket.ordenDeTrabajoRechazada || !ticket.ordenDeTrabajoAprobada?
                        <textarea id="tarifa" name="tarifa" value={resultados} onChange={e => setResultados(e.target.value)} rows="6" cols="40" type="text" disabled style={{backgroundColor: '#DCDCDC'}} ></textarea>
                        :
                        <textarea id="tarifa" name="tarifa" value={resultados} onChange={e => setResultados(e.target.value)} rows="6" cols="40" type="text" ></textarea>
                        }
                        </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '3rem',width: '17rem'}}>                       
                        <label for="numeroTicketAsociado" style={{fontSize: '18px'}}>Orden de trabajo asociada</label>
                        <div style={{display: 'flex', position: 'relative'}}>
                        <input id="ordenDeTrabajoAsociada" type="text" name="ordenDeTrabajoAsociada" disabled style={{backgroundColor: '#DCDCDC'}} value={ticket.numeroOrden}></input>
                        <VisibilityIcon style={{position: 'absolute', marginLeft: '14.5rem',marginTop: '3px', cursor: 'pointer'}} onClick={() => {
                            if(ticket.ordenDeTrabajoYaGenerada){
                                abrirModalOrdenTrabajo(ticket.idOrdenTrabajo)
                            }                                            
                        }}/>
                        </div>
                        {!ticket.ordenDeTrabajoRechazada && ((!ticket.ordenDeTrabajoAprobada && ticket.ordenDeTrabajoYaGenerada) && !ticket.finalizado) ? <label style={{fontSize: '10px', color: 'red'}}>Requiere aprobación del cliente</label> : null}
                        {ticket.ordenDeTrabajoRechazada ? <label style={{fontSize: '10px', color: 'red'}}>Orden de Trabajo rechazada</label> : null}
                    </div>
                </div>
            </div>
            <div style={{textAlign: 'center', marginTop: '4rem'}}>
            <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '2rem'}} onClick={() => navigate('/tickets')}>Volver</button>
            {!ticket.ordenDeTrabajoYaGenerada ? 
            <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '14rem', marginRight: '2rem'}} onClick={() => setShowGenerarOrdenDeTrabajo()}>Generar orden de trabajo</button>
            : 
            <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '7rem', marginRight: '2rem'}} onClick={() => actualizarTicket()} disabled={ticket.ticketFinalizado || ticket.ordenDeTrabajoRechazada}>Actualizar</button>
            }
            <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '15rem'}} onClick={() => abrirModalDocumentoRespuesta()} disabled={!ticket.finalizado || ticket.ticketFinalizado}>Enviar documento respuesta</button>

            </div>
            </div>
            }
            </div>
            {showModalGeneracionOrdenTrabajo && <ModalCentradoGenerarOrdenTrabajo fechaEntrega={ticket.fechaMaximaAtencion} descripcion={descripcionTicket} tipoServicio={tipoServicio} notas={notas} costo={costo} resultados={resultados} idAtencionComercial={ticket.idAtencionComercial} show={showModalGeneracionOrdenTrabajo} onHide={() => {setShowModalGeneracionOrdenTrabajo(false)}} />}
            {showModalOrdenTrabajo && <ModalCentradoOrdenTrabajo urlFile={urlFile} ticketFinalizado={ticket.finalizado} nombreArchivo={nombreArchivo} show={showModalOrdenTrabajo} ordenTrabajo={ordenTrabajo} onHide={() => {setShowModalOrdenTrabajo(false); setOrdenTrabajo({});}}/>}
            {showModalEnviarDocumentoRespuesta && <ModalEnviarDocumentoRespuesta idOrdenTrabajo={ticket.idOrdenTrabajo} show={showModalEnviarDocumentoRespuesta} onHide={() => setShowModalEnviarDocumentoRespuesta(false)} />}
        </div>
    )
}