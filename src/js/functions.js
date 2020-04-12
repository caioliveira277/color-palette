"use strict";
/* functions */
function GerenateHex() {
  return chroma.random();
}

function CheckTextContrast(color, element, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    element.style.color = "#2e2e2e";
  } else {
    element.style.color = "#dddddd";
  }
  if (!text) {
    return true;
  }
  return (element.innerText = text);
}
function ColorizeSliders(color, hue, brightness, saturation) {
  const noSaturation = color.set("hsl.s", 0);
  const fullSaturation = color.set("hsl.s", 1);
  const scaleSaturation = chroma.scale([noSaturation, color, fullSaturation]);

  const midBrightness = color.set("hsl.l", 0.5);
  const scaleBrightness = chroma.scale(["#000000", midBrightness, "#ffffff"]);

  saturation.style.backgroundImage = `linear-gradient(to right, 
    ${scaleSaturation(0)}, 
    ${scaleSaturation(1)}
  )`;
  brightness.style.backgroundImage = `linear-gradient(to right, 
    ${scaleBrightness(0)}, 
    ${scaleBrightness(0.5)},
    ${scaleBrightness(1)}
  )`;
  hue.style.backgroundImage = `linear-gradient(to right, 
    rgb(204, 75, 75), 
    rgb(204, 204, 75), 
    rgb(75, 204, 75), 
    rgb(75, 204, 204), 
    rgb(75, 75, 204), 
    rgb(204, 75, 204), 
    rgb(204, 75, 75))`;
}

function RandomColors() {
  initialColors = [];
  colorDivs.forEach((div) => {
    const hexElement = div.children[0];
    const randomColor = GerenateHex();
    const icons = div.querySelectorAll("div.controls button");
    if (div.classList.contains("locked")) {
      return initialColors.push(hexElement.innerText);
    }

    div.style.backgroundColor = randomColor;
    initialColors.push(randomColor.hex());

    CheckTextContrast(randomColor, hexElement, randomColor);
    for (const key in icons) {
      if (icons.hasOwnProperty(key)) {
        CheckTextContrast(randomColor, icons[key]);
      }
    }

    const color = chroma(randomColor);
    const sliders = div.querySelectorAll("div.sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    ColorizeSliders(color, hue, brightness, saturation);
  });
  ResetInputs();
}

function HslControls(event) {
  const index =
    event.target.getAttribute("data-hue") ||
    event.target.getAttribute("data-brightness") ||
    event.target.getAttribute("data-saturation");

  const sliders = event.target.parentElement.querySelectorAll(
    "input[type='range']"
  );
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const backgroundColor = initialColors[index];

  const color = chroma(backgroundColor)
    .set("hsl.h", hue.value)
    .set("hsl.l", brightness.value)
    .set("hsl.s", saturation.value);

  colorDivs[index].style.backgroundColor = color;

  ColorizeSliders(color, hue, brightness, saturation);
}

function updateText(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor).hex();
  const textElement = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll("div.controls button");

  CheckTextContrast(color, textElement, color);

  for (const key in icons) {
    if (icons.hasOwnProperty(key)) {
      CheckTextContrast(color, icons[key]);
    }
  }
}

function ResetInputs() {
  let color;
  sliders.forEach((slider) => {
    color = initialColors[slider.getAttribute(`data-${slider.name}`)];
    switch (slider.name) {
      case "hue":
        slider.value = Math.floor(chroma(color).hsl()[0]);
        break;
      case "saturation":
        slider.value = Math.floor(chroma(color).hsl()[1] * 100) / 100;
        break;
      case "brightness":
        slider.value = Math.floor(chroma(color).hsl()[2] * 100) / 100;
        break;
    }
  });
}

function CopyToClipboard(hex) {
  const element = document.createElement("textarea");

  element.value = hex.innerText;
  document.body.appendChild(element);
  element.select();
  document.execCommand("copy");
  document.body.removeChild(element);

  copyPopup.classList.add("active");
  copyPopup.firstElementChild.style.animation =
    "fadeIn 600ms cubic-bezier(0.26, -0.08, 0.15, 1.37) forwards";
}

function ToggleAdjustmentPanel(index) {
  sliderContainers[index].classList.toggle("active");
}

