from io import BytesIO
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import psycopg2
from flask_sqlalchemy import SQLAlchemy
from Models.DBInit import db
from Models.ReclamoCanalAtencion import *
from twilio.twiml.messaging_response import MessagingResponse
from datetime import timedelta, date

app = Flask(__name__)
CORS(app)
DB_URL = 'postgresql://oigbbzzucgzquo:7d8b7774966ab7aa3e69d77997760f7c6477c1eed31c9d32bd4bd0c1c2c6603a@ec2-18-204-36-213.compute-1.amazonaws.com:5432/datluuu57evb9p'

app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning

db.init_app(app)
with app.app_context():
    db.create_all()



users = {}
estados = {
    'pregunta1': 'pregunta1',
    'pregunta2': 'pregunta2',
    'fin': 'fin',
    'error': 'error'
}
mensajes = {
    estados['pregunta1']: 'Hola, cual es tu número de cliente?',
    estados['pregunta2']: 'Cual es la descripción de tu reclamo?',
    estados['fin']: 'Muchas gracias por registrar tu reclamo',
    estados['error']: 'Lo siento, no estas registrado dentro del sistema. Intenta con otro numero de Cliente'

}

estadosSiguientes = {
    estados['pregunta1']: estados['pregunta2'],
    estados['pregunta2']: estados['fin']
}

def get_db_connection():
    conn = psycopg2.connect(host="ec2-52-200-5-135.compute-1.amazonaws.com",
                            database="dfic8u828ugjrt",
                            user="kjzpxxhgnwecuo",
                            password="7dc7b77491e18b06a45e965ee4028e70cab84a216758bbe13cb0a87715175fae")
    return conn

def retornarJsonReclamo(idReclamoCanalAtencion, descripcion, numeroCliente, nombreCanalAtencion, fechaRegistro):
    return {
        "idReclamoCanalAtencion": idReclamoCanalAtencion,
        "descripcion": descripcion,
        "numeroCliente": numeroCliente,
        "nombreCanalAtencion": nombreCanalAtencion,
        "fechaRegistro": fechaRegistro.strftime("%d-%b-%Y")
    } 

@app.route("/", methods = ["GET"])
def getBase():
    atencionComercial = AtencionComercial.query.all()[0]
    return 'hola'

@app.route("/reclamosCanalAtencionPersonal/<idPersonal>", methods = ["GET"])
def getReclamosCanalAtencion(idPersonal):
    reclamosCanalAtencion = ReclamoCanalAtencion.query.filter(((ReclamoCanalAtencion.idPersonal == idPersonal) | (ReclamoCanalAtencion.idPersonal == None)) & (ReclamoCanalAtencion.estado == "REGISTRADO")).order_by(ReclamoCanalAtencion.idReclamoCanalAtencion.desc())
    response_json = []
    for reclamo in reclamosCanalAtencion:
        numeroCliente = Cliente.query.filter_by(idCliente = reclamo.idCliente).first().numeroCliente
        nombreCanalAtencion = CanalAtencion.query.filter_by(idCanalAtencion = reclamo.idCanalAtencion).first().nombre
        json = reclamo.toJSON()
        json["fechaRegistro"] = json["fechaRegistro"].strftime("%d/%m/%Y")
        json['numeroCliente'] = numeroCliente
        json['nombreCanalAtencion'] = nombreCanalAtencion
        response_json.append(json)

    response_json = jsonify(response_json)
    response_json.headers.add('Access-Control-Allow-Origin', '*')
    return response_json

@app.route("/reclamosCanalAtencionCliente/<idCliente>", methods = ["GET"])
def getReclamosCanalAtencionCliente(idCliente):
    reclamosCanalAtencion = ReclamoCanalAtencion.query.filter((Cliente.idCliente == idCliente) & ((ReclamoCanalAtencion.estado == "REGISTRADO") | (ReclamoCanalAtencion.estado == "ELIMINADO") | (ReclamoCanalAtencion.estado == "RECHAZADO") | (ReclamoCanalAtencion.estado == "CERRADO"))).order_by(ReclamoCanalAtencion.idReclamoCanalAtencion.desc()).all()
    
    response_json = []
    for reclamo in reclamosCanalAtencion:
        numeroCliente = Cliente.query.filter_by(idCliente = reclamo.idCliente).first().numeroCliente
        nombreCanalAtencion = CanalAtencion.query.filter_by(idCanalAtencion = reclamo.idCanalAtencion).first().nombre
        json = reclamo.toJSON()
        json["fechaRegistro"] = json["fechaRegistro"].strftime("%d/%m/%Y")
        json['numeroCliente'] = numeroCliente
        json['nombreCanalAtencion'] = nombreCanalAtencion
        json['estado'] = reclamo.estado
        #Verificar si existe reclamo empresa
        reclamoEmpresa = ReclamoEmpresa.query.filter_by(idReclamoCanalAtencion = reclamo.idReclamoCanalAtencion).first()
        if reclamoEmpresa is not None:
            json["estado"] = reclamoEmpresa.estado     
            atencionComercial = AtencionComercial.query.filter_by(idReclamoEmpresa = reclamoEmpresa.idReclamoEmpresa).first()
            informacionYaBrindada = AtencionComercialXInformacionSolicitada.query.filter_by(idAtencionComercial = atencionComercial.idAtencionComercial, estado = 1).all()
            for informacion in atencionComercial.informacionSolicitada:
            
                if (informacion.child.tipoInformacion == "Documento" and informacion.archivo is None) or (informacion.child.tipoInformacion == "Entrada" and informacion.texto is None):
                    json["informacionNecesaria"] = True

        response_json.append(json)

    response_json = jsonify(response_json)
    response_json.headers.add('Access-Control-Allow-Origin', '*')
    return response_json

