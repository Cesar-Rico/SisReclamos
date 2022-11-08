import React, { useState, useEffect} from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link, useLocation } from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import { Table, Paper, TableContainer, TableHead, TableCell, TableRow, TableBody, tableCellClasses } from '@mui/material';
import {styled} from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox';
import axios from "axios"
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import loadingGIF from '../images/loading.gif'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#f3f2f7',
      color: '#67627b',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
}));
  

function ModalCentrado(props) {
    const [selectedId, setSelectedId] = useState(props.instancias[0].idInstancia)
    const [criterioSeleccionado, setCriterioSeleccionado] = useState(props.criterios[0].idCriterioAdmisibilidad)
    const [tipoClasificacionSeleccionada, setTipoClasificacionSeleccionada] = useState(props.tiposClasificacion[0].idTipoClasificacion)
    const [personalEmpresaSeleccionada, setPersonalEmpresaSeleccionada] = useState(props.personalEmpresa[0].idPersonalEmpresa)
    const [informacionSeleccionada, setInformacionSeleccionada] = useState([])
    const navigate = useNavigate();
    
    const guardarAtencionComercial = () => {

        const result = axios({
            method: 'POST',
            url: 'http://127.0.0.1:5000/atencionComercial/registrar',
            data: {
                instancia: selectedId,
                criterioSeleccionado: criterioSeleccionado,
                tipoClasificacion: tipoClasificacionSeleccionada,
                personalAsignado: personalEmpresaSeleccionada,
                informacionAdicional: informacionSeleccionada,
                reclamo: props.reclamo
            },
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1234'
            }
        })
        .then(function(response){
            const mensajeAlerta = "Aprobaste un reclamo y registraste una atencion comercial";
            navigate('/personal', {state: {mensajeAlerta: mensajeAlerta}});
        });
    }
    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          dialogClassName="modal-90h"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <small>¿Está seguro que desea declarar el reclamo como Atención Comercial?</small>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body >
            <div style={{display: 'flex'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{float:'left', width: '20rem'}}>
                        <label for="instancia" style={{fontSize: '18px'}}>Seleccione Instancia:</label>
                        <select id="instancia" style={{width: '20rem'}} value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                        {props.instancias.map((instancia, id) => (
                            <option value={instancia.idInstancia} key={id}>
                                {instancia.nombre}
                            </option>
                        ))}
                    </select>
                    <div style={{float:'left', marginTop: '2rem'}}>
                        <label for="instancia" style={{fontSize: '18px'}}>Seleccione Criterio Admisibilidad::</label>
                        <select style={{width: '20rem'}} value={criterioSeleccionado} onChange={e => setCriterioSeleccionado(e.target.value)}>
                            {props.criterios.map((criterio, id) => (
                                <option value={criterio.idCriterioAdmisibilidad} key={id}>
                                    {criterio.descripcion}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{float:'left', marginTop: '2rem'}}>
                        <label for="instancia" style={{fontSize: '18px'}}>Seleccione Tipo Clasificación:</label>
                        <select style={{width: '20rem'}} value={tipoClasificacionSeleccionada} onChange={e => setTipoClasificacionSeleccionada(e.target.value)}>
                            {props.tiposClasificacion.map((tipoClasificacion, id) => (
                                    <option value={tipoClasificacion.idTipoClasificacion} key={id}>
                                        {tipoClasificacion.nombre}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div style={{float:'left', marginTop: '2rem'}}>
                        <label for="instancia" style={{fontSize: '18px'}}>Seleccione Personal Asignado:</label>
                        <select style={{width: '20rem'}} value={personalEmpresaSeleccionada} onChange={e => setPersonalEmpresaSeleccionada(e.target.value)}>
                            {props.personalEmpresa.map((personal, id) => (
                                        <option value={personal.idPersonalEmpresa} key={id}>
                                            {personal.nombre}
                                        </option>
                                    ))}
                        </select>
                    </div>
                </div>
            </div>
                <div style={{marginLeft: '5rem'}} >
                    ¿Desea solicitar más información al cliente?
                    <TableContainer component={Paper} style={{marginTop: '1rem'}}>
                        <Table aria-label="customized table" >
                            <TableHead>
                                <TableRow>
                                <StyledTableCell>Información</StyledTableCell>
                                <StyledTableCell align="left">Solicitar</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {props.informacionAdicional.map((row) => (
                                <TableRow
                                    key={row.nombre}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                    {row.nombre}
                                    </TableCell>
                                    <TableCell padding="checkbox" align="center">
                                        <Checkbox
                                        color="primary"
                                        onChange={(e) => {
                                            if(e.target.checked){
                                                setInformacionSeleccionada([...informacionSeleccionada, row.idInformacionSolicitada])
                                            }
                                            else{
                                                const index = informacionSeleccionada.indexOf(row.idInformacionSolicitada)
                                                if (index > -1){
                                                    let array = informacionSeleccionada;
                                                    array.splice(index, 1);
                                                    setInformacionSeleccionada(array);
                                                }
                                            }               
                                        }
                                        }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>          
          </Modal.Body>
          <Modal.Footer>
          <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '2rem'}} onClick={props.onHide}>Cancelar</button>
          <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '6rem', marginRight: '2rem'}} onClick={() => guardarAtencionComercial()}>Guardar</button>
          </Modal.Footer>
        </Modal>
      );
}

function ModalRechazarReclamo(props) {
    const navigate = useNavigate();
    const [motivoRechazo, setMotivoRechazo] = useState('');
    const [file, setFile] = useState()
    const rechazarReclamo = () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("motivoRechazo", motivoRechazo);
        formData.append("idReclamo", props.idReclamo);
        axios({
            method: "PUT",
            url: "http://127.0.0.1:5000/reclamosCanalAtencionPersonal/rechazar",
            data: formData,
            headers: { "Content-Type": "multipart/form-data", 'ngrok-skip-browser-warning': '1234'}
        })
        .then(function(response){
            const mensajeAlerta = "Rechazaste un reclamo exitosamente";
            navigate('/personal', {state: {mensajeAlerta: mensajeAlerta}});
        })
            .catch(function(response){
                alert("Error al subir archivo");
        });
 
    }


    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          dialogClassName="modal-90h"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <small>¿Está seguro que desea declarar el reclamo como inadmisible?</small>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body >
            <label for="motivoRechazo" style={{fontSize: '18px'}}>Motivo</label>
            <textarea id="motivoRechazo" rows="4" cols="40" type="text" name="motivoRechazo" value={motivoRechazo} onChange={e => setMotivoRechazo(e.target.value)} ></textarea>

            <label for="documentoRespuesta" style={{fontSize: '18px', marginTop: '1rem'}}>Documento Respuesta</label>
            <input id="inputDocumentoRespuesta" onChange={(e) => setFile(e.target.files[0])} type="file" ></input>
          </Modal.Body>
          <Modal.Footer>
          <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '2rem'}} onClick={props.onHide}>Cancelar</button>
          <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '6rem', marginRight: '2rem'}} onClick={() => rechazarReclamo()}>Rechazar</button>
          </Modal.Footer>
        </Modal>
      );
}

