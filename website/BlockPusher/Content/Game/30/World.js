World.createBlockType("wall", "wall.png");
World.createBlockType("wall_r", "wall_r.png");
World.createBlockType("wall_b", "wall_b.png");

Render.blockScale = 30;

World.r_score = 0;

World.update = function () {
    Render.setCameraPos(8,8);
}

World.drawBackground = function () {
    Render.clear("black");
}

World.drawForeground = function () {
    let score = 0;
    Render.drawText("Score: " + this.r_score, 10, 50, "red", "30px sans-serif");
}
