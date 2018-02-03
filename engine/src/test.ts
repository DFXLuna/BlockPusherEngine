import { Engine } from "./engine";


window.onload = () => {
    // The engine will grab the canvas from the html by name and create its
    // context
    let a: Engine = new Engine( "cnvs" );

    // // Register a test function that will be called once every game loop
    // a.registerFunction( () => {
    //     console.log("Function1");
    // }
    // );

    // // Functions are called in the order they are registered
    // a.registerFunction( () => {
    //     console.log("Function2");
    // }
    // );
    let boundRect = a.drawRect.bind( a, 0, 0, 100, 100 );
    a.registerFunction( boundRect );
    // Start the game loop
    a.gameLoop();
}

