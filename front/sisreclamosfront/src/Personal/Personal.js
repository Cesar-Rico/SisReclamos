import React from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link } from "react-router-dom"
import './personal.css'

export default function Personal(props) {

    return (
        <div>
        <div className='sidebar'>
        <ProSidebar>
            <Menu iconShape="square">
                <MenuItem id="primeraOpcion">
                    Reclamos canal de atención
                    <Link to="/clientes"/>
                </MenuItem>
                <MenuItem>Atenciones Comerciales</MenuItem>
                <MenuItem>Tickets</MenuItem>
            </Menu>
        </ProSidebar>
        </div>
        <div>Reclamos canal de atencion</div>
        </div>
    )
}