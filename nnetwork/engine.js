(() => {
    // Create the XHR object to do GET to /data resource

    var group, camera, scene, renderer;
    
    $.getScript("/t", init);

    const c = document.createElement("canvas");

    function init() {        
        scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(window.innerWidth, window.innerHeight);
        
		document.getElementsByClassName("background-container")[0].appendChild(renderer.domElement);
    }

})();