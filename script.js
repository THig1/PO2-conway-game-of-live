var canvas = document.querySelector('.myCanvas');
var width = canvas.width = window.innerWidth / 2.5;
var height = canvas.height = window.innerHeight / 2.5;
var ctx = canvas.getContext('2d');

var rows = document.querySelector("#rows");
var collums = document.querySelector("#collums");
var fps = document.querySelector("#fps");
var button = document.querySelector("#run");
var reset = document.querySelector("#reset");
var scale = 0;

var sim1 = []
var sim2 = []

var old_time = 0;


rows.addEventListener("change", reset_screen);
collums.addEventListener("change", reset_screen);
button.addEventListener("click", update_Button);
reset.addEventListener("click", reset_sim);
window.addEventListener("resize", change_scale);

function update_Button() {
    if (button.value === "start simulatie") {
        button.value = "stop simulatie";
    } else {
        button.value = "start simulatie";
  }
}

function change_scale() {
    scale = (window.innerWidth / 2.5) / parseInt(collums.value)
    width = window.innerWidth / 2.5
    height = scale * parseInt(rows.value)
    canvas.width = width
    canvas.height = height
    draw_screen()
}

function reset_screen() {
    reset_sim()
    change_scale()
}

function reset_sim() {
    let tmp = []
    for (let i = 0; i < (parseInt(collums.value) * parseInt(rows.value)); i++) {
        tmp.push(Math.floor(Math.random()*2))
    }
    sim1 = tmp.slice();
    sim2 = tmp.slice();
}

function draw_screen() {
    ctx.fillStyle = 'rgb(58, 58, 58)';
    ctx.fillRect(0,0,width,height);
    ctx.fillStyle = 'rgb(255, 255, 255)'
    for (let y = 0; y < parseInt(rows.value); y++) {
        for (let x = 0; x < parseInt(collums.value); x++) {
            if (sim1[(y*parseInt(collums.value))+x] === 1) {
                ctx.fillRect(x*scale,y*scale,scale,scale);
            }
        }
    }
}

function check_around(x,y){
    let count = 0
    for (let y2 = -1; y2 < 2; y2++) {
        for (let x2 = -1; x2 < 2; x2++) {
            if (!(x2 === 0 && y2 === 0) && (x + x2) > -1 && (x + x2) < parseInt(collums.value) && (y + y2) > -1 && (y + y2) < parseInt(rows.value)) {
                count = sim1[((y2+y)*parseInt(collums.value))+(x2+x)] + count
            }
        }
    }
    return count;
}

function sim_step() {
    let tmp = 0
    for (let y = 0; y < parseInt(rows.value); y++) {
        for (let x = 0; x < parseInt(collums.value); x++) {
            tmp = check_around(x,y)
            if (tmp === undefined || tmp === NaN) {
                console.log(tmp)
            }
            if (tmp < 2) {
                sim2[(y*parseInt(collums.value))+x] = 0
            }
            if (tmp > 3) {
                sim2[(y*parseInt(collums.value))+x] = 0
            }
            if (tmp === 3) {
                sim2[(y*parseInt(collums.value))+x] = 1
            }
        }
    }
    sim1 = sim2.slice(); 
}

reset_screen();

old_time = Date.now()

function main_loop() {
    if (Date.now() - old_time > 1000 / fps.value) {
        old_time = Date.now()
        if (button.value === "stop simulatie") {
            sim_step();
            draw_screen();
        }
    }
    requestAnimationFrame(main_loop);
}

requestAnimationFrame(main_loop);