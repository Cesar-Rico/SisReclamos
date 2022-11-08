from .DBInit import db


class TipoClasificacion(db.Model):
    __tablename__ = 'tipoClasificacion'
    idTipoClasificacion = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String(100))
    descripcion = db.Column(db.String(100))
    tiempoMaximoAtencion = db.Column(db.Integer)

    def toJSON(self):
        return ({
            'idTipoClasificacion': self.idTipoClasificacion,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'tiempoMaximoAtencion': self.tiempoMaximoAtencion
        })

class PersonalEmpresa(db.Model):
    __tablename__ = 'personalEmpresa'
    idPersonalEmpresa = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String(100))
    codigoTrabajador = db.Column(db.String(50))
    cargo = db.Column(db.String(50))
    area = db.Column(db.String(50))
    vigente = db.Column(db.DateTime)
    estado = db.Column(db.String(50))

    def toJSON(self):
        return ({
            'idPersonalEmpresa': self.idPersonalEmpresa,
            'nombre': self.nombre,
            'codigoTrabajador': self.codigoTrabajador,
            'cargo': self.cargo,
            'area': self.area,
            'vigente': self.vigente,
            'estado': self.estado
        })

class CanalAtencion(db.Model):
    __tablename__ = 'canalAtencion'
    idCanalAtencion = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String(100))
    descripcion = db.Column(db.String(200))
    vigencia = db.Column(db.DateTime)
    url = db.Column(db.String(100))
    estado = db.Column(db.Integer)

class CriterioAdmisibilidad(db.Model):
    __tablename__ = 'criterioAdmisibilidad'
    idCriterioAdmisibilidad = db.Column(db.Integer, primary_key = True)
    descripcion = db.Column(db.String(200))
    vigente = db.Column(db.DateTime)
    requisitos = db.Column(db.String(100))
    estado = db.Column(db.Integer)

    def toJSON(self):
        return ({
            'idCriterioAdmisibilidad': self.idCriterioAdmisibilidad,
            'descripcion': self.descripcion,
            'vigente': self.vigente,
            'requisitos': self.requisitos,
            'estado': self.estado
        })



class Cliente(db.Model):
    __tablename__ = 'cliente'
    idCliente = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String(50))
    email = db.Column(db.String(100))
    numeroCliente = db.Column(db.String(10))
    dni = db.Column(db.Integer)
    descripcion = db.Column(db.String(200))
    tipoCliente = db.Column(db.String(50))
    ubicacion = db.Column(db.String(200))
    potenciaMinima = db.Column(db.Integer)
    potenciaMaxima = db.Column(db.Integer)
    
    def toJSON(self):
        return ({
            'idCliente': self.idCliente,
            'nombre': self.nombre
            })

class ReclamoCanalAtencion(db.Model):
    __tablename__ = 'reclamoCanalAtencion'
    idReclamoCanalAtencion = db.Column(db.Integer, primary_key = True)
    descripcion = db.Column(db.String(200))
    fechaRegistro = db.Column(db.DateTime)
    idCliente = db.Column(db.Integer, db.ForeignKey('cliente.idCliente'))
    idCriterioAdmisibilidad = db.Column(db.Integer, db.ForeignKey('criterioAdmisibilidad.idCriterioAdmisibilidad'))
    idCanalAtencion = db.Column(db.Integer, db.ForeignKey('canalAtencion.idCanalAtencion'))
    idPersonal = db.Column(db.Integer, db.ForeignKey('personalEmpresa.idPersonalEmpresa'))
    estado = db.Column(db.String(20))
    
    def __init__(self, descripcion, fechaRegistro, idCliente, idPersonal, idCanalAtencion, estado):
        self.descripcion = descripcion
        self.fechaRegistro = fechaRegistro
        self.idCliente = idCliente
        self.idPersonal = idPersonal
        self.estado = estado
        self.idCanalAtencion = idCanalAtencion
    
    def toJSON(self):
        return ({
            'idReclamoCanalAtencion': self.idReclamoCanalAtencion,
            'descripcion': self.descripcion,
            'fechaRegistro': self.fechaRegistro,
            'numeroCliente': self.idCliente
        })
    
class ReclamoEmpresa(db.Model):
    __tablename__ = 'reclamoEmpresa'
    idReclamoEmpresa = db.Column(db.Integer, primary_key = True)
    descripcion = db.Column(db.String(200))
    severidad = db.Column(db.String(50))
    fechaReclamoIngresado = db.Column(db.DateTime)
    fechaReclamoProcesado = db.Column(db.DateTime)
    fechaMaximaAtencion = db.Column(db.DateTime)
    estado = db.Column(db.String(50))
    idCliente = db.Column(db.Integer, db.ForeignKey('cliente.idCliente'))
    idTipoClasificacion = db.Column(db.Integer, db.ForeignKey('tipoClasificacion.idTipoClasificacion'))
    idReclamoCanalAtencion = db.Column(db.Integer, db.ForeignKey('reclamoCanalAtencion.idReclamoCanalAtencion'))
    idPersonalAsignado = db.Column(db.Integer, db.ForeignKey('personalEmpresa.idPersonalEmpresa'))

    def __init__(self, descripcion, severidad, fechaReclamoIngresado, fechaReclamoProcesado, fechaMaximaAtencion, estado, idCliente, idTipoClasificacion, idReclamoCanalAtencion, idPersonalAsignado):
        self.descripcion = descripcion
        self.severidad = severidad
        self.fechaReclamoIngresado = fechaReclamoIngresado
        self.fechaReclamoProcesado = fechaReclamoProcesado
        self.fechaMaximaAtencion = fechaMaximaAtencion
        self.estado = estado
        self.idCliente = idCliente
        self.idTipoClasificacion = idTipoClasificacion
        self.idReclamoCanalAtencion = idReclamoCanalAtencion
        self.idPersonalAsignado = idPersonalAsignado

