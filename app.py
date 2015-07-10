import os
import paho.mqtt.publish as publish
import time

from flask import Flask, g, render_template, session, request, redirect, Response, url_for
from flask import jsonify
from functools import wraps





from db import Accionwtec
from datetime import timedelta, datetime



app = Flask(__name__)
app.secret_key = os.urandom(24)
app.debug = True

#_______TIEMPOS DE MINUTOS DE DESCONEXION________#
NORMAL = 6 
ERROR = 12
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
	if 'usuario' in session:
		if session['usuario'] != None:
			return redirect(url_for("equipos"))
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
		acciones = "sin MQTT"
			
		if equipo[7] == 1:
			acciones = str(menu(encode(equipo[1]), equipo[0]))
		
		d = {'id' : equipo[0],
			 'nombre' : str(encode(equipo[1])+' ('+str(equipo[0])+')'),
			 'acciones' : acciones,
			 'serie' : equipo[2],
			 'dbm' : equipo[3],
			 'version' : equipo[4],
			 'conexion' : str(equipo[5]),
			 'actualizacion' : str(equipo[6]),
			 'tiempoPasado' :  tiempoPasado( equipo[6], equipo[1]),
			 'horaserver' : str(time.strftime("%Y:%m:%d %H:%M:%S")) }
		json_resultado.append(d)
	
	return jsonify(data=json_resultado)

def menu(equipo, id):
	opciones = 	"<div class='btn-group btn-group-xs' role='group' >" \
				"<button class='btn btn-info btn-xs'><a href='../consola/{0}'> <i class='glyphicon glyphicon-wrench'></i></a></button>" \
				"<button class='btn btn-info btn-xs'><a href='#' onClick='commandRefresh({0});'>  <i class='glyphicon glyphicon-refresh'></i> </a></button>" \
				"<button class='btn btn-info btn-xs'><a href='#' onClick='commandClean({0});'>  <i class='glyphicon glyphicon-floppy-remove'></i> </a></button>" \
				"<button class='btn btn-success btn-xs'> <a href='#' onClick='commandReset({0});'>" \
				" <i class='glyphicon glyphicon-off'></i> </a> </button> </div>".format(id)
	return opciones



@app.route('/logs/<int:idTst>')
@app.route('/logs/')
def logs(idTst = None):
	if idTst is None:
		listado_registro = Accionwtec.AccionWtec().registroConexiones()
	else:
		Accionwtec.AccionWtec().eliminarRegistroLog(idTst)
		return redirect(url_for("logs"))

	return render_template ('registro.html', equipos = listado_registro)

#--------------FIN RUTAS------------#


#--------------FUNCIONES------------#
#Funciones MQTT
def mqttEnvio(topic = None, mensaje = None ,  idTst = None):
	topic = topic  + idTst
	publish.single(topic, mensaje,qos=1,hostname="dev.wtec.cl")
#Fin funciones MQTT


def dias_horas_minutos(td):
	return td.days, td.seconds//3600, (td.seconds//60)%60



def tiempoPasado(conexion, equipo):
	hoy = datetime.now()
	dias, horas, minutos = dias_horas_minutos (hoy - conexion)
	if dias > 0:
		tiempo = "<span class='label label-danger'>{0} [d], {1} [h], {2} [m]</span>".format(dias, horas, minutos)
	elif horas > 0:
		tiempo = "<span class='label label-danger'>{0} [h], {1} [m]</span>".format(horas ,minutos)
	else:
		if minutos > NORMAL  and minutos < ERROR:
			tiempo = "<span class='label label-warning'>{0} Minutos</span>".format(str(minutos))
		elif minutos >= ERROR:
			tiempo = "<span class='label label-danger'>{0} Minutos</span>".format(str(minutos))
		elif minutos <= NORMAL: 
			tiempo = "<span class='label label-success'>{0} Minutos</span>".format(str(minutos))
	return tiempo









def encode(text):
	return text.encode('utf-8')
#--------------FIN FUNCIONES--------#	

def main():
	try:
		app.run(host="0.0.0.0")
	except Exception, e:
		print "Error:{0} ".format(str(e))

if __name__ == '__main__':main()
	
