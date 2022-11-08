import React, { useState } from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link, useLocation } from "react-router-dom"
import { Alert } from '@mui/material';
import {styled} from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import {Snackbar} from "@mui/material";

export default function NuevoReclamoPersonal(props) {

    const navigate = useNavigate();
    const [descripcion, setDescripcion] = useState('');
    const [numeroCliente, setNumeroCliente] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [mensajeSnackbar, setMensajeSnackbar] = useState('');
    var curr = new Date();
    var date = curr.toISOString().substring(0,10);

    const limpiar = () => {
        setDescripcion('');
        navigate('/personal');
    }

    const registrarReclamo = () => {       
        const result = axios({
            method: 'POST',
            url: 'http://127.0.0.1:5000/reclamosCanalAtencionPersonal/registrar',
            data: {
                numeroCliente: numeroCliente,
                fechaRegistro: date,
                descripcion: descripcion,
                idPersonal: 1
            },
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1234'
            }
        })
        .then(function(response){
            const mensajeAlerta = "Registraste un reclamo exitosamente";
            navigate('/personal', {state: {mensajeAlerta: mensajeAlerta}});
        })
        .catch(function(response){
            setMensajeSnackbar('El numero de cliente ingresado no existe');
            setOpenSnackbar(true);
        });
    }
    const handleCloseSnackbar = () => {
        setMensajeSnackbar('');
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
            <div style={{ boxShadow: '0 0 3px #ccc', marginTop: '2rem', padding: '25px 0', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))', fontWeight: '500', fontSize: '28px', lineHeight: '34.13px', width: '78rem'}}>Nuevo Reclamo</div>
            
            <div style={{marginTop: '5rem', display: 'flex', flexDirection: 'column'}}>
                <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                    <label for="numeroCliente"  style={{fontSize: '18px'}}>Número Cliente</label>
                    <input id="numeroCliente" type="number" name="numeroCliente" onChange={e => setNumeroCliente(e.target.value)} ></input>
                </div>

                <div style={{float:'left', marginRight: '20px',marginTop: '2rem'}}>
                    <label for="fechaRegistro"  style={{fontSize: '18px'}}>Fecha Registro</label>
                    <input id="fechaRegistro" type="date" name="fechaRegistro" value={date} disabled></input>
                </div>

                <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                    <label for="descripcion"  style={{fontSize: '18px'}}>Descripcion</label>
                    <textarea id="descripcion" rows="5" cols="80" type="text" name="descripcion" onChange={e => setDescripcion(e.target.value)}></textarea>
                </div>

            </div>
            <div style={{textAlign: 'center', marginTop: '4rem'}}>
            <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '3rem'}} onClick={limpiar}>Cancelar</button>
                <button className="btn" style={{backgroundColor : "#5d5fef", color: "white", width: '6rem'}} onClick={registrarReclamo}>Aceptar</button>
            </div>
            </div>
            <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
                <Alert severity="error" sx={{width: '100%'}}>
                    {mensajeSnackbar}
                </Alert>
            </Snackbar>
        </div>
    )
}