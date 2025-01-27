// define elements
const body = document.querySelector("body"),
pixelCanvas = document.querySelector("#canvas"),
dimensionSlider = document.querySelector("#dimensionSlider"),
normalMode = document.querySelector("#normal"),
rainbowMode = document.querySelector("#rainbow"),
trickleMode = document.querySelector("#trickle"),
pen = document.querySelector("#pen"),
eraser = document.querySelector("#eraser"),
colorSelection = document.querySelector("#colorSelection"),
clearCanvas = document.querySelector("#clear"),
loadInstructions = document.querySelector("#loadInstructions"),
loadChangelog = document.querySelector("#loadChangelog"),
popupOverlay = document.querySelector("#popupOverlay"),
instructions = document.querySelector("#instructions"),
changelog = document.querySelector("#changelog"),
closeInstructions = document.querySelector(
    "#instructions .popupTitle button"),
closeChangelog = document.querySelector(
    "#changelog popuptitle button"
);

// define canvas
let canvasDimensions = dimensionSlider.value,
canvasDimensionDisplay = document.querySelector("#canvasDimensionDisplay"),
gridStatus = false;

canvasDimensionDisplay.textContent = `${canvasDimensions} × ${canvasDimensions}`;

// Math and manipulation

function subdivideCanvas(int) {
    return (1/int) * 100;
};

// color init
let colorPalette = [
    "230, 69, 110",
    "242, 174, 135",
    "250, 244, 152", 
    "219, 236, 176",
    "195, 230, 195",
    "159, 221, 224",
    "119, 211, 255",
    "144, 202, 246",
    "196, 182, 227",
    "206, 148, 208",
    "221, 107, 168",
    "59, 18, 102"
];

function arrayRGB(colorCode) {
    return colorCode.replace('rgb(', '').replace(')', '').split(', ').map(Number);
}

// pen init

let penMode = "NORMAL",
penState = "DRAW",
penColor = colorPalette[11],
rainbowIndex = 0;

// Generate the canvas

function generateGrid(numberOfPixels = canvasDimensions) {
    pixelCanvas.innerHTML = null;
    for (let i = 0; i <= (numberOfPixels - 1); i++) {
        let rowPiece = document.createElement("div");
        let percentOfCanvas = subdivideCanvas(numberOfPixels);
        rowPiece.setAttribute("style",
            `height: ${percentOfCanvas}%`
        );
        rowPiece.classList.add("rowPiece")
        rowPiece.setAttribute("id", `row${i}`)
        pixelCanvas.appendChild(rowPiece);
    };
    
    for (let i = 0; i <= (numberOfPixels - 1); i++) {
        let rowHeader = document.querySelector(`#row${i}`);
        let percentOfRow = subdivideCanvas(numberOfPixels);
        for (let i = 0; i <= (numberOfPixels - 1); i++) {
            let individualPixels = document.createElement("div");
            individualPixels.classList.add("pixel");
            individualPixels.setAttribute("style",
                `width: ${percentOfRow}%`
            );
            individualPixels.addEventListener("mouseover", draw);
            rowHeader.appendChild(individualPixels);
        }
    } 
};

// Draw function

function draw(e) {
    const white = "rgb(255, 255, 255)"
    if (penState === "DRAW") {
        if (penMode === "RAINBOW") {
            const rainbowColors = colorPalette.slice(0,-1);
            e.target.style.backgroundColor = `rgba(${rainbowColors[rainbowIndex]}, 1.0)`;
            rainbowIndex = (rainbowIndex + 1) % rainbowColors.length;
            }
        else if (penMode === "NORMAL") {
            e.target.style.backgroundColor = `rgba(${penColor}, 1.0)`;
        } else if (penMode === "TRICKLE") {
            let brushTint = trickleMath(penColor, 
                window.getComputedStyle(e.target).backgroundColor
            )

            e.target.style.backgroundColor = brushTint;        
        }
    } else if (penState === "ERASE") {
        if (penMode === "NORMAL" || penMode === "RAINBOW") {
            e.target.style.backgroundColor = white;
        } else if (penMode === "TRICKLE") {
            let eraseTint = trickleMath(white,
                window.getComputedStyle(e.target).backgroundColor
            )

            e.target.style.backgroundColor = eraseTint;
        }
    }
}

