from flask import Flask, render_template, session, request, redirect, Response
from flask import jsonify
import json 

from db import Accionwtec
from datetime import timedelta, datetime

import time

from threading import Thread

app = Flask(__name__)
app.debug = True





#----------------RUTAS---------------#
@app.route('/')
@app.route('/monitor/')
def  equipos():
	#listado_equipos = Accionwtec.AccionWtec().listarEquipos()
	#equipos = listado_equipos
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

@app.route('/consola/')
def consola():
	return render_template ('forms.html')

@app.route('/data/datos.json')
def  jsonEquipos():
	json_resultado = []
	listado_equipos = Accionwtec.AccionWtec().listarEquipos()
	for equipo in listado_equipos:
		d = { 'id' : str(equipo[0]),
			 'nombre' : "<a href='{0}'>{1}</href>".format(str(equipo[0]), str(equipo[1])),
			 'serie' : equipo[2],
			 'conexion' : str(equipo[3]),
			 'actualizacion' : str(equipo[4]),
			 'tiempoPasado' :  tiempoPasado( equipo[4], equipo[1]),
			 'horaserver' : str(time.strftime("%Y:%m:%d %H:%M:%S")) }
		json_resultado.append(d)
	
	return jsonify(data=json_resultado)

#--------------FIN RUTAS------------#

def tiempoPasado(conexion, equipo):
	hoy = datetime.now()
	minutos = ((hoy - conexion).seconds)/60
	if minutos > 5  and minutos < 20:
		minutos = "<h5><span class='label label-warning'>" + str(minutos)  + "Secondary text</small> Minutos</span></h5>"
	elif minutos >=20:
		minutos = "<h5><span class='label label-danger'>" + str(minutos)  + " Minutos</span></h5>"
	elif minutos <= 5: 
		minutos = "<h5><span class='label label-success'>" + str(minutos)  + " Minutos</span></h5>"
	return minutos

def decode(text):
	return text.encode('utf-8')
	



def main():
	try:
		
		app.run(host="0.0.0.0")

	except Exception, e:
		print "Error:{0} ".format(str(e))

if __name__ == '__main__':main()
	