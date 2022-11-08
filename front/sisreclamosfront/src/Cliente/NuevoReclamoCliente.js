import React, { useState } from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link, useLocation } from "react-router-dom"
import { Table, Paper, TableContainer, TableHead, TableCell, TableRow, TableBody, tableCellClasses } from '@mui/material';
import {styled} from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import './cliente.css'


export default function NuevoReclamoCliente(props) {

    const navigate = useNavigate();
    const estado = useLocation();
    const cliente =estado.state.cliente;
    const [descripcion, setDescripcion] = useState('');
    var curr = new Date();
    var date = curr.toISOString().substring(0,10);

    const limpiar = () => {
        setDescripcion('');
        navigate('/cliente');
    }

    const registrarReclamo = () => {
        const result = axios({
            method: 'POST',
            url: 'http://127.0.0.1:5000/reclamosCanalAtencionPersonal/registrar',
            data: {
                numeroCliente: cliente.numeroCliente,
                fechaRegistro: date,
                descripcion: descripcion,
                idPersonal: null
            },
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1234'
            }
        }).then(function(response){
            const mensajeAlerta = "Registraste un reclamo exitosamente";
            navigate('/cliente', {state: {mensajeAlerta: mensajeAlerta}});
        });
        
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
                        <Link to="/documentosCliente" />
                    </MenuItem>
                    <MenuItem style={{bottom: '0', position: 'absolute', color: 'black'}}>
                        Cerrar sesión
                        <Link to="/" />
                    </MenuItem>
                </Menu>
            </ProSidebar>
            </div>
            <div className="content" style={{marginLeft: '4rem'}}>
            <div style={{ boxShadow: '0 0 3px #ccc', marginTop: '2rem', padding: '25px 0', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))', fontWeight: '500', fontSize: '28px', lineHeight: '34.13px', width: '78rem'}}>Nuevo Reclamo</div>
            
            <div style={{marginTop: '5rem', display: 'flex', flexDirection: 'column'}}>
                <div style={{float:'left', marginRight: '20px'}}>
                    <label for="numeroCliente" style={{fontSize: '18px'}}>Número Cliente</label>
                    <input id="numeroCliente" type="number" value={cliente.numeroCliente} name="numeroCliente" disabled></input>
                </div>
                <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                    <label for="dniCliente" style={{fontSize: '18px'}}>DNI Cliente</label>
                    <input id="dniCliente" type="number" value={cliente.dniCliente} name="dniCliente" disabled></input>
                </div>

                <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                    <label for="fechaRegistro" style={{fontSize: '18px'}}>Fecha Registro</label>
                    <input id="fechaRegistro" type="date" value={date} name="fechaRegistro" disabled></input>
                </div>

                <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                    <label for="descripcion" style={{fontSize: '18px'}}>Descripcion</label>
                    <textarea id="descripcion" rows="5" cols="80" type="text" name="descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)}></textarea>
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