@app.route("/reclamosCanalAtencionCliente/cerrar", methods = ["PUT"])
def cerrarAtencionComercial():
    idAtencionComercial = request.get_json()
    atencionComercial = AtencionComercial.query.filter_by(idAtencionComercial = idAtencionComercial).first()
    reclamoEmpresa = ReclamoEmpresa.query.filter_by(idReclamoEmpresa = atencionComercial.idReclamoEmpresa).first()

    reclamoEmpresa.fechaReclamoProcesado = date.today()
    reclamoEmpresa.estado = "CERRADO"

    db.session.commit()

    return {"Status": "OK"}

@app.route("/reclamoCanalAtencionCliente/verInformacionBrindada/<idReclamoCanalAtencion>")
def getInformacionBrindada(idReclamoCanalAtencion):
    reclamoEmpresa = ReclamoEmpresa.query.filter_by(idReclamoCanalAtencion = idReclamoCanalAtencion).first()
    atencionComercial = AtencionComercial.query.filter_by(idReclamoEmpresa = reclamoEmpresa.idReclamoEmpresa).first()
    informacionYaBrindada = AtencionComercialXInformacionSolicitada.query.filter_by(idAtencionComercial = atencionComercial.idAtencionComercial, estado = 1).all()

    response_json = []

    for informacion in atencionComercial.informacionSolicitada:
        if (informacion.child.tipoInformacion == "Documento" and informacion.archivo is None) or (informacion.child.tipoInformacion == "Entrada" and informacion.texto is None):
            json = informacion.child.toJSON()
            response_json.append(json)
    
    if len(response_json) == 0:
        response_json = {"invalido" : True}

    response_json = jsonify(response_json)
    response_json.headers.add('Access-Control-Allow-Origin', '*')
    return response_json

@app.route("/reclamoCanalAtencionCliente/verOrdenTrabajo/<idReclamoCanalAtencion>")
def getOrdenDeTrabajoPorReclamo(idReclamoCanalAtencion):
    reclamoEmpresa = ReclamoEmpresa.query.filter_by(idReclamoCanalAtencion = idReclamoCanalAtencion).first()
    atencionComercial = AtencionComercial.query.filter_by(idReclamoEmpresa = reclamoEmpresa.idReclamoEmpresa).first()
    ordenTrabajo = OrdenDeTrabajo.query.filter_by(idAtencionComercial = atencionComercial.idAtencionComercial).first()
    json = {}

    json["idOrdenTrabajo"] = ordenTrabajo.idOrdenDeTrabajo
    json["numeroOrden"] = ordenTrabajo.numeroOrden
    json["fechaEmision"] = ordenTrabajo.fechaEmision.strftime("%Y-%m-%d")
    if ordenTrabajo.fechaEntrega is not None:
        json["fechaEntrega"] = ordenTrabajo.fechaEntrega.strftime("%Y-%m-%d")
    else:
        json["fechaEntrega"] = ordenTrabajo.fechaEntrega
    json["descripcionServicio"] = ordenTrabajo.descripcionServicio

    ticket = Ticket.query.filter_by(idAtencionComercial = atencionComercial.idAtencionComercial).first()
    personal = PersonalEmpresa.query.filter_by(idPersonalEmpresa = ticket.idPersonal).first()

    json["personalAsignado"] = personal.nombre
    json["estado"] = ordenTrabajo.estado
    #TODO: Agregar archivo para mostrarlo
    response_json = jsonify(json)
    response_json.headers.add('Access-Control-Allow-Origin', '*')
    return response_json

@app.route("/ticket/verOrdenTrabajo/<idOrdenTrabajo>")
def getOrdenDeTrabajoPorId(idOrdenTrabajo):
    ordenTrabajo = OrdenDeTrabajo.query.filter_by(idOrdenDeTrabajo = idOrdenTrabajo).first()
    json = {}

    json["idNumeroOrden"] = ordenTrabajo.idOrdenDeTrabajo
    json["numeroOrden"] = ordenTrabajo.numeroOrden
    json["fechaEmision"] = ordenTrabajo.fechaEmision.strftime("%Y-%m-%d")
    if ordenTrabajo.fechaEntrega is not None:
        json["fechaEntrega"] = ordenTrabajo.fechaEntrega.strftime("%Y-%m-%d")
    else:
        json["fechaEntrega"] = ordenTrabajo.fechaEntrega
    json["descripcionServicio"] = ordenTrabajo.descripcionServicio

    ticket = Ticket.query.filter_by(idAtencionComercial = ordenTrabajo.idAtencionComercial).first()
    personal = PersonalEmpresa.query.filter_by(idPersonalEmpresa = ticket.idPersonal).first()

    json["personalAsignado"] = personal.nombre
    json["estado"] = ordenTrabajo.estado
    #TODO: Agregar archivo para mostrarlo
    response_json = jsonify(json)
    response_json.headers.add('Access-Control-Allow-Origin', '*')
    return response_json


