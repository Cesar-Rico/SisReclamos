import React from "react"
import { useNavigate } from 'react-router-dom'

export default function Auth(props) {

    const navigate = useNavigate();


    const loginCliente = () => {
        navigate('/cliente');
    }
    
    const loginPersonal = () => {
        navigate('/personal');
    }
    return (
        <div className="Auth-form-container">
            <form className="Auth-form">
                <div className="Auth-form-content">
                <h3 className="Auth-form-title">Bienvenido a SisReclamos</h3>
                <h2 className="Auth-form-subtitle">Ingresa con tu usuario</h2>
                <div className="form-group mt-3">
                    <label>Correo electrónico</label>
                    <input
                    type="email"
                    className="form-control mt-1"
                    placeholder="Enter correo electrónico"
                    />
                </div>
                <div className="form-group mt-3">
                    <label>Contraseña</label>
                    <input
                    type="password"
                    className="form-control mt-1"
                    placeholder="Ingresa contraseña"
                    />
                </div>
                <div className="d-grid gap-4 mt-5">
                    <button className="btn" onClick={loginPersonal} style={{backgroundColor : "#5d5fef", color: "white"}}>
                    Inicia Sesión - Personal
                    </button>
                    <button className="btn" onClick={loginCliente} style={{backgroundColor : "#5d5fef", color: "white"}}>
                    Inicia Sesión - Cliente
                    </button>
                </div>
                </div>
            </form>
        </div>
    )
}