from db.conec import DBconec


class AccionWtec(DBconec.DBcon):
	
	def __init__(self):
		pass


	def listarEquipos(self, estado):
		con = self.conexion().connect().cursor()
		SQL = "select um.id as id, um.nombre as nombre, um.serie as serie, r.dbm as dbm, r.version, "\
			"r.conexion as conexion, r.actualizacion as actualizacion, mqtt from um inner join registro r on " \
			"um.serie = r.serie inner join proyecto p on um.id_proyecto = p.id where operativo = {0} " \
			"order by um.nombre asc".format(str(estado))
		con.execute(SQL)
		equipos = con.fetchall()
		return equipos 

	def listarEquipo(self, idTst):
		con = self.conexion().connect().cursor()
		sql = " select um.id as id, um.nombre as nombre, um.serie as serie, " \
			"r.conexion as conexion, r.actualizacion as actualizacion from registro r, " \
			"um where um.serie = r.serie and  um.id = {0} order by um.nombre asc limit 1".format(str(idTst))
		con.execute(sql)
		equipo = con.fetchall()
		return equipo

	def usuarios(self, email, password):
		con = self.conexion().connect().cursor()
		sql = "	select nombre from usuario where tipo = 2 and estado = 1 and email='{0}' and password=md5('{1}') ".format(email, password)
		con.execute(sql)
		usuario = con.fetchall()
		return usuario

	def registroConexiones(self):
		con = self.conexion().connect().cursor()
		sql = " select id, serie, fecha from registro_logs order by fecha asc"
		con.execute(sql)
		registro = con.fetchall()
		return registro

	def eliminarRegistroLog(self, idTst):
		con = self.conexion().connect().cursor()
		sql = " delete from registro_logs where id=%d ; commit;" % (idTst)
		con.execute(sql)
		

		
		