@app.route("/ticket/ordenDeTrabajo/aprobar/<idOrdenDeTrabajo>", methods = ["POST"])
def aprobarRechazarOrdenDeTrabajo(idOrdenDeTrabajo):
    data = request.get_json()
    ordenTrabajo = OrdenDeTrabajo.query.filter_by(idOrdenDeTrabajo = idOrdenDeTrabajo).first()
    atencionComercial = AtencionComercial.query.filter_by(idAtencionComercial = ordenTrabajo.idAtencionComercial).first()
    reclamoEmpresa = ReclamoEmpresa.query.filter_by(idReclamoEmpresa = atencionComercial.idReclamoEmpresa).first()
    
    if data["aprobar"]:
        ordenTrabajo.estado = "APROBADA"
    else:
        reclamoEmpresa.estado = "ORDEN DE TRABAJO RECHAZADA"
        ordenTrabajo.estado = "RECHAZADA"
    
    db.session.commit()

    return {"Status": "Ok"}

@app.route("/ticket/ordenDeTrabajo/cerrar/<idOrdenDeTrabajo>", methods = ["POST"])
def cerrarOrdenDeTrabajo(idOrdenDeTrabajo):
    ordenTrabajo = OrdenDeTrabajo.query.filter_by(idOrdenDeTrabajo = idOrdenDeTrabajo).first()

    ordenTrabajo.estado = "FINALIZADA"
    
    db.session.commit()

    return {"Status": "Ok"}

@app.route("/reclamosCanalAtencionPersonal/registrar", methods = ["POST"])
def registrarReclamo():
    data = request.get_json()
    cliente = Cliente.query.filter_by(numeroCliente = data['numeroCliente']).first().toJSON()
    nuevoReclamo = ReclamoCanalAtencion(data['descripcion'], date.today(), cliente['idCliente'], data['idPersonal'], 1, 'REGISTRADO')
    db.session.add(nuevoReclamo)
    idNuevoReclamo = db.session.commit()
    return {'idNuevoReclamo': idNuevoReclamo}

@app.route("/reclamosCanalAtencionPersonal/idReclamo/<idReclamo>", methods = ["GET"])
def getReclamoCanalAtencionPorId(idReclamo):
    reclamo = ReclamoCanalAtencion.query.filter_by(idReclamoCanalAtencion = idReclamo).first()
    jsonRespuesta = reclamo.toJSON()
    jsonRespuesta["puedeAprobarse"] = True
    reclamoEmpresa = ReclamoEmpresa.query.filter_by(idReclamoCanalAtencion = idReclamo).first()
    if reclamoEmpresa is not None:
        jsonRespuesta["puedeAprobarse"] = False

    cliente = Cliente.query.filter_by(idCliente = reclamo.idCliente).first()
    jsonRespuesta['fechaRegistro'] = reclamo.fechaRegistro.strftime("%Y-%m-%d")
    jsonRespuesta['numeroCliente'] = cliente.numeroCliente
    jsonRespuesta['dniCliente'] = cliente.dni
    jsonRespuesta['tipoCliente'] = cliente.tipoCliente
    jsonRespuesta['potenciaMinima'] = cliente.potenciaMinima
    jsonRespuesta['potenciaMaxima'] = cliente.potenciaMaxima
    return jsonRespuesta

@app.route("/reclamosCanalAtencionPersonal/actualizar/<idReclamo>", methods = ["PUT"])
def actualizarReclamosCanalAtencion(idReclamo):
    data = request.get_json()
    reclamo = ReclamoCanalAtencion.query.filter_by(idReclamoCanalAtencion = idReclamo).first()
    reclamo.descripcion = data['descripcion']
    db.session.commit()
    return {'Message': 'Reclamo actualizado'}

@app.route("/reclamosCanalAtencionPersonal/eliminar/<idReclamo>", methods = ["PUT"])
def eliminarReclamoCanalAtencion(idReclamo):
    reclamo = ReclamoCanalAtencion.query.filter_by(idReclamoCanalAtencion = idReclamo).first()
    reclamo.estado = 'ELIMINADO'
    db.session.commit()
    return {'Message': 'Reclamo eliminado'}

@app.route("/reclamosCanalAtencionPersonal/rechazar", methods = ["PUT"])
def rechazarReclamo():
    file = request.files["file"]
    motivoRechazo = request.form["motivoRechazo"]
    idReclamoCanalAtencion = request.form["idReclamo"]

    reclamoCanalAtencion = ReclamoCanalAtencion.query.filter_by(idReclamoCanalAtencion = idReclamoCanalAtencion).first()
    reclamoCanalAtencion.estado = "RECHAZADO"
    
    documentoCliente = DocumentoCliente()
    documentoCliente.idPersonal = reclamoCanalAtencion.idPersonal
    documentoCliente.idCliente = reclamoCanalAtencion.idCliente
    documentoCliente.descripcion = motivoRechazo
    documentoCliente.estado = "ACTIVO"
    documentoCliente.fechaGenerado = date.today()
    documentoCliente.archivo = file.read()
    documentoCliente.idReclamoCanalAtencion = idReclamoCanalAtencion

    db.session.add(documentoCliente)
    db.session.commit()

    return {"Status" : "OK"}



@app.route("/instancias", methods = ["GET"])
def listarInstancias():
    instancias = Instancia.query.filter_by(estado = 1)
    response = [instancia.toJSON() for instancia in instancias]
    return response

@app.route("/criteriosAdmisibilidad", methods = ["GET"])
def listarCriterios():
    criterios = CriterioAdmisibilidad.query.filter_by(estado = 1)
    response = [criterio.toJSON() for criterio in criterios]
    return response

@app.route("/tipoClasificacion", methods = ["GET"])
def listarTiposClasificacion():
    tiposClasificacion = TipoClasificacion.query.all()
    response = [tipoClasificacion.toJSON() for tipoClasificacion in tiposClasificacion]
    return response

