const generateBtn = document.getElementById("generator-btn");
const paletteContainer = document.querySelector(".palette-container");

generateBtn.addEventListener("click", () => generatePalette());

function generatePalette() {
    const colors = [];

    for (let i = 0; i < 5; i++) {
        colors.push(generateRandomColor());
    }

    updateColorPalette(colors);
}

function generateRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
        color = color + letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function updateColorPalette(colors) {
    const colorBoxes = document.querySelectorAll(".color-box");

    colorBoxes.forEach((box, index) => {
        const color = colors[index];
        const colorDiv = box.querySelector(".color");
        const hexValue = box.querySelector(".hex-value");

        colorDiv.style.backgroundColor = color;
        hexValue.textContent = color;
    });
}

paletteContainer.addEventListener("click", (event) => {
    const copyButton = event.target.closest(".copy-btn");
    const colorDiv = event.target.closest(".color");

    if (copyButton) {
        const hexElement = copyButton.previousElementSibling;
        const hexValue = hexElement ? hexElement.textContent : "";

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
        const colorInfo = colorDiv.nextElementSibling;
        const hexElement = colorInfo
            ? colorInfo.querySelector(".hex-value")
            : null;
        const hexValue = hexElement ? hexElement.textContent : "";

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

function showCopySuccess(element) {
    console.log(element);
    if (!element) return;

    const colorBefore = element.style.color;

    element.classList.remove("fa", "fa-copy");
    element.classList.add("fa-solid", "fa-check");
    element.style.color = "#48bb78";

    console.log(element);

    setTimeout(() => {
        element.classList.remove("fa-solid", "fa-check");
        element.classList.add("fa", "fa-copy");
        element.style.color = colorBefore;
    }, 500);
}