function ToggleLockColor(index) {
  if (colorDivs[index].classList.toggle("locked")) {
    lockButton[index].firstElementChild.innerText = "lock";
  } else {
    lockButton[index].firstElementChild.innerText = "lock_open";
  }
}

function OpenPalette() {
  saveContainer.classList.add("active");
  saveContainer.firstElementChild.style.animation =
    "fadeIn 600ms cubic-bezier(0.26, -0.08, 0.15, 1.37) forwards";
  saveInput.focus();
}

function OpenLibrary() {
  libraryContainer.classList.add("active");
  libraryContainer.firstElementChild.style.animation =
    "fadeIn 600ms cubic-bezier(0.26, -0.08, 0.15, 1.37) forwards";
}

function ToastMessage(type, message) {
  const icon = toastMessage.children[1];
  const h2 = (toastMessage.children[0].innerText = message);

  if (!toastMessage.classList.toggle("active")) {
    return ToastMessage(type, message);
  }

  if (type === "success") {
    toastMessage.classList.remove("error");
    toastMessage.classList.add("success");
    icon.innerText = "thumb_up";
  } else {
    toastMessage.classList.add("error");
    toastMessage.classList.remove("success");
    icon.innerText = "thumb_down";
  }
}

function SavePalette() {
  const name = saveInput.value;
  const colors = [];

  if (!name) return ToastMessage("error", "Name not entered!");

  currentHexes.forEach((hex) => {
    colors.push(hex.innerText);
  });

  const paletteObj = { name, colors };
  savedPalettes.push(paletteObj);

  saveInput.value = "";
  StorePalette(paletteObj);
}

function RenderElementLibrary(palettesObj) {
  const palette = document.createElement("div");
  const title = document.createElement("h4");
  const preview = document.createElement("div");
  const removeBtn = document.createElement("button");

  removeBtn.classList.add("remove-palette");
  removeBtn.innerText = "X";

  palette.classList.add("custom-palette");
  preview.classList.add("small-preview");
  title.innerText = palettesObj.name;

  palettesObj.colors.forEach((smallColor) => {
    const smallDiv = document.createElement("div");
    smallDiv.style.backgroundColor = smallColor;
    preview.appendChild(smallDiv);
  });

  const paletteBtn = document.createElement("button");
  paletteBtn.classList.add("pick-palette-btn");
  paletteBtn.innerText = "Select";

  palette.appendChild(removeBtn);
  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteBtn);

  paletteList.appendChild(palette);

  paletteBtn.addEventListener("click", () => {
    closeLibrary.dispatchEvent(new Event("click"));

    initialColors = [];
    palettesObj.colors.forEach((color, index) => {
      initialColors.push(color);
      colorDivs[index].style.backgroundColor = color;
      const elementText = colorDivs[index].children[0];
      CheckTextContrast(color, elementText);
      updateText(index);
    });
    ResetInputs();
    sliders.forEach((slider) => {
      slider.dispatchEvent(new Event("input"));
    });
  });
  removeBtn.addEventListener("click", ({ target }) => {
    const parentTarget = target.parentElement;
    const listPalettes = parentTarget.parentElement.children;
    let index = [...listPalettes].indexOf(parentTarget);
    RemovePalette(index, parentTarget);
    parentTarget.classList.add("removed");
  });
}

function StorePalette(palettesObj) {
  let localPalettes = [];

  if (localStorage.getItem("palettes") !== null) {
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
  }

  localPalettes.push(palettesObj);
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
  closeSave.dispatchEvent(new Event("click"));
  RenderElementLibrary(palettesObj);
  return ToastMessage("success", "Saved successfully!");
}
function RemovePalette(index, element) {
  let localPalettes = [];

  if (localStorage.getItem("palettes") !== null) {
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
    delete localPalettes[index];
    let newPalettes = [];

    localPalettes.forEach((obj) => {
      newPalettes.push(obj);
    });

    localStorage.setItem("palettes", JSON.stringify(newPalettes));
    setTimeout(() => {
      element.remove();
    }, 600);
  }
}
function GetPalettes() {
  let palettesObj = [];

  if (localStorage.getItem("palettes") !== null) {
    palettesObj = JSON.parse(localStorage.getItem("palettes"));
  }

  palettesObj.forEach((palette) => {
    RenderElementLibrary(palette);
  });
}


/* Startup */
RandomColors();
GetPalettes();
