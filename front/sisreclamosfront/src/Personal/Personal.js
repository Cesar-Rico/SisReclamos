import React, {useState, useEffect} from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link, useLocation, useNavigate } from "react-router-dom"
import './personal.css'
import { Table, Paper, TableContainer, TableHead, TableCell, TableRow, TableBody, tableCellClasses, Alert } from '@mui/material';
import {styled} from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import axios from "axios"
import loadingGIF from '../images/loading.gif'
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
  

export default function Personal(props) {

    const [rows, setRows] = useState([]);
    const estado = useLocation();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const navigate = useNavigate();
    const nuevoReclamo = () => {
        navigate('/nuevoReclamoPersonal');
    }

    const llamarEditar = (idReclamo) => {
        navigate('/editarReclamoPersonal',{state: {idReclamo: idReclamo}});
    }

    const eliminarReclamo = (idReclamoAtencion) => {
        axios.put('http://127.0.0.1:5000/reclamosCanalAtencionPersonal/eliminar/' + idReclamoAtencion, {headers: {'ngrok-skip-browser-warning': '1234'}}).then(
            function(response){
                setMensajeAlerta("Reclamo eliminado");
                setOpenSnackbar(true);
                setRows(rows.filter(reclamo => reclamo.idReclamoCanalAtencion != idReclamoAtencion));
            }       
        );
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

    const poblarTabla = (idPersonal) => {
        axios.get('http://127.0.0.1:5000/reclamosCanalAtencionPersonal/' + idPersonal,{headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => {
            console.log(res.data);    
            setRows(res.data)
        });
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
            <div style={{ boxShadow: '0 0 3px #ccc', marginTop: '2rem', padding: '25px 0', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))', fontWeight: '500', fontSize: '28px', lineHeight: '34.13px'}}>Reclamos canal de atencion</div>
            <div style={{right: '0px', display: 'flex', flexDirection: 'row-reverse', marginTop: '2rem', marginBottom: '2rem'}}>
                {rows.length == 0 ? <button className="btn" onClick={nuevoReclamo} style={{backgroundColor : "#5d5fef", color: "white", width: '8rem'}} disabled>Nuevo</button> :
                <button className="btn" onClick={nuevoReclamo} style={{backgroundColor : "#5d5fef", color: "white", width: '8rem'}}>Nuevo</button> }
            </div>
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1250 }} aria-label="customized table" >
                <TableHead>
                    <TableRow>
                    <StyledTableCell>Codigo</StyledTableCell>
                    <StyledTableCell align="left">Descripcion</StyledTableCell>
                    <StyledTableCell align="left">Numero Cliente</StyledTableCell>
                    <StyledTableCell align="left">Canal Atencion</StyledTableCell>
                    <StyledTableCell align="left">Fecha Registro</StyledTableCell>
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
                        <TableCell align="left">{row.numeroCliente}</TableCell>
                        <TableCell align="left">{row.nombreCanalAtencion}</TableCell>
                        <TableCell align="left">{row.fechaRegistro}</TableCell>
                        <TableCell align="left">
                            <EditIcon style={{cursor: 'pointer', marginLeft: '0.5rem'}} onClick={() => {
                                llamarEditar(row.idReclamoCanalAtencion);
                            }}></EditIcon>
                            <IndeterminateCheckBoxIcon style={{cursor: 'pointer', marginLeft: '0.5rem'}} onClick={() => {
                                eliminarReclamo(row.idReclamoCanalAtencion);
                            }}/>
                        </TableCell>
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
        </div>
    )
}