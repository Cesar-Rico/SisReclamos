import React from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link } from "react-router-dom"
import { Table, Paper, TableContainer, TableHead, TableCell, TableRow, TableBody, tableCellClasses } from '@mui/material';
import {styled} from '@mui/material/styles'
import './cliente.css'
import DownloadIcon from '@mui/icons-material/Download';

function createData(
    codigo,
    nombre,
    tipoDocumento,
    fechaGenerado,
    reclamoRelacionado,
    acciones
  ) {
    return { codigo, nombre, tipoDocumento, fechaGenerado, reclamoRelacionado, acciones };
  }

  const rows = [
    createData('0001', 'Documento respuesta', 'Documento respuesta', '16/08/2922', "Recibi un mal recibo")
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
export default function DocumentosCliente(props) {

    return (
        <div className="containerApp">
            
            <div className='sidebar'>
            <ProSidebar>
                <Menu iconShape="square">
                    <MenuItem id="primeraOpcion">
                        Mis Reclamos
                        <Link to="/cliente" />
                    </MenuItem>
                    <MenuItem>
                        Documentos
                        <Link to="/documentosCliente" />
                    </MenuItem>
                    <MenuItem style={{marginTop: '40rem'}}>
                        Cerrar sesión
                        <Link to="/" />
                    </MenuItem>
                </Menu>
            </ProSidebar>
            </div>

            <div className="content">
            <div style={{border: "2px solid black", padding: '25px 0'}}>Mis Documentos </div>
            <div style={{right: '0px', display: 'flex', flexDirection: 'row-reverse', marginTop: '2rem', marginBottom: '2rem'}}>
                
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1250 }} aria-label="customized table" >
                <TableHead>
                    <TableRow>
                    <StyledTableCell>Codigo</StyledTableCell>
                    <StyledTableCell align="left">Nombre</StyledTableCell>
                    <StyledTableCell align="left">Tipo Documento</StyledTableCell>
                    <StyledTableCell align="left">Fecha Generado</StyledTableCell>
                    <StyledTableCell align="left">Reclamo Relacionado</StyledTableCell>
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
                        <TableCell align="left">{row.nombre}</TableCell>
                        <TableCell align="left">{row.tipoDocumento}</TableCell>
                        <TableCell align="left">{row.fechaGenerado}</TableCell>
                        <TableCell align="left">{row.reclamoRelacionado}</TableCell>
                        <TableCell><DownloadIcon style={{cursor: 'pointer', marginLeft: '0.5rem'}} onClick={() => {
                            alert('Descargaste el documento con codigo ' + row.codigo); 
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