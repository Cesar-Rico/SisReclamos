import React from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link, useNavigate } from "react-router-dom"
import { Table, Paper, TableContainer, TableHead, TableCell, TableRow, TableBody, tableCellClasses } from '@mui/material';
import {styled} from '@mui/material/styles'
import VisibilityIcon from '@mui/icons-material/Visibility'

function createData(
    codigo,
    descripcion,
    numeroCliente,
    canalAtencion,
    fechaRegistro
  ) {
    return { codigo, descripcion, numeroCliente, canalAtencion, fechaRegistro };
  }

  const rows = [
    createData('0001', 'Se fue la luz en mi calle', 4728282, 'Facebook', "17/09/2022"),
    createData('0002', 'Recibi un mal recibo', 484383, 'Whatsapp', "16/08/2922")
  ];

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#f3f2f7',
      color: '#67627b',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  export default function AtencionComercial(props) {

    const navigate = useNavigate();
    const nuevoReclamo = () => {
        return null;
    }

    const llamarVisualizar = (codigoAtencionComercial) => {
        navigate('/visualizarAtencionComercial', {state: {codigoAtencionComercial: codigoAtencionComercial}});
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
            <div style={{border: "2px solid black", padding: '25px 0'}}>Atenciones Comerciales</div>
            <div style={{right: '0px', display: 'flex', flexDirection: 'row-reverse', marginTop: '2rem', marginBottom: '2rem'}}>
                
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
                        {row.codigo}
                        </TableCell>
                        <TableCell align="left">{row.descripcion}</TableCell>
                        <TableCell align="left">{row.numeroCliente}</TableCell>
                        <TableCell align="left">{row.canalAtencion}</TableCell>
                        <TableCell align="left">{row.fechaRegistro}</TableCell>
                        <TableCell align="left">
                            <VisibilityIcon style={{cursor: 'pointer'}} onClick={() => {
                                llamarVisualizar(row.codigo);
                        }}/></TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            </div>
        </div>
    )
}