export default function EditarReclamoPersonal(props) {

    const navigate = useNavigate();
    const [descripcion, setDescripcion] = useState('');
    const [reclamo, setReclamo] = useState({});
    const [instancias, setInstancias] = useState([]);
    const [criterios, setCriterios] = useState([]);
    const [personalEmpresa, setPersonalEmpresa] = useState([])
    const [tiposClasificacion, setTiposClasificacion] = useState([]);
    const [informacionAdicional, setInformacionAdicional] = useState([]);

    var estado = useLocation()
    var idReclamo = estado.state.idReclamo;
    const [modalShow, setModalShow] = useState(false);
    const [modalRechazarShow, setModalRechazarShow] = useState(false);
    
    useEffect(() => {
        
        axios.get('http://127.0.0.1:5000/reclamosCanalAtencionPersonal/idReclamo/' + idReclamo,{headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => {
            setDescripcion(res.data.descripcion);
            setReclamo(res.data);
            console.log("reclamo", res.data);
        });
        axios.get('http://127.0.0.1:5000/instancias',{headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => setInstancias(res.data));
        axios.get('http://127.0.0.1:5000/criteriosAdmisibilidad',{headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => setCriterios(res.data));
        axios.get('http://127.0.0.1:5000/tipoClasificacion',{headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => setTiposClasificacion(res.data));
        axios.get('http://127.0.0.1:5000/listarPersonal',{headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => setPersonalEmpresa(res.data));
        axios.get('http://127.0.0.1:5000/informacionAdicional',{headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => setInformacionAdicional(res.data));

    }, [])

    const limpiar = () => {
        setDescripcion('');
        navigate('/personal');
    }

    const actualizarReclamo = () => {
        const result = axios({
            method: 'PUT',
            url: 'http://127.0.0.1:5000/reclamosCanalAtencionPersonal/actualizar/' + reclamo.idReclamoCanalAtencion,
            data: {
                descripcion: descripcion
            },
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1234'
            }
        }).then(function(response){
            const mensajeAlerta = "Actualizaste un reclamo exitosamente";
            navigate('/personal', {state: {mensajeAlerta: mensajeAlerta}});
        });
    }

    const rechazarReclamo = () => {
        setModalRechazarShow(true);
    }

    const aprobarReclamo = () => {
        setModalShow(true);
    }
    return (
        <div className="containerApp">
            <div className='sidebar'>
            <ProSidebar>
                <Menu iconShape="square" style={{backgroundColor: 'white', height: '100%', position: 'relative'}}>
                    <div id="hola" style={{backgroundColor: '#5d5fef', borderRadius: '5px'}}>
                    <MenuItem id="primeraOpcion" style={{color: 'white'}}>
                        Reclamos canal de atención
                        <Link to="/personal"/>
                    </MenuItem>
                    </div>
                    <MenuItem style={{color: 'black'}} >
                        Atenciones Comerciales
                        <Link to="/atencionComercial" />
                        </MenuItem>
                    <MenuItem style={{color: 'black'}} >
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
            <div style={{ boxShadow: '0 0 3px #ccc', marginTop: '2rem', padding: '25px 0', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))', fontWeight: '500', fontSize: '28px', lineHeight: '34.13px', width: '78rem'}}>Editar Reclamo</div>
            
            {Object.keys(reclamo).length === 0 ? <img id="loading" style={{position : 'absolute', left: '0', right: '0', marginLeft: 'auto', marginRight: 'auto', width: '100px', top: '0', bottom: '0', marginTop: 'auto', marginBottom: 'auto', height: '100px'}} src={loadingGIF} alt="loading..." /> :
            <div>
            <div style={{width: '100%', display: 'flex'}}>
                <div style={{marginTop: '5rem', display: 'flex', flexDirection: 'column', width: '50%'}}>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="numeroCliente" style={{fontSize: '18px'}}>Número Cliente</label>
                        <input id="numeroCliente" type="number" name="numeroCliente" value={reclamo.numeroCliente} disabled></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="dniCliente" style={{fontSize: '18px'}}>DNI Cliente</label>
                        <input id="dniCliente" type="number" name="dniCliente" value={reclamo.dniCliente} disabled></input>
                    </div>

                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="fechaRegistro" style={{fontSize: '18px'}}>Fecha Registro</label>
                        <input id="fechaRegistro" type="date" name="fechaRegistro" value={reclamo.fechaRegistro} disabled></input>
                    </div>

                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="descripcion" style={{fontSize: '18px'}}>Descripcion</label>
                        <textarea id="descripcion" rows="5" cols="50" type="text" name="descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} disabled={!reclamo.puedeAprobarse}></textarea>
                    </div>

                </div>
                <div style={{marginTop: '5rem',display: 'flex', flexDirection: 'column', marginLeft: '5rem', width: '40%'}}>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="tipoCliente" style={{fontSize: '18px'}}>Tipo Cliente</label>
                        <input id="tipoCliente" type="text" name="tipoCliente" value={reclamo.tipoCliente} disabled></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="potenciaMinima" style={{fontSize: '18px'}}>Potencia minima</label>
                        <input id="potenciaMinima" type="text" name="potenciaMinima" value={reclamo.potenciaMinima} disabled></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="potenciaMinima" style={{fontSize: '18px'}}>Potencia máxima</label>
                        <input id="potenciaMinima" type="text" name="potenciaMinima" value={reclamo.potenciaMaxima } disabled></input>
                    </div>
                </div>
            </div>           
            <div style={{textAlign: 'center', marginTop: '4rem'}}>
                <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '3rem'}} onClick={limpiar}>Cancelar</button>
                {Object.keys(reclamo).length != 0 ?
                    reclamo.puedeAprobarse ? 
                        <>
                            <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '6rem', marginRight: '3rem'}} onClick={actualizarReclamo}>Guardar</button>
                            <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '6rem', marginRight: '3rem'}} onClick={rechazarReclamo}>Rechazar</button>
                            <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '6rem'}} onClick={aprobarReclamo} disabled={Object.keys(reclamo).length === 0 ? true : !reclamo.puedeAprobarse}>Aprobar</button>
                        </> :
                    null
                : null
                }
            </div>
            </div>
            }
            </div>
            {modalShow && <ModalCentrado show={modalShow} onHide={() => setModalShow(false)} reclamo={reclamo} instancias={instancias} criterios={criterios} tiposClasificacion={tiposClasificacion} personalEmpresa={personalEmpresa} informacionAdicional={informacionAdicional}/>}
            {modalRechazarShow && <ModalRechazarReclamo show={modalRechazarShow} idReclamo={reclamo.idReclamoCanalAtencion} onHide={() => setModalRechazarShow(false)}></ModalRechazarReclamo>}
        </div>
    )
}