from flask import Flask, render_template, session, request, redirect, Response
from flask import jsonify


from db import Accionwtec
from datetime import timedelta, datetime
import time


app = Flask(__name__)
app.debug = True

#_______TIEMPOS DE MINUTOS DE DESCONEXION________#
NORMAL = 5
ERROR = 10
#_______FIN TIEMPOS___________________#


#----------------RUTAS---------------#
@app.route('/')
@app.route('/monitor/')
def  equipos():
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
			 'conexion' : str(equipo[3]),
			 'actualizacion' : str(equipo[4]),
			 'tiempoPasado' :  tiempoPasado( equipo[4], equipo[1]),
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
	