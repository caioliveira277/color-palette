/* Events */
sliders.forEach((slider) => {
  slider.addEventListener("input", HslControls);
});
colorDivs.forEach((div, index) => {
  div.addEventListener("input", () => {
    updateText(index);
  });
});
currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    CopyToClipboard(hex);
  });
});
copyPopup.firstElementChild.addEventListener("animationend", (event) => {
  if (event.target.style.animationName === "fadeOut") {
    return event.target.closest("section").classList.remove("active");
  }
  setTimeout(() => {
    event.target.style.animation =
      "fadeOut 500ms ease-out forwards";
  }, 700);
});
adjustButton.forEach((button, index) => {
  button.addEventListener("click", () => {
    ToggleAdjustmentPanel(index);
  });

  closeAdjustment[index].addEventListener("click", () => {
    ToggleAdjustmentPanel(index);
  });

  lockButton[index].addEventListener("click", () => {
    ToggleLockColor(index);
  });
});
generateBtn.addEventListener("click", RandomColors);

saveButton.addEventListener("click", OpenPalette);
saveContainer.firstElementChild.addEventListener("animationend", (event) => {
  if (event.target.style.animationName === "fadeOut") {
    return event.target.closest("section").classList.remove("active");
  }
});
closeSave.addEventListener("click", () => {
  saveContainer.firstElementChild.style.animation =
    "fadeOut 600ms cubic-bezier(0.26, -0.08, 0.15, 1.37) forwards";
});
saveInput.addEventListener("keyup", (event) => {
  event.stopPropagation();
  let trigger = event.which || event.keyCode; 
  if(trigger === 13){
    SavePalette();
  }
});
saveContainer.firstElementChild.addEventListener("click", (event) => {
  event.stopPropagation();
});
saveContainer.addEventListener("click", () => {
  closeSave.dispatchEvent(new Event("click"));
});
submitButton.addEventListener("click", () => {
  SavePalette();
});
toastMessage.addEventListener("transitionend", ({ target }) => {
  if (target.classList.contains("active")) {
    setTimeout(() => {
      target.classList.remove("active");
    }, 1700);
  }
});
libraryBtn.addEventListener("click", OpenLibrary);
libraryContainer.firstElementChild.addEventListener("animationend", (event) => {
  if (event.target.style.animationName === "fadeOut") {
    return event.target.closest("section").classList.remove("active");
  }
});
closeLibrary.addEventListener("click", () => {
  libraryContainer.firstElementChild.style.animation =
    "fadeOut 300ms cubic-bezier(0.26, -0.08, 0.15, 1.37) forwards";
});
libraryContainer.firstElementChild.addEventListener("click", (event) => {
  event.stopPropagation();
});
libraryContainer.addEventListener("click", () => {
  closeLibrary.dispatchEvent(new Event("click"));
});
document.addEventListener("keyup", (event) => {
  let trigger = event.which || event.keyCode; 
  if(trigger === 32){
    RandomColors();
  }
});
infoMessage.addEventListener("animationend", ({target}) => {
  target.style.opacity = "0";
  setTimeout(() => {
    target.remove();
  }, 500);
})