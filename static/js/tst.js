
    var mqtt;
    //Version 3.1 = 3 , 3.11 = 4
    var version = 3
    
    var reconnectTimeout = 2000;

    var timer;


  
    

    //clearTimeout(timer);

    function MQTTconnect() {
        mqtt = new Paho.MQTT.Client(
                        host,
                        port,
                        "web_" + parseInt(Math.random() * 100,
                        10));
        var options = {
            timeout: 30,
            mqttVersion : version,
            useSSL: useTLS,
            cleanSession: cleansession,
            onSuccess: onConnect,
            //Version 3.1 = 3 , 3.11 = 4
            onFailure: function (message) {
                $('#estado').text("Conexion fallada: " + message.errorMessage + "Retry");
                setTimeout(MQTTconnect, reconnectTimeout);
            }


        };

        mqtt.onConnectionLost = onConnectionLost;
        mqtt.onMessageArrived = onMessageArrived;

        if (username != null) {
            options.userName = username;
            options.password = password;
        }
        console.log("Host="+ host + ", port=" + port + " TLS = " + useTLS + " username=" + username + " password=" + password);
        mqtt.connect(options);
    }

    function onConnect() {
        $("#estado").text('CONECTADO: [' + host + "]");
        mqtt.subscribe(topicRespuesta, {qos: 1});
        console.log('MQTT Connectado: ' + host + ':' + port)
        enabledCommand();
    }

    function onConnectionLost(response) {
        setTimeout(MQTTconnect, reconnectTimeout);  
        $("#estado").text('CONEXION PERDIDA, reconectando');
        disabledCommand();
    };

    function enabledCommand(){
        $("#enviarcomando").attr("disabled", false);
        $("#comando").attr("disabled", false);
    };

    function disabledCommand(){
        $("#enviarcomando").attr("disabled", true);
        $("#comando").attr("disabled", true);
    };

    function addLog(mensaje){
        $('.console-out').append(mensaje);
        var h = parseInt($('#log')[0].scrollHeight);
        $('#log').scrollTop(h);

    };


    function onMessageArrived(message) {

        var idTst = $("#idTst").val().toUpperCase();
        var topicRespuesta = message.destinationName;
        var payload = message.payloadString;
        mensaje = "Resp:>" + topicRespuesta + ' Valor: ' + payload + '\n';

        if (idTst == "") 
            addLog(mensaje);
        else{
            var res = topicRespuesta.split("/");
            if (res[1] == idTst)
                addLog(mensaje);
        }
        stopTimer();
    };

    function messageSend(comando, idTst){
        message = new Paho.MQTT.Message(comando);
        if (idTst == 'todos')
            message.destinationName = topicEnvioComando;
        else
            message.destinationName = topicEnvioComando+idTst;
        mqtt.send(message);
        console.log(comando);
        if (comando != 'REFRESH' && comando != 'CLEAN' && comando != 'RESET' ){
            mensaje = "Env:>" + comando + '\n';
            addLog(mensaje);
            console.log(comando);
            startTimer();
        }
    };



    function cursorAnimation() {
    $('#cursor').animate({
            opacity: 0
        }, 'fast', 'swing').animate({
            opacity: 1
        }, 'fast', 'swing');
    };


    function startTimer(){
        timer = setTimeout(function(){
            addLog("Resp:> Tiempo excedido de respuesta. \n");
            stopTimer();
        }, 10000);

    };

    function stopTimer(){
        clearTimeout(timer);
    };


    function info(mensaje){
        $("#mensaje").append($("<div class='mensaje-info'> <h5>"+ mensaje +"</h5></div> "));
        $("#mensaje").animate({ 'height':'toggle','opacity':'toggle'});
        window.setTimeout( function(){
                    $(".mensaje-info").remove();
                    $("#mensaje").slideUp();
        }, 3500);
    };



    //MEJORAR funciones al vuelo
    function commandRefresh(idTst){
        comando = "REFRESH";
        messageSend(comando,idTst);      
        info("Comando REFRESH enviado a TST "+idTst );
    };

    function commandClean(idTst){
        comando = "CLEAN";
        messageSend(comando,idTst);
        info("Comando CLEAN enviado a TST "+idTst );
    };

    function commandReset(idTst){
        comando = "RESET";
        messageSend(comando,idTst);
        info("Comando RESET enviado a TST "+idTst );
    };
    //FIN FUNCIONES

    function verifyAndSend(){
        if ( $.trim($("#comando").val()) != '' &&  $.trim($("#idTst").val()) != '' ) 
            {
                var comando = $("#comando").val().toUpperCase(); 
                var idTst = $("#idTst").val().toUpperCase();
                messageSend(comando,idTst);
            }
            else if ($.trim($("#comando").val()) != '' && $.trim($("#idTst").val()) == '') {
                    var comando = $("#comando").val().toUpperCase(); 
                    var idTst = 'todos';
                    messageSend(comando,idTst);
            }
            else 
            {
                mensaje = "ERROR comando invalido \n";
                addLog(mensaje);
            }         
    };


    $.fn.pressEnter = function(fn) {  
        return this.each(function() {  
        $(this).bind('enterPress', fn);
        $(this).keyup(function(e){
            if(e.keyCode == 13)
                {
                  $(this).trigger("enterPress");
                }
            })
        });  
    }; 



   

    $(document).ready(function() {
        $('#mensaje').hide();
        setInterval ('cursorAnimation()', 900);
        MQTTconnect();
         
        $("#limpiar").click(function(){
            $('.console-out').empty();

        });

        $("#comando").pressEnter(function(){  
                verifyAndSend();
                $("#comando").val('');
        });


        $("#enviarcomando").click(function(){
                verifyAndSend();
        });


    });

    
    
       
       

        
       

    
  
        

