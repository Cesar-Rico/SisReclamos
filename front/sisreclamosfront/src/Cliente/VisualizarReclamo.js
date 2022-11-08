import React, { useEffect, useState } from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link, useLocation } from "react-router-dom"
import { Table, Paper, TableContainer, TableHead, TableCell, TableRow, TableBody, tableCellClasses } from '@mui/material';
import {styled} from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import loadingGIF from '../images/loading.gif'

export default function VisualizarReclamo(props){

    const navigate = useNavigate();
    const [reclamo, setReclamo] = useState({});
    const estado = useLocation();
    const idReclamoCanalAtencion = estado.state.idReclamoCanalAtencion;

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/reclamosCanalAtencionPersonal/idReclamo/' + idReclamoCanalAtencion,{headers: {'ngrok-skip-browser-warning': '1234'}}).then( res => {
            setReclamo(res.data)
        });
    }, [])

    return(
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
                    </MenuItem >
                    <MenuItem style={{bottom: '0', position: 'absolute', color: 'black'}}>
                        Cerrar sesión
                        <Link to="/" />
                    </MenuItem>
                </Menu>
            </ProSidebar>
            </div>
            <div className="content" style={{marginLeft: '4rem'}}>
            <div style={{ boxShadow: '0 0 3px #ccc', marginTop: '2rem', padding: '25px 0', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))', fontWeight: '500', fontSize: '28px', lineHeight: '34.13px', width: '78rem'}}>Visualizar Reclamo</div>
            
            {Object.keys(reclamo).length === 0 ? <img id="loading" style={{position : 'absolute', left: '0', right: '0', marginLeft: 'auto', marginRight: 'auto', width: '100px', top: '0', bottom: '0', marginTop: 'auto', marginBottom: 'auto', height: '100px'}} src={loadingGIF} alt="loading..." /> :
            <div>
            <div style={{marginTop: '5rem', display: 'flex', flexDirection: 'column'}}>
                <div style={{float:'left', marginRight: '20px'}}>
                    <label for="numeroCliente" style={{fontSize: '18px'}}>Número Cliente</label>
                    <input id="numeroCliente" type="number" value={reclamo.numeroCliente} name="numeroCliente" disabled></input>
                </div>
                <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                    <label for="dniCliente" style={{fontSize: '18px'}}>DNI Cliente</label>
                    <input id="dniCliente" type="number" value={reclamo.dniCliente} name="dniCliente" disabled></input>
                </div>

                <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                    <label for="fechaRegistro" style={{fontSize: '18px'}}>Fecha Registro</label>
                    <input id="fechaRegistro" type="date" value={reclamo.fechaRegistro} name="fechaRegistro" disabled></input>
                </div>

                <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                    <label for="descripcion" style={{fontSize: '18px'}}>Descripcion</label>
                    <textarea id="descripcion" rows="5" cols="80" type="text" name="descripcion" value={reclamo.descripcion} disabled></textarea>
                </div>

            </div>
            <div style={{textAlign: 'center', marginTop: '4rem'}}>
            <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '3rem'}} onClick={() => navigate('/cliente')}>Volver</button>
            </div>
            </div>
            }
            </div>
        </div>
    )
}