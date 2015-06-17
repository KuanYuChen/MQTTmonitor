import os

from flask import Flask, render_template, session, request, redirect, Response, url_for
from flask import jsonify
from functools import wraps





from db import Accionwtec
from datetime import timedelta, datetime
import time


app = Flask(__name__)
app.secret_key = os.urandom(24)
app.debug = True

#_______TIEMPOS DE MINUTOS DE DESCONEXION________#
NORMAL = 5
ERROR = 10
#_______FIN TIEMPOS___________________#




#-------Autentificacion-----#


def requires_auth(f):
	@wraps(f)
	def decorated(*args, **kwargs):
		if 'usuario' in session:
			if session['usuario'] != None:
				return f(*args, **kwargs)
		return redirect(url_for("login"))
	return decorated

#------Fin autentificacion -----------#


#----------------RUTAS---------------#

@app.route('/')
def login():
	return render_template('login.html')

@app.route('/login', methods = ['POST'])
def verificar():
	email=str(request.form.get('usuario'))
	password=str(request.form.get('password'))
	usuario = Accionwtec.AccionWtec().usuarios(email, password)
	if len(usuario)==1:
		session['usuario'] = usuario[0][0]
		return redirect(url_for("equipos"))
	else:
		return redirect(url_for("login"))

@app.route('/logout')
def logout():
	session['usuario'] = None
	return redirect(url_for("login"))


@app.route('/monitor/')
@requires_auth
def equipos():
	return render_template ('tables.html')


@app.route('/comando',methods = ['GET','POST'])
def conf():
	if request.method == 'POST':
			comando = request.data.split(",")
			peticion = comando[0]
			idCliente = comando[1]
			print peticion, idCliente
			client.publish("CONF/"+idCliente, peticion)
			return "ok"
	else:
		return Response(content, mimetype='text/plain')


@app.route('/consola/<int:idTst>')
@app.route('/consola/')
@requires_auth
def consola(idTst = None):
	if idTst != None:
		Equipo = Accionwtec.AccionWtec().listarEquipo(idTst)
	else:
		Equipo = None
	return render_template ('forms.html', tst = Equipo )


@app.route('/data/datos.json')
def  jsonEquipos():
	json_resultado = []
	listado_equipos = Accionwtec.AccionWtec().listarEquipos()
	for equipo in listado_equipos:
		d = {'id' : equipo[0],
			 'nombre' : "<a href='../consola/{0}'>{1}</href>".format(str(equipo[0]), str(encode(equipo[1]))),
			 'serie' : equipo[2],
			 'dbm' : equipo[3],
			 'version' : equipo[4],
			 'conexion' : str(equipo[5]),
			 'actualizacion' : str(equipo[6]),
			 'tiempoPasado' :  tiempoPasado( equipo[6], equipo[1]),
			 'horaserver' : str(time.strftime("%Y:%m:%d %H:%M:%S")) }
		json_resultado.append(d)
	
	return jsonify(data=json_resultado)

#--------------FIN RUTAS------------#


#--------------FUNCIONES------------#
def tiempoPasado(conexion, equipo):
	hoy = datetime.now()
	
	minutos = ((hoy - conexion).seconds)//60
	if minutos > NORMAL  and minutos < ERROR:
		minutos = "<span class='label label-warning'>{0} Minutos</span>".format(str(minutos))
	elif minutos >= ERROR:
		minutos = "<span class='label label-danger'>{0} Minutos</span>".format(str(minutos))
	elif minutos <= NORMAL: 
		minutos = "<span class='label label-success'>{0} Minutos</span>".format(str(minutos))
	return minutos

def encode(text):
	return text.encode('utf-8')
#--------------FIN FUNCIONES--------#	

def main():
	try:
		app.run(host="0.0.0.0")
	except Exception, e:
		print "Error:{0} ".format(str(e))

if __name__ == '__main__':main()
	