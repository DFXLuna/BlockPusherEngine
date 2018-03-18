import { Render } from "./renderer";

const CANVAS_NAME = "game-canvas";

// COMPONENT SETUP
Render.setup(CANVAS_NAME);

// USER-DEFINABLE TICK FUNCTION [CODE EVAL TEST]
let tickFunction : Function = () => {}

// GAME 'LOOP'
function doFrame( time = 0 ) {
    window.requestAnimationFrame(doFrame);

    // DO STUFF HERE
    tickFunction(Render);
}
doFrame();

// CALLS FROM THE PARENT CONTEXT
function onMessage(event: MessageEvent) {
    if (event.origin != location.origin)
        return;

    let msg = event.data;

    if (msg.type == "runCode") {
        tickFunction = new Function("Render",msg.code);
    }
}

addEventListener("message", onMessage, false);

/*export class Engine{

    //private loopFunctions: { (): void }[] = [];
    private boundGameLoop: ( timestamp: number ) => void;
    //private renderer: Renderer;
    private contentPath: string;

    constructor( canvasName: string ){
        Render.setup(canvasName);
        this.boundGameLoop = this.gameLoop.bind( this );
    }
    /*
    public registerFunction( func: () => void ): void {
        this.loopFunctions.push( func );
    }
    *
    public gameLoop( timestamp: number = 0 ): void {
        window.requestAnimationFrame( this.boundGameLoop );

        //World.update();
        //World.draw();
    }
    /*
    public registerImage( filename: string, friendlyName: string ): void {
        this.renderer.registerImage( filename ,friendlyName );
    }
    *
    public setContentPath( path: string ) {
        this.contentPath = path;
    }
    /*
    public requestDraw( friendlyName: string ){
        this.renderer.addToQueue( friendlyName );
    }
    *
    private draw() : void{
        
    }
    
}*/

