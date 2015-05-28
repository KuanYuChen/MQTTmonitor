respaldo
var table = $('#example').DataTable();
 
table.rows().every( function () {
    var d = this.data();
 
    d.counter++; // update data source for the row
 
    this.invalidate(); // invalidate the data DataTables has cached for this row
} );
 
// Draw once all updates are done
table.draw();

var table = $('#example').DataTable();
var data = table
    .cells( ".info" )
    .data();
 console.log( data );


 $('#tblUsuario tr').each(function () {

var pk = $(this).find("td").eq(0).html();
var nombre = $(this).find("td").eq(1).html();
var apellidos = $(this).find("td").eq(3).html();

});

     $('#equipos').DataTable( {
            "language" : {
              "search": "Busqueda:",
              "paginate": {
                  "first": "Primer",
                  "previous": "Previo",
                  "next":"Siguiente",
                  "last":"Ultimo"
              }
          },          
            "ajax": "../data/datos.json"
          });



     $('#equipos').DataTable( {

  <script>
    $(document).ready(function() {
         var table = $('#equipos').DataTable();
         table
             .column(3)
             .data()
             .each( function ( value, index ) {
                  console.log( 'Data in index: '+index+' is: '+value );
          } );
  


    });

 
      
"dataSrc": function ( d ) {
                      $.each(d, function( index, value ) {
                             
                                          console.log( value );
                          
                      });
                 }


    </script>




     $.ajax({ url: "conf", cache: false, success: function(data){
            $("#emonhubconf").val(data);
        }});
        
        $("#saveconf").click(function(){
            $.ajax({ type:'POST', url: "conf", contentType: "text/plain", data: $("#emonhubconf").val() });
        });
        
        $("#start-emonhub").click(function(){
            $.ajax({ type:'POST', url: "emonhub/start"});
        });
        
        $("#stop-emonhub").click(function(){
            $.ajax({ type:'POST', url: "emonhub/start"});
        });
        
        $("#restart-emonhub").click(function(){
            $.ajax({ type:'POST', url: "emonhub/restart"});
        });
        
        $(window).on('hashchange', function() {
            view = (window.location.hash).substring(1);
            show_view();
        });



         $(document).ready(function() {
    var table = $('#equipos').DataTable( {
            "iDisplayLength": 30,
            "language" : {
              "search": "Busqueda:",
              "paginate": {
                  "first": "Primer",
                  "previous": "Previo",
                  "next":"Siguiente",
                  "last":"Ultimo"
              }
          },          
            "ajax": "../data/datos.json",
                "columns": [
                      { "data": "id" },
                      { "data": "nombre" },
                      { "data": "serie" },
                      { "data": "conexion" },
                      { "data": "actualizacion" },
                      { "data": "horaserver" },
                      { "data": "tiempoPasado" }
                  ]
    });
    setInterval( function () { 
        table.ajax.reload(null, false); 
    }, 10000 );
});


         control.config['MYSQL_DATABASE_USER'] = 'wtec_dev'
        control.config['MYSQL_DATABASE_PASSWORD'] = 'wtec123'
        control.config['MYSQL_DATABASE_DB'] = 'wtec_webapp'
        control.config['MYSQL_DATABASE_HOST'] = 'app.wtec.cl'
