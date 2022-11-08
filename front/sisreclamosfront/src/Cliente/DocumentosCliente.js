import React, {useState, useEffect} from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Table, Paper, TableContainer, TableHead, TableCell, TableRow, TableBody, tableCellClasses } from '@mui/material';
import {styled} from '@mui/material/styles'
import './cliente.css'
import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios"
import loadingGIF from '../images/loading.gif'
import {Snackbar} from "@mui/material";
import Modal from 'react-bootstrap/Modal'

const cliente = {
numeroCliente: '12345',
dniCliente: '03075844'
}
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#f3f2f7',
      color: '#67627b',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

function ModalDescargaDocumento(props) {
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
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          dialogClassName="modal-90h"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <small>¿Desea decargar el documento?</small>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body >
            <label for="descargaDocumento" style={{fontSize: '18px'}}>Descargar documento</label>
            <button onClick={() => {
                const link = document.createElement('a');
                link.href = props.urlFile;
                link.setAttribute(
                'download',
                "Documento.pdf",
                );
            
                // Append to html link element page
                document.body.appendChild(link);
            
                // Start download
                link.click();
            
                // Clean up and remove the link
                link.parentNode.removeChild(link);
            }}>Descargar</button>
          </Modal.Body>
          <Modal.Footer>
          <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '2rem'}} onClick={props.onHide}>Volver</button>
          </Modal.Footer>
        </Modal>
      );
}

export default function DocumentosCliente(props) {

    const estado = useLocation();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [showModalDescargaDocumento, setShowModalDescargaDocumento] = useState(false);
    const [urlFile, setUrlFile] = useState();
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if(estado.state != null){
            setMensajeAlerta(estado.state.mensajeAlerta);
            setOpenSnackbar(true);
            estado.state = null;
            window.history.replaceState({}, document.title)
        }
        poblarTabla(cliente.numeroCliente);
    }, []);

    const poblarTabla = (numeroCliente) => {
        axios.get('http://127.0.0.1:5000/documentosCliente/' + numeroCliente,{headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => {
            console.log(res.data);    
            setRows(res.data)
        });
    }

    
    const abrirModalDescargaDocumento = (idDocumentoCliente) => {
        setShowModalDescargaDocumento(true);
        axios({
            url: "http://127.0.0.1:5000/documentoCliente/descargar/" + idDocumentoCliente,
            method: "GET",
            responseType: "blob",
            headers: { "Content-Type": "multipart/form-data", 'ngrok-skip-browser-warning': '1234'}
        }).then((res) => {
            console.log("resdata", res.data);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            console.log("url", url);
            setUrlFile(url);
            setShowModalDescargaDocumento(true);
        })

    }
    return (
        <div className="containerApp">
            
            <div className='sidebar'>
            <ProSidebar>
                <Menu iconShape="square" style={{backgroundColor: 'white', height: '100%', position: 'relative'}}>
                    <MenuItem id="primeraOpcion" style={{color: 'black'}} >
                        Mis Reclamos
                        <Link to="/cliente" />
                    </MenuItem>
                    <div id="hola" style={{backgroundColor: '#5d5fef', borderRadius: '5px'}}>
                    <MenuItem style={{color: 'white'}}>
                        Documentos
                        <Link to="/documentosCliente" />
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
            <div style={{ boxShadow: '0 0 3px #ccc', marginTop: '2rem', padding: '25px 0', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))', fontWeight: '500', fontSize: '28px', lineHeight: '34.13px'}}>Mis Documentos </div>
            <div style={{right: '0px', display: 'flex', flexDirection: 'row-reverse', marginTop: '2rem', marginBottom: '2rem'}}>
                
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1250 }} aria-label="customized table" >
                <TableHead>
                    <TableRow>
                    <StyledTableCell>Codigo</StyledTableCell>
                    <StyledTableCell align="left">Tipo Documento</StyledTableCell>
                    <StyledTableCell align="left">Fecha Generado</StyledTableCell>
                    <StyledTableCell align="left">Reclamo Relacionado</StyledTableCell>
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
                        {row.codigo}
                        </TableCell>
                        <TableCell align="left">{row.descripcion}</TableCell>
                        <TableCell align="left">{row.fechaGenerado}</TableCell>
                        <TableCell align="left">{row.reclamoRelacionado}</TableCell>
                        <TableCell><DownloadIcon style={{cursor: 'pointer', marginLeft: '0.5rem'}} onClick={() => {
                            abrirModalDescargaDocumento(row.idDocumentoCliente); 
                        }}/></TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            </div>
            {showModalDescargaDocumento && <ModalDescargaDocumento urlFile={urlFile} show={showModalDescargaDocumento} onHide={() => {setShowModalDescargaDocumento(false)}}/>}
        </div>
    )
}