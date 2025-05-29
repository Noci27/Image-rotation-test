var img = document.getElementById("img");
var imgCont = document.getElementById("container");
const check = document.getElementById("check");
const filePick = document.getElementById("filePick");
filePick.addEventListener("change", displayImg);
const fileChange = document.getElementById("fileSwitch");
fileChange.addEventListener("change", displayImg);
const audio = document.querySelector("audio");
var imgConstX = 0;  //coordinates of tl corner img
var imgConstY = 0;
var imgHeight = 0;
var imgWidth = 0;
var intrvl;
var turn = 0;
var x = 0;
var y = 0;
var z = 0;

check.addEventListener("change", changeMode);

function changeMode(){
    if(check.checked){
        img.removeEventListener("mouseenter", stupidUselessFuntionSoEventListernerGetsProperlyRemovedStupidFuckingThing);
        imgCont.removeEventListener("mousemove", pinch);
        imgCont.removeEventListener("mouseleave", rstPos);
        randVec();  //reroll vector
        imgCont.addEventListener("click", spin);
        intrvl = setInterval(rotate, 50/3); // 50/3 == 60fps
        audio.play();
        document.title = "LOOK AT HIM GO HE GOT THE MOVES";
    }
    else{
        audio.pause();
        imgCont.removeEventListener("click", spin);
        clearInterval(intrvl);
        rstPos();
        turn = 0;   //reset rotation
        img.addEventListener("mouseenter", stupidUselessFuntionSoEventListernerGetsProperlyRemovedStupidFuckingThing);
        imgCont.addEventListener("mousemove", pinch);
        imgCont.addEventListener("mouseleave", rstPos);
        img.addEventListener("touchstart", pinch);
        document.title = "He's watching it carefully";
    }
}

function stupidUselessFuntionSoEventListernerGetsProperlyRemovedStupidFuckingThing(){
    img.style.transitionDuration = "100ms";
}

function displayImg(){
    let file = (fileChange.files.length == 0 ? filePick:fileChange).files[0]; //changes inputterrrrrrrrr
    let newImg = document.createElement("img");
    newImg.draggable = false;
    newImg.src = URL.createObjectURL(file);
    img = newImg;
    newImg.addEventListener("load", scaleImg); //wait until img is loaded before scaling
    imgCont.replaceChildren(newImg);
    filePick.parentElement.style.display = "none";
    fileChange.parentElement.style.display = "block";
    imgCont.style.display = "block";
    check.parentElement.style.display = "flex";
    check.checked = false;  //to prevent building up speed
    changeMode();
}

function scaleImg(){
    imgHeight = img.height;
    imgWidth = img.width;
    // console.info(imgHeight, imgWidth);
    let sWidth = window.innerWidth;
    let sHeight = window.innerHeight;
    let scalar = ((sWidth < sHeight) ? sWidth:sHeight) / Math.hypot(imgHeight, imgWidth) * 0.9; //always uses smaller side
    imgHeight *= scalar;
    imgWidth *= scalar;
    img.height = imgHeight; //aspect ratio is kept automatically
    imgCont.style.width = imgWidth + "px";  //scale container, has some slight issues????
    imgCont.style.height = imgHeight + "px";
    imgConstX = img.offsetLeft; //image is loaded correctly here
    imgConstY = img.offsetTop;
}

function randVec(){
    x = Math.random() * 2 - 1;   //random number between -1 and 1
    y = Math.random() * 2 - 1;
    z = Math.random() * 2 - 1;
}

function rotate(){
    turn += 0.01;
    img.style.transform = `rotate3d(${x}, ${y}, ${z}, ${turn}turn)`;
    // console.log(`X: ${x}  Y: ${y} Z: ${z} Turn: ${turn}`);
}

function spin(){
    let rand = Math.random() * 4 + 2;
    turn += rand;
    img.style.transitionDuration = `${500 * rand}ms`;
    img.style.transform = `rotate3d(${x}, ${y}, ${z}, ${turn}turn)`;
}

function pinch(event){
    let mouseX = event.pageX - imgConstX; //dist from origin (tl corner cont)
    let mouseY = event.pageY - imgConstY;
    let centerDist;
    let scaleFactor;
    let huh = 1;    //change if image is hochkant
    if(imgWidth > imgHeight){
        scaleFactor = imgWidth / imgHeight; //get square factor
        centerDist = Math.hypot((mouseX - imgWidth / 2), scaleFactor * (mouseY - imgHeight / 2)) / (imgWidth/ 2);   //~% of dist
    }
    else{
        scaleFactor = imgHeight / imgWidth;
        centerDist = Math.hypot(scaleFactor * (mouseX - imgWidth / 2), (mouseY - imgHeight / 2)) / (imgWidth/ 2); 
        huh = scaleFactor;
    }
    // console.log(mouseX, mouseY, centerDist, scaleFactor)
    img.style.transform = `rotate3d(${(mouseY - imgHeight / 2) * -1}, ${mouseX - imgWidth / 2}, 1, ${45 * centerDist / huh}deg)`; 
}

function rstPos(){
    if(turn > 1){
    turn -= Math.trunc(turn); //remove full turns
    img.style.transitionDuration = "0s"
    img.style.transform = `rotate3d(1, 1, 1, ${turn}turn)`;
    setTimeout(() => {  //for some reason only this works
        img.style.transitionDuration = "500ms";
        img.style.transform = `rotate3d(1, 0, 0, 0turn)`;},
    0);
    }
    else{
        img.style.transitionDuration = "500ms";
        img.style.transform = `rotate3d(1, 0, 0, 0turn)`;
    }
}