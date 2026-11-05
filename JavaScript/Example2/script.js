// Various DOM elements
const generateBtn = document.getElementById("generator-btn");
const paletteContainer = document.querySelector(".palette-container");

// Generate pallette event connect
generateBtn.addEventListener("click", () => {
    const colors = [];

    for (let i = 0; i < 5; i++) {
        colors.push(generateRandomColor());
    }

    updateColorPalette(colors);
});

// Generates a random hex color from the pool of 16 starting with #
function generateRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";

    // Looping 6 times, generates a hex color char
    for (let i = 0; i < 6; i++) {
        color = color + letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

// Generates a random hex color from the pool of 16 starting with #
function updateColorPalette(colors) {
    const colorBoxes = document.querySelectorAll(".color-box");
    /* 
    For each of the color boxes, 
    updates the div with class color to stored color  
    updates span with class hex-value with stored color text
    */
    colorBoxes.forEach((box, index) => {
        const color = colors[index];
        const colorDiv = box.querySelector(".color");
        const hexValue = box.querySelector(".hex-value");

        colorDiv.style.backgroundColor = color;
        hexValue.textContent = color;
    });
}

// Palette click event connect
paletteContainer.addEventListener("click", (event) => {
    // Finds nearest parent with class copy-btn or class color (mutually exclusive)
    const copyButton = event.target.closest(".copy-btn");
    const colorDiv = event.target.closest(".color");

    if (copyButton) {
        // Finds span with class hex-value
        const hexElement = copyButton.previousElementSibling;
        const hexValue = hexElement ? hexElement.textContent : "";

        // Copy to clipboard
        navigator.clipboard
            .writeText(hexValue)
            .then(() => {
                const icon = copyButton.querySelector("i") || copyButton;
                showCopySuccess(icon);
            })
            .catch((error) => {
                console.log(error);
            });

        return;
    }

    if (colorDiv) {
        // Finds span with class hex-value
        const colorInfo = colorDiv.nextElementSibling;
        const hexElement = colorInfo
            ? colorInfo.querySelector(".hex-value")
            : null;
        const hexValue = hexElement ? hexElement.textContent : "";

        // Copy to clipboard
        navigator.clipboard
            .writeText(hexValue)
            .then(() => {
                const copyBtnElement = colorInfo?.querySelector(".copy-btn");

                if (copyBtnElement) showCopySuccess(copyBtnElement);
            })
            .catch((error) => {
                console.log(error);
            });
    }
});

// Effect for copy and delayed after effect
function showCopySuccess(element) {
    console.log(element);
    if (!element) return;

    const colorBefore = element.style.color;

    // Removes font-awesome copy and adds check
    element.classList.remove("fa", "fa-copy");
    element.classList.add("fa-solid", "fa-check");
    element.style.color = "#48bb78";

    console.log(element);

    // Returns to normal after delay
    setTimeout(() => {
        element.classList.remove("fa-solid", "fa-check");
        element.classList.add("fa", "fa-copy");
        element.style.color = colorBefore;
    }, 500);
}
