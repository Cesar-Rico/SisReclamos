import React, { useState, useEffect } from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Table, Paper, TableContainer, TableHead, TableCell, TableRow, TableBody, tableCellClasses, Alert} from '@mui/material';
import {styled} from '@mui/material/styles'
import VisibilityIcon from '@mui/icons-material/Visibility'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import Modal from 'react-bootstrap/Modal'
import loadingGIF from '../images/loading.gif'
import axios from "axios"
import {Snackbar} from "@mui/material";
import generatePDF from "../PDF/reportGenerator";
import { set } from "date-fns";

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#f3f2f7',
      color: '#67627b',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  function ModalCentradoGenerarReporte(props) {
    const navigate = useNavigate();
    const [informacion, setInformacion] = useState([])
    const [clientes, setClientes] = useState([])
    const [clienteSeleccionado, setClienteSeleccionado] = useState()

    useEffect(() => {
        axios({
            method: "GET",
            url: "http://127.0.0.1:5000/documentoCliente/listarCliente",
            headers: { "Content-Type": "application/json", 'ngrok-skip-browser-warning': '1234'}
        })
        .then(function(response){
           setClientes(response.data)
           if(response.data.length > 0){
            setClienteSeleccionado(response.data[0].idCliente)
           }
           
        })
    }, []);

    const generarReporte = () => {

        axios({
            method: "GET",
            url: "http://127.0.0.1:5000/documentoCliente/reporteAtencionComercial/" + clienteSeleccionado,
            headers: { "Content-Type": "application/json", 'ngrok-skip-browser-warning': '1234'}
        })
        .then(function(response){
           let informacionReporte = response.data.informacionReclamoCerrado
           informacionReporte.push(
            {
                codigoReclamo: "",
                descripcion: "",
                cliente: "",
                fechaIngresado: "",
                fechaCerrado: "TOTAL:",
                terminadoATiempo: response.data.cantidadCerrados
            }
           )
           informacionReporte.push(...response.data.informacionReclamoTrabajoCampo);
           console.log("CantidadTrabajoCampo", informacionReporte);
           informacionReporte.push(
            {
                codigoReclamo: "",
                descripcion: "",
                cliente: "",
                fechaIngresado: "",
                fechaCerrado: "TOTAL:",
                terminadoATiempo: response.data.cantidadTrabajoCampos
            }
           )
           informacionReporte.push(...response.data.informacionReclamoOrdenRechazada);
           informacionReporte.push(
            {
                codigoReclamo: "",
                descripcion: "",
                cliente: "",
                fechaIngresado: "",
                fechaCerrado: "TOTAL:",
                terminadoATiempo: response.data.cantidadOrdenRechazada
            }
           )
           setInformacion(informacionReporte);
           generatePDF(informacionReporte);
        })
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
              <small style={{fontSize: '18px'}}>Seleccione cliente del cual se generara un reporte</small>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <select id="cliente" style={{width: '20rem'}} onChange={e => console.log("idCliente", e.target.value)}>
            <option value="-1">
                TODOS LOS CLIENTES
            </option>
            {clientes.map((cliente) => (
                <option value={cliente.idCliente} key={cliente.idCliente}>
                    {cliente.nombre}
                </option>
            ))}
            </select>
          </Modal.Body>
          <Modal.Footer>
            <div>
            <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '2rem'}} onClick={props.onHide}>Cancelar</button>
            <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '10rem', marginRight: '2rem'}} onClick={() => generarReporte()}>Generar reporte</button>
            </div>
          </Modal.Footer>
        </Modal>
      );
}


  function ModalCentradoCerrarAtencionComercial(props) {
    const navigate = useNavigate();
    const [file, setFile] = useState({})
    
    const cerrarAtencionComercial = () => {
        axios({
            method: "PUT",
            url: "http://127.0.0.1:5000/reclamosCanalAtencionCliente/cerrar",
            data: props.idAtencionComercial,
            headers: { "Content-Type": "application/json", 'ngrok-skip-browser-warning': '1234'}
        })
        .then(function(response){
            props.onHide();
            props.setMensajeAlerta("Cerraste la Atencion Comercial exitosamente");
        })
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
              <small style={{fontSize: '18px'}}>¿Está seguro que desea cerrar la Atención Comercial?</small>
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <div>
            <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '2rem'}} onClick={props.onHide}>Cancelar</button>
            <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '6rem', marginRight: '2rem'}} onClick={() => cerrarAtencionComercial()}>Aceptar</button>
            </div>
          </Modal.Footer>
        </Modal>
      );
}
  export default function AtencionComercial(props) {

    const navigate = useNavigate();
    const estado = useLocation();
    const [rows, setRows] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [showModalCerrarAtencionComercial, setShowModalCerrarAtencionComercial] = useState(false);
    const [showModalGenerarReporte, setShowModalGenerarReporte] = useState(false);
    const [idAtencionComercial, setIdAtencionComercial] = useState()

    const poblarTabla = (idPersonalAsignado) => {
        axios.get('http://127.0.0.1:5000/atencionComercial/' + idPersonalAsignado,{headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => {
            console.log(res.data);    
            setRows(res.data)
        });
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
    const llamarVisualizar = (codigoAtencionComercial) => {
        navigate('/visualizarAtencionComercial/', {state: {codigoAtencionComercial: codigoAtencionComercial}});
    }

    const generarReporteBoton = () => {
        setShowModalGenerarReporte(true);
        //generatePDF([{"id" : "1", "title": "hola", "request": "hola", "status": "hola"}]);
    }

    const cerrarAtencionComercial = () => {
        setShowModalCerrarAtencionComercial(true);
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
                <MenuItem id="primeraOpcion" style={{color: 'black'}}>
                    Reclamos canal de atención
                    <Link to="/personal"/>
                </MenuItem>
                <div id="azul" style={{backgroundColor: '#5d5fef', borderRadius: '5px'}}>
                <MenuItem style={{color: 'white'}}>
                    Atenciones Comerciales
                    <Link to="/atencionComercial" />
                </MenuItem>
                </div>
                <MenuItem style={{color: 'black'}}>               
                    Tickets
                <Link to="/tickets" />
                </MenuItem >
                <MenuItem style={{bottom: '0', position: 'absolute', color: 'black'}}>
                    Cerrar sesión
                    <Link to="/" />
                </MenuItem>
            </Menu>
        </ProSidebar>
        </div>
        <div className="content" style={{marginLeft: '4rem'}}>
        <div style={{ boxShadow: '0 0 3px #ccc', marginTop: '2rem', padding: '25px 0', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))', fontWeight: '500', fontSize: '28px', lineHeight: '34.13px'}}>Atenciones Comerciales</div>
            <div style={{right: '0px', display: 'flex', flexDirection: 'row-reverse', marginTop: '2rem', marginBottom: '2rem'}}>
                {rows.length == 0 ? <button className="btn" onClick={generarReporteBoton} style={{backgroundColor : "#5d5fef", color: "white", width: '10rem'}} disabled>Generar reporte</button> :
                <button className="btn" onClick={generarReporteBoton} style={{backgroundColor : "#5d5fef", color: "white", width: '10rem'}}>Generar reporte</button> }
            </div>
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1250 }} aria-label="customized table" >
                <TableHead>
                    <TableRow>
                    <StyledTableCell>Codigo</StyledTableCell>
                    <StyledTableCell align="left">Descripcion</StyledTableCell>
                    <StyledTableCell align="left">Instancia</StyledTableCell>
                    <StyledTableCell align="left">Fecha Reclamo Procesado</StyledTableCell>
                    <StyledTableCell align="left">Fecha Maxima Atencion</StyledTableCell>
                    <StyledTableCell align="left">Acciones</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {rows.length == 0 ? <img id="loading" style={{position : 'absolute', left: '0', right: '0', marginLeft: 'auto', marginRight: 'auto', width: '100px', top: '0', bottom: '0', marginTop: 'auto', marginBottom: 'auto', height: '100px'}} src={loadingGIF} alt="loading..." />:
                    rows.map((row) => (
                    <TableRow
                        key={row.idAtencionComercial}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                        {row.idAtencionComercial}
                        </TableCell>
                        <TableCell align="left">{row.descripcion}</TableCell>
                        <TableCell align="left">{row.instancia}</TableCell>
                        <TableCell align="left">{row.fechaReclamoProcesado}</TableCell>
                        <TableCell align="left">{row.fechaMaximaAtencion}</TableCell>
                        <TableCell align="left">
                            <VisibilityIcon style={{cursor: 'pointer'}} onClick={() => {
                                llamarVisualizar(row.idAtencionComercial);
                        }}/>
                        <IndeterminateCheckBoxIcon style={{cursor: 'pointer', marginLeft: '0.5rem'}} onClick={() => {
                            setIdAtencionComercial(row.idAtencionComercial);
                            cerrarAtencionComercial();
                        }}/></TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
                    <Alert severity="success" sx={{width: '100%'}}>
                        {mensajeAlerta}
                    </Alert>
                </Snackbar>
                </Table>
            </TableContainer>
            </div>
            {showModalCerrarAtencionComercial && <ModalCentradoCerrarAtencionComercial setMensajeAlerta={setMensajeAlerta} idAtencionComercial={idAtencionComercial} show={showModalCerrarAtencionComercial} onHide={() => {setShowModalCerrarAtencionComercial(false); setOpenSnackbar(true); setRows([]); poblarTabla(1)}}/>}
            {showModalGenerarReporte && <ModalCentradoGenerarReporte show={showModalGenerarReporte} onHide={() => setShowModalGenerarReporte(false)}/>}
        </div>
    )
}