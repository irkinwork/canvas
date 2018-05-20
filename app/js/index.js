let canvas = document.querySelector(".editor"),
    ctx = canvas.getContext("2d"),
    input = document.querySelector('.editor__input'),
    btn = document.querySelector('.editor__btn'),
    check = document.querySelector('.editor__check'),
    jscolor = document.querySelector('.jscolor'),
    controls = document.querySelector('.editor__controls'),
    w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight,

    amount = input.value;
    click = 0,
    tick = 0,
    dots = [],
    lines = [],
    colors = [];

// draw dots and lines
    let draw = (amount) =>{
        dots.forEach((dot, i)=>{
            ctx.beginPath();
            if ( (( dot.picker ) && (i<=amount) ) || ( ( dot.picker ) && (i>=amount) ) ) {
                ctx.fillStyle = dot.color;
            } else if (!dot.picker && (i<amount)){
                ctx.fillStyle = dots[0].color
            } else if (!dot.picker && (i>=amount)){
                ctx.fillStyle = dots[i-1].color
            }    
            ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            if (i>0 && (i<amount)) {
                ctx.beginPath();
                ctx.lineWidth = dot.width;
                if ( dot.picker ) {
                    ctx.strokeStyle = dot.color
                } else {
                    ctx.strokeStyle = dots[0].color
                } 
                ctx.moveTo(dots[i-1].x, dots[i-1].y);
                ctx.lineTo(dot.x, dot.y);
                ctx.stroke();
                ctx.closePath();        
            }
            if (i>=amount){
                ctx.beginPath();
                ctx.lineWidth = dot.width;
                if ( dot.picker ) {
                    ctx.strokeStyle = dot.color
                } else {
                    ctx.strokeStyle = dots[i-1].color
                } 
    
            for (let j=1; j<=amount; j++) {
                ctx.moveTo(dots[i-j].x, dots[i-j].y);
                ctx.lineTo(dot.x, dot.y);
            }
                ctx.stroke();
                ctx.closePath();        

            }
            
        })
    }
// end of drawning dots and lines
// change x,y of dots to animate lines and dots
function drawLine(dot){
    if (click > 0) {
    TweenLite.fromTo(dot, 1, {
        x: dots[click-1].x,
        y: dots[click-1].y
    }, {
        x: dots[click].x,
        y: dots[click].y
    });
    }
}
// end of drawLine

// form an array of dots and execute changing functions
canvas.onclick = ((e) => {
    dots.push({x: e.pageX, y: e.pageY-controls.clientHeight, radius: 5, minRadius: 3, maxRadius: 10, color: check.checked ? `#${jscolor.value}` : getRandomColor(), picker: check.checked ? true: false, width: 5});
    amount = input.value;
    jscolor.value=='FFFFFF' ? jscolor.value='000000' : null;
    check.checked ? colors.push(`#${jscolor.value}`)  : colors.push(getRandomColor());
    dots.forEach(changeRadius)
    dots.forEach(changeWidth)
    drawLine(dots[dots.length-1])
    click++;
});
// end of onclick event

// render function. clear the Rect and draw everything
function render(){
    ctx.clearRect(0,0,w,h);
    dots.length>0 ? (draw(amount)) : null;
    tick++
}
// end of render

// TweenLite.ticker to execute render function
TweenLite.ticker.addEventListener("tick", render);
//end of ticker

// get the value from input with number dots to connect
  input.addEventListener('input', (e)=>{
    input.value = e.target.value
})
// end of listener

// get the color from color-picker
jscolor.addEventListener('change', (e)=>{
    jscolor.value = e.target.value;
})
//end of listener

//button to clear the rect and all of arrays and clicks
btn.addEventListener('click', ()=>{
    ctx.clearRect(0,0,w,h);
    click = 0;
    colors = [];
    dots = [];
})
//end of listener

//reset the width and the height on resize
window.addEventListener("resize", ()=> {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});
// end of listener



//get random number
function random(min, max) {
    if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.random() * (max - min);
}
// end of random
// getting the random color
let getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
    }
return color;
}
// end of getting the random color
// change radius and color
function changeRadius(dot) {
    for (let i =0; i<dot.maxRadius; i++){
    TweenLite.to(dot, random(2.5, 3.5), {
        radius: i,
        ease:  Elastic.easeOut.config(2, 0.3),
    });
    TweenLite.to(dot, random(2.5, 3.5), {
        color: dot.picker ? dot.color : getRandomColor(),
        ease:  Power0.easeNone,
        onComplete: changeRadius,
        onCompleteParams: [dot]
    });
    }
}
// end of changing radius and color
// change width of the line
function changeWidth(dot) {
    for (let i=3; i<10; i++){
    TweenLite.to(dot, random(2.5, 3.5), {
        width: i,
        ease:  Elastic.easeOut.config(2, 0.3),
        ease:  Power0.easeNone,
        onComplete: changeWidth,
        onCompleteParams: [dot]
    });
    }
}
// end of changing width of the line