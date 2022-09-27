import React, { useEffect, useState } from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link, useLocation } from "react-router-dom"
import { Table, Paper, TableContainer, TableHead, TableCell, TableRow, TableBody, tableCellClasses } from '@mui/material';
import {styled} from '@mui/material/styles'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'


export default function VisualizarAtencionComercial(props){

    const navigate = useNavigate();
    const [atencionComercial, setAtencionComercial] = useState({});
    const estado = useLocation();
    const codigoAtencionComercial = estado.state.codigoAtencionComercial;
    useEffect(() => {
        const atencionComercial = obtenerReclamoAtencion(codigoAtencionComercial);
        setAtencionComercial(atencionComercial);
    }, [])

    const obtenerReclamoAtencion = (codigoAtencionComercial) =>{
        return {
            codigoAtencionComercial: codigoAtencionComercial,
            numeroCliente: '1293123',
            dniCliente: '9292929',
            tipoCliente: 'Particular',
            descripcion: 'Se me fue la luz otra vez',
            ubicacion: 'Direccion x lima',
            instancia: 'Segunda Instancia',
            fechaRegistro: '07/09/2000',
            tarifa: 'BR3',
            tipoClasificacion: 'FALLA LUZ',
            potenciaMinima: '40kw',
            potenciaMaxima: '80kw',
            numeroTicketAsociado: '92929292',
            requiereInformacion: true
        }
    }
    return(
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
            <div style={{border: "2px solid black", padding: '25px 0'}}>Visualizar Atención Comercial </div>
            <div style={{width: '100rem', display: 'flex'}}>
                <div style={{marginTop: '5rem', border: '2px solid red', display: 'flex', flexDirection: 'column', width: '50%'}}>
                <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="codigoAtencionComercial">Código Atención Comercial</label>
                        <input id="codigoAtencionComercial" type="number" value={atencionComercial.codigoAtencionComercial} name="codigoAtencionComercial" disabled></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="numeroCliente">Número Cliente</label>
                        <input id="numeroCliente" type="number" value={atencionComercial.codigoAtencionComercial} name="numeroCliente" disabled></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="dniCliente">DNI Cliente</label>
                        <input id="dniCliente" type="number" value={atencionComercial.dniCliente} name="dniCliente" disabled></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="tipoCliente">Tipo Cliente</label>
                        <input id="tipoCliente" type="text" value={atencionComercial.tipoCliente} name="tipoCliente" disabled></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="fechaRegistro">Fecha Registro</label>
                        <input id="fechaRegistro" type="date" value={atencionComercial.fechaRegistro} name="fechaRegistro" disabled></input>
                    </div>                   
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="descripcion">Descripcion</label>
                        <textarea id="descripcion" rows="5" cols="50" type="text" name="descripcion" value={atencionComercial.descripcion} disabled></textarea>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="ubicacion">Ubicacion</label>
                        <input id="ubicacion" type="text" value={atencionComercial.ubicacion} name="ubicacion" disabled></input>
                    </div>

                </div>
                <div style={{marginTop: '5rem',display: 'flex', flexDirection: 'column', width: '50%'}}>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="instancia">Instancia</label>
                        <input id="instancia" type="text" name="instancia" disabled value={atencionComercial.instancia}></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="fechaRegistrado">Fecha reclamo registrado</label>
                        <input id="fechaRegistrado" type="date" name="fechaRegistrado" value={atencionComercial.fechaRegistro} disabled></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="tarifa">Tarifa</label>
                        <input id="tarifa" type="text" name="tarifa" disabled value={atencionComercial.tarifa}></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="tipoClasificacion">Tipo Clasificación</label>
                        <input id="tipoClasificacion" type="text" name="tipoClasificacion" disabled value={atencionComercial.tipoClasificacion}></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="potenciaMinima">Potencia mínima</label>
                        <input id="potenciaMinima" type="text" name="potenciaMinima" disabled value={atencionComercial.potenciaMinima}></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="potenciaMaxima">Potencia máxima</label>
                        <input id="potenciaMaxima" type="text" name="potenciaMaxima" disabled value={atencionComercial.potenciaMaxima}></input>
                    </div>

                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>
                        <label for="numeroTicketAsociado">Número ticket asociado</label>
                        <input id="numeroTicketAsociado" type="text" name="numeroTicketAsociado" disabled value={atencionComercial.numeroTicketAsociado}></input>
                    </div>
                    <div style={{float:'left', marginRight: '20px', marginTop: '2rem'}}>                       
                        <label for="numeroTicketAsociado">Información adicional solicitada</label>
                        <div style={{display: 'flex'}}>
                        <input id="numeroTicketAsociado" type="text" name="numeroTicketAsociado" disabled></input>
                        <VisibilityIcon />
                        </div>
                        {atencionComercial.requiereInformacion ? <label style={{fontSize: '10px', color: 'red'}}>Requiere información del cliente</label> : null}
                    </div>
                </div>
            </div>
            <div style={{textAlign: 'center', marginTop: '4rem'}}>
            <button className="btn" style={{backgroundColor : "#858587", color: "white", width: '6rem', marginRight: '3rem'}} onClick={() => navigate('/personal')}>Volver</button>
            </div>
            </div>
        </div>
    )
}