@app.route("/listarPersonal", methods = ["GET"])
def listarPersonal():
    personalEmpresa = PersonalEmpresa.query.all()
    response = [personal.toJSON() for personal in personalEmpresa]
    return response

@app.route("/informacionAdicional", methods = ["GET"])
def listarInformacionAdicional():
    informacionSolicitada = InformacionSolicitada.query.all()
    return [informacion.toJSON() for informacion in informacionSolicitada]

@app.route("/atencionComercial/registrar", methods = ["POST"])
def registrarAtencionComercial():
    data = request.get_json()
    cliente = Cliente.query.filter_by(numeroCliente = data["reclamo"]["numeroCliente"]).first()
    tipoClasificacion = TipoClasificacion.query.filter_by(idTipoClasificacion = data["tipoClasificacion"]).first()
    fechaFinal = date.today() + timedelta(hours=tipoClasificacion.tiempoMaximoAtencion)
    reclamoCanalAtencion = ReclamoCanalAtencion.query.filter_by(idReclamoCanalAtencion = data["reclamo"]["idReclamoCanalAtencion"]).first()
    reclamoCanalAtencion.idCriterioAdmisibilidad = data["criterioSeleccionado"]

    reclamoEmpresa = ReclamoEmpresa(data["reclamo"]["descripcion"],"ALTA",date.today(), date.today(), fechaFinal, "ATENCION COMERCIAL", cliente.idCliente, data["tipoClasificacion"], data["reclamo"]["idReclamoCanalAtencion"], data["personalAsignado"])
    db.session.add(reclamoEmpresa)
    db.session.commit()

    #Atencion Comercial
    atencionComercial = AtencionComercial(data["reclamo"]["descripcion"], "BNR5",data["personalAsignado"], reclamoEmpresa.idReclamoEmpresa, data["instancia"])
    db.session.add(atencionComercial)
    db.session.commit()
    for informacionSolicitada in data["informacionAdicional"]:
        informacion = AtencionComercialXInformacionSolicitada(atencionComercial.idAtencionComercial, informacionSolicitada, 1)
        db.session.add(informacion)
        
    db.session.commit()

    return data

@app.route("/atencionComercial/<idPersonalAsignado>", methods = ["GET"])
def atencionComercialListar(idPersonalAsignado):
    atencionesComerciales = AtencionComercial.query.filter_by(idPersonalAsignado = idPersonalAsignado).order_by(AtencionComercial.idAtencionComercial.desc()).all()

    response_json = []
    for atencionComercial in atencionesComerciales:
        json = {}
        instancia = Instancia.query.filter_by(idInstancia=atencionComercial.idInstancia).first()
        reclamoEmpresa = ReclamoEmpresa.query.filter_by(idReclamoEmpresa = atencionComercial.idReclamoEmpresa).first()
        if reclamoEmpresa.estado == "CERRADO":
            continue
        json = atencionComercial.toJSON()
        json["instancia"] = instancia.nombre
        json["fechaReclamoProcesado"] = reclamoEmpresa.fechaReclamoProcesado.strftime("%d/%m/%Y")
        json["fechaMaximaAtencion"] = ""
        if reclamoEmpresa.fechaMaximaAtencion is not None:
            json["fechaMaximaAtencion"] = reclamoEmpresa.fechaMaximaAtencion.strftime("%d/%m/%Y")
        response_json.append(json)

    response_json = jsonify(response_json)
    response_json.headers.add('Access-Control-Allow-Origin', '*')
    
    return response_json

@app.route("/atencionComercial/visualizar/<idAtencionComercial>", methods = ["GET"])
def visualizarAtencionComercial(idAtencionComercial):
    atencionComercial = AtencionComercial.query.filter_by(idAtencionComercial = idAtencionComercial).first()
    response_json = atencionComercial.toJSON()
    reclamoEmpresa = ReclamoEmpresa.query.filter_by(idReclamoEmpresa = atencionComercial.idReclamoEmpresa).first()
    reclamoCanalAtencion = ReclamoCanalAtencion.query.filter_by(idReclamoCanalAtencion = reclamoEmpresa.idReclamoCanalAtencion).first()

    cliente = Cliente.query.filter_by(idCliente = reclamoEmpresa.idCliente).first()
    instancia = Instancia.query.filter_by(idInstancia = atencionComercial.idInstancia).first()
    tipoClasificacion = TipoClasificacion.query.filter_by(idTipoClasificacion = reclamoEmpresa.idTipoClasificacion).first()

    response_json["numeroCliente"] = cliente.numeroCliente
    response_json["dniCliente"] = cliente.dni
    response_json["tipoCliente"] =  cliente.tipoCliente
    response_json["fechaProcesado"] =  reclamoEmpresa.fechaReclamoIngresado.strftime("%d/%m/%Y")
    response_json["fechaRegistro"] = reclamoCanalAtencion.fechaRegistro.strftime("%d/%m/%Y")
    response_json["ubicacion"] = cliente.ubicacion
    response_json["instancia"] = instancia.nombre
    response_json["tarifa"] = atencionComercial.tarifa
    response_json["tipoClasificacion"] = tipoClasificacion.nombre
    response_json["potenciaMinima"] = cliente.potenciaMinima
    response_json["potenciaMaxima"] = cliente.potenciaMaxima

    response_json["numeroTicketAsociado"] = ""

    ticket = Ticket.query.filter_by(idAtencionComercial = atencionComercial.idAtencionComercial).first()

    if ticket is not None:
        response_json["numeroTicketAsociado"] = ticket.idTicket

    response_json["necesitaInformacionAdicional"] = False
    informacionYaBrindada = AtencionComercialXInformacionSolicitada.query.filter_by(idAtencionComercial = atencionComercial.idAtencionComercial, estado = 1).all()
    for informacion in atencionComercial.informacionSolicitada:
        if (informacion.child.tipoInformacion == "Documento" and informacion.archivo is None) or (informacion.child.tipoInformacion == "Entrada" and informacion.texto is None):
            response_json["necesitaInformacionAdicional"] = True


    return jsonify(response_json)


