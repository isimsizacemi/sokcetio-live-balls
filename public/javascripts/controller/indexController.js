
app.controller('indexController' , ["$scope" , 'indexFactory', ($scope,indexFactory) =>{
    
    $scope.init = () => {
        const username = prompt('Please Enter Username');

        if(username)
            initSocket(username);
        else 
            return false;

    };
    
    function initSocket(username){
        const connectionOptions = {
            reconnectionAttemtps:3,
            reconnectionDelay:600
        };
    
        indexFactory.connectSocket('http://localhost:3000', connectionOptions)
        .then((socket)=>{
            socket.emit('newUser', {username});
        }).catch((err) => {
            console.log(err);
        });
    }
} ]);