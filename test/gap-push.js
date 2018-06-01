var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        alert('Received Event: ' + id);
        var push = PushNotification.init({
            android: {
            },
            ios: {
                alert: "true",
                badge: true,
                sound: 'false'
            }
        });

        push.on('registration', function (data) {
            alert(data.registrationId);
            alert(data.registrationType);
           // document.getElementById("registration").appendChild(document.createTextNode(data.registrationId));
        });

        push.on('notification', function (data) {
            //var ul = document.getElementById("pushList");
            //var li = document.createElement("li");
           // li.appendChild(document.createTextNode(data.message));
            //ul.appendChild(li);
            alert(data.message);
            alert(data.title);
            /*console.log(data.count);
            console.log(data.sound);
            console.log(data.image);
            console.log(data.additionalData);*/
        });
    }
};

app.initialize();