@app.route("/reclamosCanalAtencionCliente/registroArchivoInformacionAdicional", methods = ["POST"])
def registroArchivoInformacionAdicional():
    file = request.files["file"]
    idReclamoCanalAtencion = request.form["idReclamoCanalAtencion"]
    idInformacionSolicitada = request.form["idInformacionSolicitada"]

    reclamoEmpresa = ReclamoEmpresa.query.filter_by(idReclamoCanalAtencion = idReclamoCanalAtencion).first()
    atencionComercial = AtencionComercial.query.filter_by(idReclamoEmpresa= reclamoEmpresa.idReclamoEmpresa).first()

    tipoInformacion = AtencionComercialXInformacionSolicitada.query.filter_by(idAtencionComercial = atencionComercial.idAtencionComercial, idInformacionSolicitada = idInformacionSolicitada).first()

    tipoInformacion.archivo = file.read()

    db.session.commit()

    return {"Status" : 'Ok'}


@app.route("/atencionComercial/solicitarInformacionAdicionalArchivo/<idAtencionComercial>", methods = ["GET"])
def solicitarInformacionAdicionalArchivo(idAtencionComercial):
    informacionXAtencionComercial = AtencionComercialXInformacionSolicitada.query.filter_by(idAtencionComercial = idAtencionComercial)
    for info in informacionXAtencionComercial:
        if info.child.tipoInformacion == "Documento":
            return send_file(BytesIO(info.archivo), download_name=str(info.child.nombre).strip(), mimetype="application/pdf")

    return {'Status': 'Sin archivo'}

@app.route("/documentoCliente/descargar/<idDocumentoCliente>", methods = ["GET"])
def getOrdenTrabajoArchivo(idDocumentoCliente):
    documentoCliente = DocumentoCliente.query.filter_by(idDocumentoCliente = idDocumentoCliente).first()

    return send_file(BytesIO(documentoCliente.archivo), download_name="documentoCliente", mimetype="application/pdf")


@app.route("/ticket/descargarOrdenTrabajo/<idOrdenDeTrabajo>", methods = ["GET"])
def getDocumentoCliente(idOrdenDeTrabajo):
    ordenTrabajo = OrdenDeTrabajo.query.filter_by(idOrdenDeTrabajo = idOrdenDeTrabajo).first()

    return send_file(BytesIO(ordenTrabajo.archivo), download_name="ordenTrabajo", mimetype="application/pdf")



@app.route("/documentoCliente/listarCliente")
def listarClientes():
    clientes = Cliente.query.all()
    json_response = []
    for cliente in clientes:
        json_response.append(cliente.toJSON())

    return jsonify(json_response)

@app.route("/documentoCliente/reporteAtencionComercial/<idCliente>")
def reporteAtencionComercial(idCliente):
    if idCliente != -1:
        reclamosEmpresa = ReclamoEmpresa.query.filter_by(idCliente = idCliente).order_by(ReclamoEmpresa.idReclamoEmpresa.asc()).all()
    else:
        reclamosEmpresa = ReclamoEmpresa.query.order_by(ReclamoEmpresa.idReclamoEmpresa.asc()).all()

    reclamoEmpresaCerrado = 0
    reclamoEmpresaTrabajoCampo = 0
    reclamoEmpresaOrdenRechazada = 0
    cliente = Cliente.query.filter_by(idCliente = idCliente).first()
    
    jsonCerrados = {}
    jsonTrabajoCampo = {}
    jsonOrdenRechazado = {}
    json_response = {}
    informacionReclamoCerrado = []
    informacionReclamoTrabajoCampo = []
    informacionReclamoOrdenRechazada = []
    for reclamo in reclamosEmpresa:
        json = {}
        reclamoCanalAtencion = ReclamoCanalAtencion.query.filter_by(idReclamoCanalAtencion = reclamo.idReclamoCanalAtencion).first()
        json["terminadoATiempo"] = "--"
        json["fechaCerrado"] = "--"   
        json["descripcion"] = reclamoCanalAtencion.descripcion
        json["fechaIngresado"] = reclamoCanalAtencion.fechaRegistro.strftime("%d-%b-%Y")
        json["codigoReclamo"] = reclamo.idReclamoEmpresa
        json["cliente"] = cliente.nombre
        if reclamo.estado == "CERRADO":
            reclamoEmpresaCerrado += 1
            json["fechaCerrado"] = reclamo.fechaReclamoProcesado.strftime("%d-%b-%Y")
            if reclamo.fechaMaximaAtencion is not None:
                if reclamo.fechaReclamoProcesado <= reclamo.fechaMaximaAtencion:
                    json["terminadoATiempo"] = "SI" 
            informacionReclamoCerrado.append(json)       
        elif reclamo.estado == "TRABAJO CAMPO":
            reclamoEmpresaTrabajoCampo += 1   
            informacionReclamoTrabajoCampo.append(json)      
        elif reclamo.estado == "ORDEN DE TRABAJO RECHAZADA":
            reclamoEmpresaOrdenRechazada += 1         
            informacionReclamoOrdenRechazada.append(json)
    
    json_response["informacionReclamoCerrado"] = informacionReclamoCerrado
    json_response["informacionReclamoTrabajoCampo"] = informacionReclamoTrabajoCampo
    json_response["informacionReclamoOrdenRechazada"] = informacionReclamoOrdenRechazada
    json_response["cantidadCerrados"] = reclamoEmpresaCerrado
    json_response["cantidadTrabajoCampos"] = reclamoEmpresaTrabajoCampo
    json_response["cantidadOrdenRechazada"] = reclamoEmpresaOrdenRechazada

    return jsonify(json_response)


