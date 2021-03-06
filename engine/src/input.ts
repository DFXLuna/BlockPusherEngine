import { copymap } from "./copymap";
import { Render } from "./render";

export namespace Input {
    let currPressed: Map< string, boolean > = new Map();
    let prevPressed: Map< string, boolean > = new Map();

    let cursorPos = {x: 0, y: 0};
    let prevMouseButtons = 0;
    let mouseButtons = 0;

    export function update(): void {
        prevMouseButtons = mouseButtons;
        copymap( currPressed, prevPressed );
    }
    
    export function isKeyDown( keyValue: string ): boolean {
        keyValue = keyValue.toLowerCase();
        return currPressed.has( keyValue );
    }
    
    export function wasKeyPressed( keyValue: string ): boolean {
        keyValue = keyValue.toLowerCase();
        return currPressed.has( keyValue )
            && !prevPressed.has( keyValue );
    }

    export function wasKeyReleased( keyValue: string ): boolean {
        keyValue = keyValue.toLowerCase();
        return prevPressed.has( keyValue )
            && !currPressed.has( keyValue );
    }

    export function getCursorPos() {
        return cursorPos;
    }

    export function isMouseButtonDown(button: number) {
        return ((mouseButtons>>(button-1))&1) == 1;
    }

    export function wasMouseButtonPressed(button: number) {
        return ((mouseButtons>>(button-1))&1) == 1 && ((prevMouseButtons>>(button-1))&1) == 0;
    }
    
    function onKeyDown( ke: KeyboardEvent ): void {
        currPressed.set( ke.key.toLowerCase(), true );
    }
    
    function onKeyUp( ke: KeyboardEvent ): void {
        currPressed.delete( ke.key.toLowerCase() );
    }

    function onMouseMove( me: MouseEvent ): void {
        let canvas = Render.context.canvas;
        let camPos = Render.getCameraPos();
        cursorPos.x = (me.clientX - canvas.width/2) / Render.blockScale + camPos.x;
        cursorPos.y = (me.clientY - canvas.height/2) / Render.blockScale + camPos.y;
    }

    function onMouseButton( me: MouseEvent ): void {
        mouseButtons = me.buttons;
    }

    // Add event listeners
    window.addEventListener("keydown", ( event ) => { onKeyDown( event ); }, false );
    window.addEventListener("keyup", ( event ) => { onKeyUp( event ); }, false );

    window.addEventListener("mousemove", ( event ) => { onMouseMove(event); }, false );
    window.addEventListener("mousedown", ( event ) => { onMouseButton(event); }, false );
    window.addEventListener("mouseup", ( event ) => { onMouseButton(event); }, false );

    window.addEventListener("contextmenu", ( event ) => { event.preventDefault(); }, false );
}