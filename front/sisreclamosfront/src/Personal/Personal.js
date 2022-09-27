import React, {useState, useEffect} from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link, useNavigate } from "react-router-dom"
import './personal.css'
import { Table, Paper, TableContainer, TableHead, TableCell, TableRow, TableBody, tableCellClasses } from '@mui/material';
import {styled} from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import axios from "axios"


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
    const navigate = useNavigate();
    const nuevoReclamo = () => {
        navigate('/nuevoReclamoPersonal');
    }

    const llamarEditar = () => {
        navigate('/editarReclamoPersonal');
    }

    useEffect(() => {
        poblarTabla(1);
    }, []);

    const poblarTabla = (idPersonal) => {
        axios.get('http://localhost:5000/reclamosCanalAtencionPersonal/' + idPersonal).then( res => setRows(res.data));
    }
    return (
        <div className="containerApp">
        <div className='sidebar'>
        <ProSidebar>
            <Menu iconShape="square">
                <MenuItem id="primeraOpcion">
                    Reclamos canal de atención
                    <Link to="/personal"/>
                </MenuItem>
                <MenuItem>
                    Atenciones Comerciales
                    <Link to="/atencionComercial" />
                    </MenuItem>
                <MenuItem>
                    Tickets
                    <Link to="/tickets" />
                    </MenuItem>
                    <MenuItem style={{marginTop: '40rem'}}>
                        Cerrar sesión
                        <Link to="/" />
                    </MenuItem>
            </Menu>
        </ProSidebar>
        </div>
        <div className="content">
            <div style={{border: "2px solid black", padding: '25px 0'}}>Reclamos canal de atencion</div>
            <div style={{right: '0px', display: 'flex', flexDirection: 'row-reverse', marginTop: '2rem', marginBottom: '2rem'}}>
                <button className="btn" onClick={nuevoReclamo} style={{backgroundColor : "#5d5fef", color: "white", width: '8rem'}}>Nuevo</button>
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
                    {rows.map((row) => (
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
                                llamarEditar(row.codigo);
                            }}></EditIcon>
                            <IndeterminateCheckBoxIcon style={{cursor: 'pointer', marginLeft: '0.5rem'}} onClick={() => {
                            alert('Eliminaste el reclamo con codigo ' + row.codigo);
                            }}/>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            </div>
        </div>
    )
}