@app.route("/documentoCliente/reporteTickets/<idCliente>")
def reporteTickets(idCliente):
    if idCliente != -1:
        reclamosEmpresa = ReclamoEmpresa.query.filter_by(idCliente = idCliente).order_by(ReclamoEmpresa.idReclamoEmpresa.asc()).all()
    else:
        reclamosEmpresa = ReclamoEmpresa.query.order_by(ReclamoEmpresa.idReclamoEmpresa.asc()).all()

    cliente = Cliente.query.filter_by(idCliente = idCliente).first()

    json_response = {}

    cantidadTicketsGenerados = 0
    cantidadTicketOrdenTrabajo = 0
    cantidadTicketOrdenTrabajoEnProgreso = 0
    informacionTickets = []
    for reclamo in reclamosEmpresa:
        json = {}
        atencionComercial = AtencionComercial.query.filter_by(idReclamoEmpresa = reclamo.idReclamoEmpresa).first()
        ticket = Ticket.query.filter_by(idAtencionComercial = atencionComercial.idAtencionComercial).first()
        if ticket is not None:
            personal = PersonalEmpresa.query.filter_by(idPersonalEmpresa = ticket.idPersonal).first()
            json["descripcionTicket"] = ticket.descripcion
            json["personalAsignado"] = personal.nombre
            json["codigoTicket"] = ticket.idTicket
            json["cliente"] = cliente.nombre
            cantidadTicketsGenerados += 1

            ordenDeTrabajo = OrdenDeTrabajo.query.filter_by(idAtencionComercial = atencionComercial.idAtencionComercial).first()

            json["tipoServicio"] = "--"           
            if ordenDeTrabajo is not None:
                cantidadTicketOrdenTrabajo += 1
                json["estado"] = ordenDeTrabajo.estado
                if ordenDeTrabajo.resultados != "":
                    cantidadTicketOrdenTrabajoEnProgreso += 1
                    json["tipoServicio"] = ordenDeTrabajo.tipoServicio
            
            informacionTickets.append(json)

    json_response["informacionTickets"] = informacionTickets
    json_response["porcentajeTicketsConOrdenDeTrabajo"] = round(percentage(cantidadTicketOrdenTrabajo, cantidadTicketsGenerados),2)
    json_response["porcentajeOrdenTrabajoEnProgreso"] = round(percentage(cantidadTicketOrdenTrabajoEnProgreso, cantidadTicketOrdenTrabajo),2)
    json_response["porcentajeTicketsEnProgreso"] = round(percentage(cantidadTicketOrdenTrabajoEnProgreso, cantidadTicketsGenerados),2)

    return jsonify(json_response)

def percentage(part, whole):
  return 100 * float(part)/float(whole)

@app.route("/atencionComercial/solicitarInformacionAdicionalTexto/<idAtencionComercial>", methods = ["GET"])
def solicitarInformacionAdicionalTexto(idAtencionComercial):
    informacionXAtencionComercial = AtencionComercialXInformacionSolicitada.query.filter_by(idAtencionComercial = idAtencionComercial)
    response_json = {}
    for info in informacionXAtencionComercial:
        if info.child.tipoInformacion == "Entrada":
            response_json["nombreTexto"] = info.child.nombre
            response_json["texto"] = info.texto
        if info.child.tipoInformacion == "Documento":
            response_json["nombreArchivo"] = info.child.nombre
    return response_json


@app.route("/reclamosCanalAtencionCliente/registroTextInformacionAdicional", methods = ["POST"])
def registroTextoInformacionAdicional():
    data = request.get_json()
    for key in data:
        informacion = data[key]
        reclamoEmpresa = ReclamoEmpresa.query.filter_by(idReclamoCanalAtencion = informacion["idReclamoCanalAtencion"]).first()
        atencionComercial = AtencionComercial.query.filter_by(idReclamoEmpresa= reclamoEmpresa.idReclamoEmpresa).first()
        tipoInformacion = AtencionComercialXInformacionSolicitada.query.filter_by(idAtencionComercial = atencionComercial.idAtencionComercial, idInformacionSolicitada = informacion["idInformacionSolicitada"]).first()

        tipoInformacion.texto = informacion["valor"]

        db.session.commit()

    return {"Status": "Ok"}

@app.route("/ticket/registrar", methods = ["POST"])
def registrarTicket():
    data = request.get_json()
    cliente = Cliente.query.filter_by(numeroCliente = data["numeroCliente"]).first()

    ticket = Ticket(cliente.idCliente, data["descripcion"], data["idPersonal"], data["idAtencionComercial"])
    atencionComercial = AtencionComercial.query.filter_by(idAtencionComercial = data["idAtencionComercial"]).first()
    reclamoEmpresa = ReclamoEmpresa.query.filter_by(idReclamoEmpresa = atencionComercial.idReclamoEmpresa).first()
    reclamoEmpresa.estado = "TICKET GENERADO"
    db.session.add(ticket)
    db.session.commit()

    return {"Status": "Ok"}

