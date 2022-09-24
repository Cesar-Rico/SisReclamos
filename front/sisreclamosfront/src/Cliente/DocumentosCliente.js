import React from "react"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Link } from "react-router-dom"
import './cliente.css'

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
                </Menu>
            </ProSidebar>
            </div>

            Documentos
        </div>
    )
}