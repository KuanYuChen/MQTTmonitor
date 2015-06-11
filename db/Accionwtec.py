from db.conec import DBconec


class AccionWtec(DBconec.DBcon):
	
	def __init__(self):
		pass


	def listarEquipos(self):
		con = self.conexion().connect().cursor()
		con.execute(" select um.id as id, um.nombre as nombre, um.serie as serie, r.dbm as dbm, r.version,  " \
			"r.conexion as conexion, r.actualizacion as actualizacion from registro r, um " \
			"where um.serie = r.serie order by um.nombre asc ")
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

