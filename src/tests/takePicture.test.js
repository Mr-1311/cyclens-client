if (this.camera) {
    var counter = 0;
    var avg = 0;
    while (counter < 1000) {
        var start = new Date().getTime();
        console.log('basladik',start);

        this.camera.takePictureAsync().then(data => {
            console.log('data: ', data);
        });

        var end = new Date().getTime();
        console.log('bitti',end);
        console.log('total',end - start);
        var time = end - start;
        avg += time;
        counter++;
    }
    //alert('Execution time: ' + time);
    alert('Execution time: ' , avg/1000);
    console.log('Execution time: ' , avg/1000);

 }