function trickleMath(pen, bg) {
    let brushTint = "",
    brushRGB = [],
    penTrickle = arrayRGB(pen);
    bgTrickle = arrayRGB(bg);

    for (let i = 0; i < 3; i++) {
        let average = Math.floor(
            ((penTrickle[i]*1) + (bgTrickle[i]*9))/10
        );
        brushRGB.push(average);
    };

    brushTint = `rgb(${brushRGB[0]}, ${brushRGB[1]}, ${brushRGB[2]})`

    return brushTint;
}

// Color palette

function generatePalette(numberOfColors = colorPalette.length) {
    for (let i = 0; i < colorPalette.length; i++) {
        let colorSwatch = document.createElement("div");
        colorSwatch.classList.add("colorSwatch");
        colorSwatch.setAttribute("id", `color${i}`)
        colorSwatch.style.backgroundColor = `rgb(${colorPalette[i]})`;
        colorSwatch.addEventListener("click", (e) => {
            penColor = colorPalette[i];
            adjustButtonOpacity();
        })
        colorSelection.appendChild(colorSwatch);
    }
}

generateGrid();
generatePalette();

// Welcome to the button zone, Davis.

    // Lists all interactable buttons

let toolButtons = [normalMode, rainbowMode, 
    trickleMode, pen, eraser],
    colorSwatches = Array.from(
        colorSelection.querySelectorAll(".colorSwatch"));

function adjustButtonOpacity() {
    toolButtons.forEach(button => {
        button.style.opacity = 0.6;
    }
    )

    colorSwatches.forEach(swatch => {
        const swatchColor = swatch.style.backgroundColor;
        if (swatchColor === `rgb(${penColor})`) {
            swatch.style.opacity = 1.0;
        } else {
            swatch.style.opacity = 0.6;
        }
    });


    switch (penMode) {
        case "NORMAL":
            normalMode.style.opacity = 1.0;
            break;
        case "RAINBOW":
            rainbowMode.style.opacity = 1.0;
            break;
        case "TRICKLE":
            trickleMode.style.opacity = 1.0;
            break;
    }

    switch (penState) {
        case "DRAW":
            pen.style.opacity = 1.0;
            break;
        case "ERASE":
            eraser.style.opacity = 1.0;
            break;
    }
};

pen.addEventListener("click", (e) => {
    penState = "DRAW";
    adjustButtonOpacity();
});
eraser.addEventListener("click", (e) => {
    penState = "ERASE";
    adjustButtonOpacity();
});
normalMode.addEventListener("click", (e) => {
    penMode = "NORMAL";
    adjustButtonOpacity();
});
rainbowMode.addEventListener("click", (e) => {
    penMode = "RAINBOW";
    adjustButtonOpacity();
});
trickleMode.addEventListener("click", (e) => {
    penMode = "TRICKLE";
    adjustButtonOpacity();
})

dimensionSlider.addEventListener("input", (e) => {
    canvasDimensions = e.target.value;
    canvasDimensionDisplay.textContent = `${canvasDimensions} × ${canvasDimensions}`; 
    generateGrid()
})

clearCanvas.addEventListener("click", (e) => {
    generateGrid();
})

function popup(state, popupWindow = null) {
    switch (state) {
        case "open":
            popupOverlay.style.display = "flex";
            switch (popupWindow) {
                case "instructions":
                    instructions.style.display = "block";
                    break;
                case "changelog":
                    changelog.style.display = "block";
                    break;
            }
            break;
        case "close":
            popupOverlay.style.display = "none";
            instructions.style.display = "none";
            changelog.style.display = "none";
            break;
    }
};


loadInstructions.addEventListener("click", () => popup("open","instructions"))

closeInstructions.addEventListener("click", () => popup("close"))

popupOverlay.addEventListener("click", () => popup("close"))

loadChangelog.addEventListener("click", () => popup("open", "changelog"))

closeChangelog.addEventListener("click", () => popup("close"))

adjustButtonOpacity()