app.controller('indexController', ["$scope", 'indexFactory', ($scope, indexFactory) => {
    $scope.messages = [ ]; // $scope.messages'yı bir dizi olarak başlat
    $scope.players = { }; 


    $scope.init = () => {
        const username = prompt('Please Enter Username');

        if (username)
            initSocket(username);
        else
            return false;
    };

    function initSocket(username) {
        const connectionOptions = {
            reconnectionAttemtps: 3,
            reconnectionDelay: 600
        };

        indexFactory.connectSocket('http://localhost:3000', connectionOptions)
        .then((socket) => {
            socket.emit('newUser', { username });

            socket.on('newUser', (data) => {
                const messageData = {
                    type: {
                        code:0, // server or diis connect olayı 
                        message:1
                    }, // info
                    username: data.username
                };
                $scope.messages.push(messageData);
                $scope.player[data.id] = data;
                $scope.$apply();
            });

            socket.on('initPlayers', (players) =>{
                $scope.players = players;
                $scope.$apply();
                console.log($scope.players);


            });

            socket.on('disUser', data => {
                const messageData = {
                    type:{
                        code:0,
                        message:0
                    },
                    username:data.username
                };
                $scope.messages.push(messageData);
                delete  $scope.player[data.id];
                $scope.$apply();
            }) 
            
            let animate = false;

           
            $scope.onClickPlayer = ($event) => {
                console.log($event.offsetX, $event.offsetY);
                if(!animate){
                    animate = true;
                    $('#' + socket.id).animate({'left' : $event.offsetX , 'top' : $event.offsetY});
                    animate = false;
                }
                
            }            
        })
        .catch((err) => {
            console.log(err);
        });

    }
}]);
