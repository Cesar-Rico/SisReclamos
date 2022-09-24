from flask import Flask
import psycopg2

app = Flask(__name__)

def get_db_connection():
    conn = psycopg2.connect(host="ec2-52-200-5-135.compute-1.amazonaws.com",
                            database="dfic8u828ugjrt",
                            user="kjzpxxhgnwecuo",
                            password="7dc7b77491e18b06a45e965ee4028e70cab84a216758bbe13cb0a87715175fae")
    return conn


@app.route("/reclamosCanalAtencion", methods = ["GET"])
def getReclamosCanalAtencion():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM RECLAMOCANALATENCION')
    reclamos = cur.fetchall()
    cur.close()
    conn.close()
    print (reclamos)