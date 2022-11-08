import React, { useState, useEffect } from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link, useLocation } from "react-router-dom"
import { Table, Paper, TableContainer, TableHead, TableCell, TableRow, TableBody, tableCellClasses, Alert } from '@mui/material';
import {styled} from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import WorkIcon from '@mui/icons-material/Work'
import './cliente.css'
import axios from "axios"
import Modal from 'react-bootstrap/Modal'
import loadingGIF from '../images/loading.gif'
import AddAlertTwoToneIcon from '@mui/icons-material/AddAlertTwoTone';
import {Snackbar} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
[`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f3f2f7',
    color: '#67627b',
},
[`&.${tableCellClasses.body}`]: {
    fontSize: 14,
},
}));

const cliente = {
    numeroCliente: '12345',
    dniCliente: '03075844'
}
function ModalCentrado(props) {

    const navigate = useNavigate();
    const [informacionBrindada, setInformacionBrindada] = useState({})
    const [selectedFile, setSelectedFile] = useState({});
    const [isFile, setIsFile] = useState(false);
    
    const guardarInformacionBrindada = () => {
        
        axios({
            method: "post",
            url: "http://127.0.0.1:5000/reclamosCanalAtencionCliente/registroTextInformacionAdicional",
            data: informacionBrindada,
            headers: { "Content-Type": "application/json", 'ngrok-skip-browser-warning': '1234'}
        })
        .then(function(response){
            if(isFile){
                const formData = new FormData();
                formData.append("file", selectedFile["file"]);
                formData.append("idInformacionSolicitada", selectedFile["idInformacionSolicitada"]);
                formData.append("idReclamoCanalAtencion", selectedFile["idReclamoCanalAtencion"]);
                axios({
                    method: "post",
                    url: "http://127.0.0.1:5000/reclamosCanalAtencionCliente/registroArchivoInformacionAdicional",
                    data: formData,
                    headers: { "Content-Type": "multipart/form-data", 'ngrok-skip-browser-warning': '1234'}
                })
                .then(function(response){
                    props.cerrarModalGuardar();
                    props.setMensajeAlerta("Registraste la informacion solicitada de forma correcta");
                    props.setOpenSnackbar(true);
                })
                    .catch(function(response){
                        alert("Error al subir archivo");
                    });
            }
            props.cerrarModalGuardar();
            props.setMensajeAlerta("Registraste la informacion solicitada de forma correcta");
            props.setOpenSnackbar(true); 
        })
            .catch(function(response){
                alert("Error al subir texto");
            });
             
        }

    
    const handleChangeInformacion = (index, idInformacionSolicitada, idReclamoCanalAtencion, text) => {
        setInformacionBrindada({...informacionBrindada, [index]: {"valor": text, "idInformacionSolicitada" : idInformacionSolicitada, "idReclamoCanalAtencion" : idReclamoCanalAtencion}});
    }

    const handleChangeFile = (idInformacionSolicitada, idReclamoCanalAtencion, file) => {
        setIsFile(true);
        setSelectedFile({"idInformacionSolicitada": idInformacionSolicitada, "idReclamoCanalAtencion": idReclamoCanalAtencion, "file": file});
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
              <small>Brindar Informacion</small>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body >
            <div style={{minHeight: '5rem'}}>
            {Object.keys(props.informacionSolicitada).length === 0 ? <img id="loading" style={{position : 'absolute', left: '0', right: '0', marginLeft: 'auto', marginRight: 'auto', width: '100px', top: '0', bottom: '0', marginTop: 'auto', marginBottom: 'auto', height: '100px'}} src={loadingGIF} alt="loading..." /> :
                props.informacionSolicitada.invalido ? <h6>Ya subiste tu informacion, estamos procesandola...</h6> :
                props.informacionSolicitada.map((info, index) =>(
                    <div style={{marginTop: '0rem'}}>
                        <label for="numeroCliente" style={{fontSize: '18px'}}>{info.nombre}</label>
                        {info.tipoInformacion == "Entrada" ? <textarea style={{height: '8rem'}}id={"input" + info.idInformacionSolicitada} onChange={(e) => handleChangeInformacion(index, info.idInformacionSolicitada, info.idReclamoCanalAtencion, e.target.value)} ></textarea> : null}
                        {info.tipoInformacion == "Documento" ? <input id={"input" + info.idInformacionSolicitada} onChange={(e) => handleChangeFile(info.idInformacionSolicitada, info.idReclamoCanalAtencion, e.target.files[0])} type="file" ></input> : null}
                    </div>
                ))                
            }
            </div>
          </Modal.Body>
          <Modal.Footer>
            {Object.keys(props.informacionSolicitada).length != 0 ?
            props.informacionSolicitada.invalido ? <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '2rem'}} onClick={props.onHide}>Volver</button> :
                <div>
                <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '2rem'}} onClick={props.onHide}>Cancelar</button>
                <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '6rem', marginRight: '2rem'}} onClick={() => guardarInformacionBrindada()}>Guardar</button>
                </div>
            : null}
          </Modal.Footer>
        </Modal>
      );
}

function ModalCentradoOrdenTrabajo(props) {

    const navigate = useNavigate();
    const [informacionBrindada, setInformacionBrindada] = useState({})
    const [selectedFile, setSelectedFile] = useState({});
    const [isFile, setIsFile] = useState(false);

    const aprobarOrdenTrabajo = () => {
        console.log("orden", props.ordenTrabajo)
        const result = axios({
            method: 'POST',
            url: 'http://127.0.0.1:5000/ticket/ordenDeTrabajo/aprobar/' + props.ordenTrabajo.idOrdenTrabajo,
            data: {
                aprobar: true
            },
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1234'
            }
        })
        .then(function(response){
            props.setMensajeAlerta("Aprobaste la orden de trabajo");
            props.setOpenSnackbar(true); 
            props.onHide();
        });
    }
    const descargarDocumentoOrden = () => {
        
    }

    const rechazarOrdenTrabajo = () => {
        const result = axios({
            method: 'POST',
            url: 'http://127.0.0.1:5000/ticket/ordenDeTrabajo/aprobar/' + props.ordenTrabajo.idOrdenTrabajo,
            data: {
                aprobar: false
            },
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1234'
            }
        })
        .then(function(response){
            props.setMensajeAlerta("Rechazaste la orden de trabajo");
            props.setOpenSnackbar(true); 
            props.onHide();
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
            {Object.keys(props.ordenTrabajo).length != 0 ?
                props.ordenTrabajo.estado == "INGRESADO" ?
                <div>
                <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '2rem'}} onClick={() => rechazarOrdenTrabajo()}>Rechazar</button>
                <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '6rem', marginRight: '2rem'}} onClick={() => aprobarOrdenTrabajo()}>Aprobar</button>
                </div>
                :
                <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '2rem'}} onClick={() => props.onHide()}>Volver</button>

            : null}
          </Modal.Footer>
        </Modal>
      );
}


export default function Cliente(props) {

    const navigate = useNavigate();
    const estado = useLocation();
    const [rows, setRows] = useState([]);
    const [showModalInformacion, setShowModalInformacion] = useState(false);
    const [showModalOrdenTrabajo, setShowModalOrdenTrabajo] = useState(false);
    const [informacionSolicitada, setInformacionSolicitada] = useState({});
    const [ordenTrabajo, setOrdenTrabajo] = useState({})
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [urlFile, setUrlFile] = useState("")
    const nuevoReclamo = () => {
        navigate('/nuevoReclamoCliente', {state: {cliente: cliente}});
    }
    
    useEffect(() => {
        if(estado.state != null){
            setMensajeAlerta(estado.state.mensajeAlerta);
            setOpenSnackbar(true);
            estado.state = null;
            window.history.replaceState({}, document.title)
        }
        poblarTabla(1);
    }, []);

    const poblarTabla = (idCliente) => {
        axios.get('http://127.0.0.1:5000/reclamosCanalAtencionCliente/' + idCliente,{headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => { 
            setRows(res.data);
        });

        
    }
    const llamarVisualizar = (idReclamoCanalAtencion) => {
        navigate('/visualizarReclamo', {state: {idReclamoCanalAtencion: idReclamoCanalAtencion}});
    }

    const llamarBrindarInformacion = (idReclamoCanalAtencion) => {
        setShowModalInformacion(true);
        axios.get("http://127.0.0.1:5000/reclamoCanalAtencionCliente/verInformacionBrindada/" + idReclamoCanalAtencion, {headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => {
            
            if(res.data.invalido){
                setInformacionSolicitada(res.data);
                setShowModalInformacion(true);
                return;
            }
            res.data.map((data => {
                data["value"] = "";
                data["idReclamoCanalAtencion"] = idReclamoCanalAtencion;
            }))
            setInformacionSolicitada(res.data);
                      
        });
    }

    const llamarOrdenDeTrabajo = (idReclamoCanalAtencion) => {
        setShowModalOrdenTrabajo(true);
        axios.get("http://127.0.0.1:5000/reclamoCanalAtencionCliente/verOrdenTrabajo/" + idReclamoCanalAtencion, {headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => {
            setOrdenTrabajo(res.data);

            axios({
                url: "http://127.0.0.1:5000/ticket/descargarOrdenTrabajo/" + res.data.idOrdenTrabajo,
                method: "GET",
                responseType: "blob"
            }).then((res) => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                console.log("url", url);
                setUrlFile(url);
                setShowModalOrdenTrabajo(true);
            })
        });
    }


    const cerrarModal = () => {
        setRows([]);
        setInformacionSolicitada({});
        setShowModalInformacion(false);
        poblarTabla(1);
    }

    const handleCloseSnackbar = () => {
        setMensajeAlerta('');
        setOpenSnackbar(false);
    }
    return (
        <div className="containerApp">
            <div className='sidebar'>
            <ProSidebar>
                <Menu iconShape="square" style={{backgroundColor: 'white', height: '100%', position: 'relative'}}>
                    <div id="hola" style={{backgroundColor: '#5d5fef', borderRadius: '5px'}}>
                    <MenuItem id="primeraOpcion" style={{color: 'white'}}>
                        Mis Reclamos
                        <Link to="/cliente" />
                    </MenuItem>
                    </div>
                    <MenuItem style={{color: 'black'}} >
                        Documentos
                        <Link to="/documentosCliente" className="hover"/>
                    </MenuItem>
                    <MenuItem style={{bottom: '0', position: 'absolute', color: 'black'}}>
                        Cerrar sesión
                        <Link to="/" />
                    </MenuItem>
                </Menu>
            </ProSidebar>
            </div>
            <div className="content" style={{marginLeft: '4rem'}}>
            <div style={{ boxShadow: '0 0 3px #ccc', marginTop: '2rem', padding: '25px 0', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))', fontWeight: '500', fontSize: '28px', lineHeight: '34.13px'}}>Mis Reclamos </div>
            <div style={{right: '0px', display: 'flex', flexDirection: 'row-reverse', marginBottom: '2rem', marginTop: '1rem'}}>
                {rows.length == 0 ? <button className="btn" onClick={nuevoReclamo} style={{backgroundColor : "#5d5fef", color: "white", width: '8rem'}} disabled>Nuevo</button> : 
                <button className="btn" onClick={nuevoReclamo} style={{backgroundColor : "#5d5fef", color: "white", width: '8rem'}}>Nuevo</button>
                }
            </div>
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1250 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                    <StyledTableCell>Codigo</StyledTableCell>
                    <StyledTableCell align="left">Descripcion</StyledTableCell>
                    <StyledTableCell align="left">Canal Atencion</StyledTableCell>
                    <StyledTableCell align="left">Fecha Registro</StyledTableCell>
                    <StyledTableCell align="left">Estado</StyledTableCell>
                    <StyledTableCell align="left">Acciones</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length == 0 ? <img id="loading" style={{position : 'absolute', left: '0', right: '0', marginLeft: 'auto', marginRight: 'auto', width: '100px', top: '0', bottom: '0', marginTop: 'auto', marginBottom: 'auto', height: '100px'}} src={loadingGIF} alt="loading..." />:
                    rows.map((row) => (
                    <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                        {row.idReclamoCanalAtencion}
                        </TableCell>
                        <TableCell align="left">{row.descripcion}</TableCell>
                        <TableCell align="left">{row.nombreCanalAtencion}</TableCell>
                        <TableCell align="left">{row.fechaRegistro}</TableCell>
                        <TableCell align="left">{row.estado}</TableCell>
                        <TableCell align="left">
                        <VisibilityIcon style={{cursor: 'pointer'}} onClick={() => {
                            llamarVisualizar(row.idReclamoCanalAtencion);
                        }}/>
                        {row.estado == "ATENCION COMERCIAL" ?
                        <span style={{position: 'relative'}}>
                        <EditIcon style={{cursor: 'pointer', marginLeft: '0.5rem'}} onClick={() => {
                            llamarBrindarInformacion(row.idReclamoCanalAtencion);
                        }}/>
                        {row.informacionNecesaria ? <AddAlertTwoToneIcon fontSize="small" style={{position: 'absolute', right: '-5px', bottom: '-14px'}}/> : null}
                        </span>
                         : null
                        }
                        {row.estado == "TRABAJO CAMPO" ? 
                        <WorkIcon style={{cursor: 'pointer', marginLeft: '0.5rem'}} onClick={() => {
                            llamarOrdenDeTrabajo(row.idReclamoCanalAtencion);
                        }}/> : null
                        }  
                        </TableCell>
                    </TableRow>
                    ))
                    }
                </TableBody>
                <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
                    <Alert severity="success" sx={{width: '100%'}}>
                        {mensajeAlerta}
                    </Alert>
                </Snackbar>
                {showModalInformacion && <ModalCentrado setOpenSnackbar={setOpenSnackbar} setMensajeAlerta={setMensajeAlerta} show={showModalInformacion} informacionSolicitada={informacionSolicitada} cerrarModalGuardar={cerrarModal} onHide={() => {setShowModalInformacion(false); setInformacionSolicitada({})}} />}
                {showModalOrdenTrabajo && <ModalCentradoOrdenTrabajo setOpenSnackbar={setOpenSnackbar} setMensajeAlerta={setMensajeAlerta} urlFile={urlFile} show={showModalOrdenTrabajo} ordenTrabajo={ordenTrabajo} onHide={() => {setShowModalOrdenTrabajo(false); setOrdenTrabajo({});}}/>}
                </Table>
            </TableContainer>
            </div>
        </div>
    )
}