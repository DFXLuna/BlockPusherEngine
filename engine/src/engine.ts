import { AudioComponent as Audio } from "./audio";
import { GameObjectManager } from "./gameobject";
import { Collision } from "./collision"
import { Render } from "./render";
import { Input } from "./input";
import { Time } from "./time";
import { CodeManager } from "./codemanager";


const CANVAS_NAME = "game-canvas";

let isPlaying = false;
let savedState: any = null;

// COMPONENT SETUP
Render.setup(CANVAS_NAME);
CodeManager.setup();
Collision.setup();

// GAME 'LOOP'
function doFrame(time = 0) {
    let World = CodeManager.World;
    
    window.requestAnimationFrame(doFrame);

    Time.update();
    
    Collision.update();

    if (isPlaying) { 
        // Only call when game is running
        World.update();
        // This is maybe where this belongs
        GameObjectManager.updateGameObjects();
    } else {
        World.updateEdit();
    }


    // Draw stuff.
    let showGrid = !isPlaying;

    World.drawBackground();

    Render.enableCamera();
    World.render(showGrid);

    GameObjectManager.renderGameObjects();
    if (showGrid)
        GameObjectManager.drawAllAABB();

    Collision.debugDraw();
        
    Render.disableCamera();
    World.drawForeground();

    // Input must update here so between-frame inputs
    // can be collected.
    Input.update();
}
doFrame();

// Sends our object list to the editor.
// Call on any update to a file, or after a reload.
function updateEditorObjectList() {

    let list = {
        blocks: CodeManager.World.getBlockTypes(),
        objects: CodeManager.getClassList()
    };

    window.parent.postMessage({type: "setObjectList", list: list},"*");
}

// For clearing prototypes.
function clearObject(obj: object) {
    for (var k in obj) {
        if ((<any>obj).hasOwnProperty(k))
            delete (<any>obj)[k];
    }
}

// CALLS FROM THE PARENT CONTEXT
window.addEventListener("message", async function (event: MessageEvent) {
    if (event.origin != location.origin && event.source != window) {
        return;
    }

    let msg = event.data;

    if (msg.type == "setFile") {
        // Less trashy than the implementations in the engine.
        // TODO move this to some util library?
        function isImageFile(fileName: string) {
            return fileName.match(/\.(png|gif|jpe?g)$/i) !== null;
        }

        function isAudioFile(fileName: string) {
            return fileName.match(/\.(wav|mp3)$/i) !== null;
        }

        function isScriptFile(fileName: string) {
            return fileName.match(/\.(js)$/i) !== null;
        }

        if (msg.file=="level.json") {
            if (msg.url == null) {
                // The level was deleted.
                // We block doing this in the editor, so this shouldn't happen.
                return;
            }
            
            let res = await fetch(msg.url);
            let levelData = await res.text();

            savedState = JSON.parse(levelData);

            CodeManager.World.load(savedState);
        } else if (isScriptFile(msg.file)) {
            let code = null;
            
            if (msg.url != null) {
                let res = await fetch(msg.url);
                code = await res.text();
            }

            CodeManager.runScript(msg.file, code);
        } else if (isImageFile(msg.file)) {
            Render.registerImage(msg.file,msg.url);
        } else if (isAudioFile(msg.file)) {
            Audio.registerSound(msg.file, msg.url);
        } else {
            console.log("Unhandled file: ",msg.file);
        }

        updateEditorObjectList();
    } else if (msg.type == "setMode") {
        // save level if currently in edit mode
        if (!isPlaying) {
            savedState = CodeManager.World.save();
            //console.log(JSON.stringify(savedState));

            // Send saved level state to editor.
            window.parent.postMessage({type: "saveLevel", data: JSON.stringify(savedState)},"*");
        }

        // reload all classes from saved code
        CodeManager.setup();
        Time.setup();

        // reload saved level
        CodeManager.World.load(savedState);

        isPlaying = msg.play;
        
        Render.setAllowNormalCameraControl(isPlaying);
    } else if (msg.type == "selectObject") {
        CodeManager.World.setEditorPlacementObject(msg.obj_type, msg.name);
    } else if (msg.type == "requestLevel") {

        if (!isPlaying)
            savedState = CodeManager.World.save();

        window.parent.postMessage({type: "saveLevel", data: JSON.stringify(savedState)},"*");
        
    } else {
        console.log("Unhandled message: ",msg);
    }
});