@app.route("/ticket/<idPersonalAsignado>", methods = ["GET"])
def listarTicketsPersonal(idPersonalAsignado):
    listaTickets = Ticket.query.filter_by(idPersonal = idPersonalAsignado).order_by(Ticket.idTicket.desc()).all()
    json_response = []
    for ticket in listaTickets:
        json = ticket.toJSON()
        atencionComercial = AtencionComercial.query.filter_by(idAtencionComercial = ticket.idAtencionComercial).first()
        reclamoEmpresa = ReclamoEmpresa.query.filter_by(idReclamoEmpresa = atencionComercial.idReclamoEmpresa).first()
        json["fechaProcesado"] = reclamoEmpresa.fechaReclamoProcesado.strftime("%d-%b-%Y")
        json["fechaMaximaAtencion"] = "--"
        if reclamoEmpresa.fechaMaximaAtencion is not None:
            json["fechaMaximaAtencion"] = reclamoEmpresa.fechaMaximaAtencion.strftime("%d-%b-%Y")

        json["idAtencionComercial"] = atencionComercial.idAtencionComercial
        json_response.append(json)
    
    return jsonify(json_response)

@app.route("/ticket/visualizar/<idTicket>", methods = ["GET"])
def visualizarDetalleTicket(idTicket):
    ticket = Ticket.query.filter_by(idTicket = idTicket).first()
    json = ticket.toJSON()
    atencionComercial = AtencionComercial.query.filter_by(idAtencionComercial = ticket.idAtencionComercial).first()
    reclamoEmpresa = ReclamoEmpresa.query.filter_by(idReclamoEmpresa = atencionComercial.idReclamoEmpresa).first()
    json["fechaMaximaAtencion"] = ""
    json["idAtencionComercial"] = atencionComercial.idAtencionComercial
    if reclamoEmpresa.fechaMaximaAtencion is not None:
            json["fechaMaximaAtencion"] = reclamoEmpresa.fechaMaximaAtencion.strftime("%d-%b-%Y")
    json["fechaProcesado"] = reclamoEmpresa.fechaReclamoProcesado.strftime("%d-%b-%Y")

    personalEmpresa = PersonalEmpresa.query.filter_by(idPersonalEmpresa = ticket.idPersonal).first()
    
    json["nombrePersonal"] = personalEmpresa.nombre

    ordenTrabajo = OrdenDeTrabajo.query.filter_by(idAtencionComercial = atencionComercial.idAtencionComercial).first()
    json["ordenDeTrabajoAprobada"] = False
    json["ordenDeTrabajoYaGenerada"] = False
    json["ordenDeTrabajoRechazada"] = False
    json["ticketFinalizado"] = False
    json["finalizado"] = False
    json["notas"] = ""
    json["costo"] = ""
    json["tipoServicio"] = ""
    json["resultados"] = ""
    json["idOrdenTrabajo"] = -1
    if ordenTrabajo is not None:
        json["notas"] = ordenTrabajo.notas
        json["costo"] = ordenTrabajo.costo
        json["resultados"] = ordenTrabajo.resultados
        json["idOrdenTrabajo"] = ordenTrabajo.idOrdenDeTrabajo
        json["numeroOrden"] = ordenTrabajo.numeroOrden
        json["tipoServicio"] = ordenTrabajo.tipoServicio

        json["ordenDeTrabajoYaGenerada"] = True
        if ordenTrabajo.estado == "APROBADA":
            json["ordenDeTrabajoAprobada"] = True
        elif ordenTrabajo.estado == "RECHAZADA":
            json["ordenDeTrabajoRechazada"] = True
        elif ordenTrabajo.estado == "FINALIZADA":
            json["finalizado"] = True
        elif ordenTrabajo.estado == "TICKET FINALIZADO":
            json["ordenDeTrabajoAprobada"] = True
            json["finalizado"] = True
            json["ticketFinalizado"] = True
            

    return jsonify(json)

@app.route("/ticket/ordenDeTrabajo/registrar", methods = ["POST"])
def registrarOrdenTrabajo():
    data = request.get_json()
    ordenTrabajo = OrdenDeTrabajo()
    if "idOrdenTrabajo" in data:
        ordenTrabajo = OrdenDeTrabajo.query.filter_by(idOrdenDeTrabajo = data["idOrdenTrabajo"]).first()
        ordenTrabajo.notas = data["notas"]
        ordenTrabajo.costo = data["costo"]
        ordenTrabajo.tipoServicio = data["tipoServicio"]
        ordenTrabajo.resultados = data["resultados"]
    else:     
        atencionComercial = AtencionComercial.query.filter_by(idAtencionComercial = data["idAtencionComercial"]).first()
        reclamoEmpresa = ReclamoEmpresa.query.filter_by(idReclamoEmpresa = atencionComercial.idReclamoEmpresa).first()
        reclamoEmpresa.estado = "TRABAJO CAMPO"
        ordenTrabajo.numeroOrden = 'OT-00' + str(data["idAtencionComercial"])
        ordenTrabajo.fechaEmision = date.today()
        if data["fechaEntrega"] == "":
            ordenTrabajo.fechaEntrega = None
        else:
            ordenTrabajo.fechaEntrega = data["fechaEntrega"]
        ordenTrabajo.descripcionServicio = data["descripcion"]
        ordenTrabajo.tipoServicio = data["tipoServicio"]
        ordenTrabajo.notas = data["notas"]
        ordenTrabajo.costo = data["costo"]
        ordenTrabajo.tipoServicio = data["tipoServicio"]
        ordenTrabajo.resultados = data["resultados"]
        ordenTrabajo.estado = "INGRESADO"
        ordenTrabajo.idAtencionComercial = data["idAtencionComercial"]

        db.session.add(ordenTrabajo)
        
    db.session.commit()

    return {"idOrdenTrabajo": ordenTrabajo.idOrdenDeTrabajo}  

