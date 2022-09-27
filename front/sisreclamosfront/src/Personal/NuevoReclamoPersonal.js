import React, { useState } from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link, useLocation } from "react-router-dom"
import { Table, Paper, TableContainer, TableHead, TableCell, TableRow, TableBody, tableCellClasses } from '@mui/material';
import {styled} from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'



export default function NuevoReclamoPersonal(props) {

    const navigate = useNavigate();
    const [descripcion, setDescripcion] = useState('');
    var curr = new Date();
    var date = curr.toISOString().substring(0,10);

    const limpiar = () => {
        setDescripcion('');
        navigate('/personal');
    }

    const registrarReclamo = () => {
        alert('Registraste un reclamo');
        navigate('/personal');
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
            <div className="content" style={{width: '80%'}}>
            <div style={{border: "2px solid black", padding: '25px 0'}}>Nuevo Reclamo </div>
            
            <div style={{marginTop: '10rem', border: '2px solid red', display: 'flex', flexDirection: 'column'}}>
                <div style={{float:'left', marginRight: '20px'}}>
                    <label for="numeroCliente">Número Cliente</label>
                    <input id="numeroCliente" type="number" name="numeroCliente" ></input>
                </div>
                <div style={{float:'left', marginRight: '20px'}}>
                    <label for="dniCliente">DNI Cliente</label>
                    <input id="dniCliente" type="number" name="dniCliente" ></input>
                </div>

                <div style={{float:'left', marginRight: '20px'}}>
                    <label for="fechaRegistro">Fecha Registro</label>
                    <input id="fechaRegistro" type="date" name="fechaRegistro" value={date} disabled></input>
                </div>

                <div style={{float:'left', marginRight: '20px'}}>
                    <label for="descripcion">Descripcion</label>
                    <textarea id="descripcion" rows="5" cols="80" type="text" name="descripcion"></textarea>
                </div>

            </div>
            <div style={{textAlign: 'center', marginTop: '4rem'}}>
            <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '3rem'}} onClick={limpiar}>Cancelar</button>
                <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '6rem'}} onClick={registrarReclamo}>Aceptar</button>
            </div>
            </div>
        </div>
    )
}