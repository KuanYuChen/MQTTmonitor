
    var mqtt;
    var reconnectTimeout = 2000;

    function MQTTconnect() {
        mqtt = new Paho.MQTT.Client(
                        host,
                        port,
                        "web_" + parseInt(Math.random() * 100,
                        10));
        var options = {
            timeout: 3,
            useSSL: useTLS,
            cleanSession: cleansession,
            onSuccess: onConnect,
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
        mqtt.subscribe(topic, {qos: 0});
        console.log('MQTT Connectado: ' + host + ':' + port)
    }

    function onConnectionLost(response) {
        setTimeout(MQTTconnect, reconnectTimeout);  
        $("#estado").text('CONEXION PERDIDA, reconectando');
        

    };

    function onMessageArrived(message) {

        var topic = message.destinationName;
        var payload = message.payloadString;

        $('.console-out').append(" " +topic + ' Valor:' + payload +'\n');
        var h = parseInt($('#log')[0].scrollHeight);
        $('#log').scrollTop(h);
    };

    function messageSend(comando){
        message = new Paho.MQTT.Message(comando);
        message.destinationName = "CONF/12";
        mqtt.send(message);
        console.log(comando)
    };


    $(document).ready(function() {
        MQTTconnect();
         $("#enviarcomando").click(function(){
            var comando = $("#comando").val() 
            messageSend(comando);
        });
    });

    
    
       
       

        
       

    
  
        