class Instancia(db.Model):
    __tablename__ = 'instancia'
    idInstancia = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String(50))
    estado = db.Column(db.Integer)

    def toJSON(self):
        return (
            {
                'idInstancia': self.idInstancia,
                'nombre': self.nombre
            }
        )

class AtencionComercialXInformacionSolicitada(db.Model):
    __tablename__ = 'atencionComercialXInformacionSolicitada'
    idAtencionComercial = db.Column(db.ForeignKey('atencionComercial.idAtencionComercial'), primary_key = True)
    idInformacionSolicitada = db.Column(db.ForeignKey('informacionSolicitada.idInformacionSolicitada'), primary_key=True)
    estado = db.Column(db.Integer)
    child = db.relationship('InformacionSolicitada')
    archivo = db.Column(db.LargeBinary)
    texto = db.Column(db.String(500))
    
    def __init__(self, idAtencionComercial, idInformacionSolicitada, estado):
        self.idAtencionComercial = idAtencionComercial
        self.idInformacionSolicitada = idInformacionSolicitada
        self.estado = estado

class AtencionComercial(db.Model):
    __tablename__ = 'atencionComercial'
    idAtencionComercial = db.Column(db.Integer, primary_key = True)
    descripcion = db.Column(db.String(100))
    tarifa = db.Column(db.String(50))
    idPersonalAsignado = db.Column(db.Integer, db.ForeignKey('personalEmpresa.idPersonalEmpresa'))
    idReclamoEmpresa = db.Column(db.Integer, db.ForeignKey('reclamoEmpresa.idReclamoEmpresa'))
    idInstancia = db.Column(db.Integer, db.ForeignKey('instancia.idInstancia'))
    informacionSolicitada = db.relationship("AtencionComercialXInformacionSolicitada")

    def __init__(self, descripcion, tarifa, idPersonalAsignado, idReclamoEmpresa, idInstancia):
        self.descripcion = descripcion
        self.tarifa = tarifa
        self.idPersonalAsignado = idPersonalAsignado
        self.idReclamoEmpresa = idReclamoEmpresa
        self.idInstancia = idInstancia
    
    def toJSON(self):
        return (
            {
                'idAtencionComercial': self.idAtencionComercial,
                'descripcion': self.descripcion,
                'tarifa' : self.tarifa
            }
        )


class InformacionSolicitada(db.Model):
    __tablename__ = 'informacionSolicitada'
    idInformacionSolicitada = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String(200))
    descripcion = db.Column(db.String(500))
    tipoInformacion = db.Column(db.String(200))

    def toJSON(self):
        return (
            {
                'idInformacionSolicitada': self.idInformacionSolicitada,
                'nombre': self.nombre,
                'descripcion' : self.descripcion,
                'tipoInformacion' : self.tipoInformacion
            }
        )


class OrdenDeTrabajo(db.Model):
    __tablename__ = 'ordendetrabajo'
    idOrdenDeTrabajo = db.Column(db.Integer, primary_key = True)
    numeroOrden = db.Column(db.String(200))
    fechaEmision = db.Column(db.DateTime)
    fechaEntrega = db.Column(db.DateTime)
    descripcionServicio = db.Column(db.String(500))
    tipoServicio = db.Column(db.String(200))
    notas = db.Column(db.String(500))
    costo = db.Column(db.String(200))
    resultados = db.Column(db.String(500))
    estado = db.Column(db.String(200))
    idAtencionComercial = db.Column(db.Integer, db.ForeignKey('atencionComercial.idAtencionComercial'))
    archivo = db.Column(db.LargeBinary)

class Ticket(db.Model):
    __tablename__ = 'ticket'
    idTicket = db.Column(db.Integer, primary_key = True)
    idCliente = db.Column(db.Integer, db.ForeignKey('cliente.idCliente'))
    descripcion = db.Column(db.String(500))
    idPersonal = db.Column(db.Integer, db.ForeignKey('personalEmpresa.idPersonalEmpresa'))
    idAtencionComercial = db.Column(db.Integer, db.ForeignKey('atencionComercial.idAtencionComercial'))
    def __init__(self, idCliente, descripcion, idPersonal, idAtencionComercial):
        self.idCliente = idCliente
        self.descripcion = descripcion
        self.idPersonal = idPersonal
        self.idAtencionComercial = idAtencionComercial

    def toJSON(self):
        return (
            {
                'idTicket': self.idTicket,
                'idCliente': self.idCliente,
                'descripcion' : self.descripcion,
                'idPersonal' : self.idPersonal
            }
        )
class Reporte(db.Model):
    __tablename__ = 'reporte'
    idReporte = db.Column(db.Integer, primary_key = True)
    tipoReporte = db.Column(db.String(100))
    fechaEntrega = db.Column(db.DateTime)
    archivo = db.Column(db.LargeBinary)

class DocumentoCliente(db.Model):
    __tablename__ = 'documentoCliente'
    idDocumentoCliente = db.Column(db.Integer, primary_key = True)
    idPersonal = db.Column(db.Integer, db.ForeignKey('personalEmpresa.idPersonalEmpresa'))
    idCliente = db.Column(db.Integer, db.ForeignKey('cliente.idCliente'))
    idReclamoCanalAtencion = db.Column(db.Integer, db.ForeignKey('reclamoCanalAtencion.idReclamoCanalAtencion'))
    fechaGenerado = db.Column(db.DateTime)
    descripcion = db.Column(db.String(500))
    estado = db.Column(db.String(100))    
    archivo = db.Column(db.LargeBinary)