@app.route("/ticket/ordenDeTrabajo/subirDocumento/<idOrdenDeTrabajo>", methods = ["POST"])
def subirArchivoOrdenDeTrabajo(idOrdenDeTrabajo):
    file = request.files["file"]

    ordenDeTrabajo = OrdenDeTrabajo.query.filter_by(idOrdenDeTrabajo = idOrdenDeTrabajo).first()

    ordenDeTrabajo.archivo = file.read()

    db.session.commit()

    return {"Status" : 'Ok'}

@app.route("/ticket/documentoRespuesta/subirDocumento/<idOrdenDeTrabajo>", methods = ["POST"])
def subirArchivoDocumentoRespuesta(idOrdenDeTrabajo):
    file = request.files["file"]
    ordenDeTrabajo = OrdenDeTrabajo.query.filter_by(idOrdenDeTrabajo = idOrdenDeTrabajo).first()
    ticket = Ticket.query.filter_by(idAtencionComercial = ordenDeTrabajo.idAtencionComercial).first()
    atencionComercial = AtencionComercial.query.filter_by(idAtencionComercial = ordenDeTrabajo.idAtencionComercial).first()
    reclamoEmpresa = ReclamoEmpresa.query.filter_by(idReclamoEmpresa = atencionComercial.idReclamoEmpresa).first()
    
    ordenDeTrabajo.estado = "TICKET FINALIZADO"
    documentoCliente = DocumentoCliente()

    documentoCliente.idPersonal = ticket.idPersonal
    documentoCliente.idCliente = ticket.idCliente
    documentoCliente.idReclamoCanalAtencion = reclamoEmpresa.idReclamoCanalAtencion
    documentoCliente.fechaGenerado = date.today()
    documentoCliente.descripcion = "DocumentoRespuesta-" + str(ticket.idCliente) + str(ticket.idTicket)
    documentoCliente.estado = "ACTIVO"
    documentoCliente.archivo  = file.read()

    db.session.add(documentoCliente)
    db.session.commit()

    return {"Status" : 'Ok'}

@app.route("/documentosCliente/<numeroCliente>")
def listarDocumentosDeCliente(numeroCliente):
    cliente = Cliente.query.filter_by(numeroCliente = numeroCliente).first()

    documentosCliente = DocumentoCliente.query.filter_by(idCliente = cliente.idCliente).all()

    json_response = []
    for documento in documentosCliente:
        reclamoCanalAtencion = ReclamoCanalAtencion.query.filter_by(idReclamoCanalAtencion = documento.idReclamoCanalAtencion).first()
        json = {}
        json["codigo"] = documento.idDocumentoCliente
        json["descripcion"] = documento.descripcion
        json["fechaGenerado"] = documento.fechaGenerado.strftime("%d-%b-%Y")
        json["reclamoRelacionado"] = reclamoCanalAtencion.descripcion
        json["idDocumentoCliente"] = documento.idDocumentoCliente
        json_response.append(json)

    
    return jsonify(json_response)


def guardarBDRegistroReclamo(idPersonalAsignado):
    cliente = Cliente.query.filter_by(numeroCliente = users[idPersonalAsignado]['pregunta1']).first()
    nuevoReclamo = ReclamoCanalAtencion(users[idPersonalAsignado]['pregunta2'], date.today(), cliente.idCliente, None, 3, 'REGISTRADO')
    db.session.add(nuevoReclamo)
    idNuevoReclamo = db.session.commit()
    return idNuevoReclamo
@app.route("/wasms", methods=["POST"])
def wa_sms_reply():
    senderId = 1
    msg = request.form.get('Body').lower()
    clientesGlobales = Cliente.query.all()
    global users
    if(senderId not in users):
        users[senderId] = {}
        users[senderId]['estadoActual'] = estados['pregunta1']
    else:
        users[senderId][users[senderId]['estadoActual']] = msg
        users[senderId]['estadoActual'] = estadosSiguientes[users[senderId]['estadoActual']]
        if(users[senderId]['estadoActual'] == estados['fin']):
            resp = MessagingResponse()
            reply = resp.message()
            reply.body("Muchas gracias por registrar tu reclamo.\nPuedes visitar tu localhost:3000 para visualizar el estado del mismo.")
            guardarBDRegistroReclamo(senderId)
            users = {}
            return str(resp)
    encontrado = False
    if(users[senderId]['estadoActual'] == estados['pregunta2']):
        for cliente in clientesGlobales:
            if(cliente.numeroCliente == users[senderId][estados['pregunta1']]):
                encontrado = True
        if not encontrado:
            resp = MessagingResponse()
            reply = resp.message()
            reply.body(mensajes[estados['error']])
            users = {}
            return str(resp)

    resp = MessagingResponse()
    reply = resp.message()
    reply.body(mensajes[users[senderId]['estadoActual']])
    if(users[senderId]['estadoActual'] == estados['fin']):
        users[senderId] = None;
    
    
    return str(resp)



