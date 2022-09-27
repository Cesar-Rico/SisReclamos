import React, { useEffect, useState } from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link, useLocation } from "react-router-dom"
import { Table, Paper, TableContainer, TableHead, TableCell, TableRow, TableBody, tableCellClasses } from '@mui/material';
import {styled} from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'


export default function VisualizarReclamo(props){

    const navigate = useNavigate();
    const [reclamo, setReclamo] = useState({});
    const estado = useLocation();
    const codigoReclamo = estado.state.codigoReclanmo;
    useEffect(() => {
        const reclamo = obtenerReclamoAtencion(codigoReclamo);
        setReclamo(reclamo);
    }, [])

    const obtenerReclamoAtencion = () =>{
        return {
            numeroCliente: '128123',
            dniCliente: '1293123',
            fechaRegistro: '17/82/2000',
            descripcion: 'Se me fue la luz'
        }
    }
    return(
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
            <div className="content" style={{width: '80%'}}>
            <div style={{border: "2px solid black", padding: '25px 0'}}>Visualizar Reclamo </div>
            
            <div style={{marginTop: '10rem', border: '2px solid red', display: 'flex', flexDirection: 'column'}}>
                <div style={{float:'left', marginRight: '20px'}}>
                    <label for="numeroCliente">Número Cliente</label>
                    <input id="numeroCliente" type="number" value={reclamo.numeroCliente} name="numeroCliente" disabled></input>
                </div>
                <div style={{float:'left', marginRight: '20px'}}>
                    <label for="dniCliente">DNI Cliente</label>
                    <input id="dniCliente" type="number" value={reclamo.dniCliente} name="dniCliente" disabled></input>
                </div>

                <div style={{float:'left', marginRight: '20px'}}>
                    <label for="fechaRegistro">Fecha Registro</label>
                    <input id="fechaRegistro" type="date" value={reclamo.fechaRegistro} name="fechaRegistro" disabled></input>
                </div>

                <div style={{float:'left', marginRight: '20px'}}>
                    <label for="descripcion">Descripcion</label>
                    <textarea id="descripcion" rows="5" cols="80" type="text" name="descripcion" value={reclamo.descripcion} disabled></textarea>
                </div>

            </div>
            <div style={{textAlign: 'center', marginTop: '4rem'}}>
            <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '3rem'}} onClick={() => navigate('/cliente')}>Volver</button>
            </div>
            </div>
        </div>
    )
}