from flask import Flask, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

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

@app.route("/reclamosCanalAtencionPersonal/<idPersonal>", methods = ["GET"])
def getReclamosCanalAtencion(idPersonal):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""select r.idreclamocanalatencion, r.descripcion, c.numeroCliente, ca.nombre, r.fecharegistro
                    from reclamocanalatencion r 
                    inner join cliente c on c.idcliente = r.idcliente 
                    inner join canalatencion ca on ca.idcanalatencion = r.idcanalatencion 
                    where idpersonal = """ + idPersonal + """
                    and r.estado = 'REGISTRADO'""")
    reclamos = cur.fetchall()
    
    retorno = []
    for reclamo in reclamos:
        retorno.append(retornarJsonReclamo(reclamo[0],reclamo[1], reclamo[2], reclamo[3], reclamo[4]));
    
    cur.close()
    conn.close()
    response = jsonify(retorno);
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response