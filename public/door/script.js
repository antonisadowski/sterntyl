const door = {
  openWindow({
    elementProperties,
    title = "",
    content = "",
    tabs,
    onClose = function () {
      door.closeWindow(this.parentNode);
    },
    previousWindow,
    onReturn = function () {
      door.returnWindow(this.parentNode, this.parentNode.previousWindow);
    },
    minimizable = true,
    maximizable = true,
    width,
    height,
    openingInitialState = {
      left: "50vw",
      opacity: "0"
    },
    closingFinalState = openingInitialState,
    time = 250,
    easing = x => Math.sin(Math.PI / 2 * x)
  }) {
    let element = document.createElement("div");

    if (previousWindow) {
      element.previousWindow = previousWindow;
      let backButton = document.createElement("div");
      backButton.classList.add("window-back-button");
      backButton.onclick = onReturn;
      backButton.innerHTML = "<svg width=\"8\" height=\"16\">\
  <path d=\"M 8 0 l -8 8 l 8 8\" fill=\"#0000\" stroke=\"#000\" />\
  </svg>";
      element.appendChild(backButton);
    }

    if (tabs) {
      for (let i = 0; i < tabs.length; i++) {
        let tab = document.createElement("div");
        tab.classList.add("window-tab");
        if (i === 0) {
          tab.classList.add("active");
        }
        tab.onclick = function () {
          this.parentNode.querySelectorAll(".window-tab").forEach(element => element.classList.remove("active"));
          this.classList.add("active");
        }
        let tabTitle = document.createElement("div");
        tabTitle.appendChild(document.createTextNode(tabs[i]?.title));
        tab.appendChild(tabTitle);
        let tabSubtitle = document.createElement("div");
        tabSubtitle.appendChild(document.createTextNode(tabs[i]?.subtitle));
        tab.appendChild(tabSubtitle);
        element.appendChild(tab);
        let tabContent;
        if (typeof tabs[i]?.content === "object") {
          tabContent = tabs[i].content;
          tabContent.classList.add("window-content");
        } else {
          tabContent = document.createElement("div");
          tabContent.classList.add("window-content");
          tabContent.innerHTML = tabs[i]?.content;
        }
        element.appendChild(tabContent);
      }
    } else {
      let titleElement = document.createElement("div");
      titleElement.classList.add("window-title");
      titleElement.appendChild(document.createTextNode(title));
      element.appendChild(titleElement);

      let contentElement;
      if (typeof contentElement === "object") {
        contentElement = content;
        contentElement.classList.add("window-content");
      } else {
        contentElement = document.createElement("div");
        contentElement.classList.add("window-content");
        contentElement.innerHTML = content;
      }
      element.appendChild(contentElement);
    }

    if (minimizable) {
      let minimizeButton = document.createElement("div");
      minimizeButton.classList.add("window-minimize-button");
      minimizeButton.onclick = function () {
        door.minimizeWindow(this.parentNode);
      };
      minimizeButton.innerHTML = "<svg width=\"16\" height=\"16\">\
  <line x1=\"0\" y1=\"16\" x2=\"16\" y2=\"16\" fill=\"#0000\" stroke=\"#000\" />\
  </svg>";
      element.appendChild(minimizeButton);
    }

    if (maximizable) {
      let maximizeButton = document.createElement("div");
      maximizeButton.classList.add("window-maximize-button");
      maximizeButton.onclick = function () {
        door.maximizeWindow(this.parentNode);
      };
      maximizeButton.innerHTML = "<svg width=\"16\" height=\"16\">\
  <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#0000\" stroke=\"#000\" />\
  </svg>";
      element.appendChild(maximizeButton);
    }

    let closeButton = document.createElement("div");
    closeButton.classList.add("window-close-button");
    closeButton.onclick = onClose;
    closeButton.innerHTML = "<svg width=\"16\" height=\"16\">\
  <path d=\"M 0 0 l 16 16 m 0 -16 l -16 16\" fill=\"#0000\" stroke=\"#000\" />\
  </svg>";
    element.appendChild(closeButton);

    for (let property in elementProperties) {
      if (elementProperties && Object.hasOwn(elementProperties, property)) {
        element[property] = elementProperties[property];
      }
    }
    element.classList.add("window");
    if (tabs) {
      element.classList.add("tabbed");
    }
    if (width) {
      element.style.setProperty("--width", width);
    }
    if (height) {
      element.style.setProperty("--height", height);
    }
    if (previousWindow) {
      let previousWindowInitialState = {
        left: window.getComputedStyle(previousWindow).left,
        opacity: window.getComputedStyle(previousWindow).opacity
      };
      let previousWindowFinalState = {
        left: previousWindow.classList.contains("maximized") ? "-50vw" : "calc(50vw - var(--width, 50vw))",
        opacity: "0"
      };
      let progress = 0;
      function animatePreviousWindow() {
        if (progress < 1) {
          window.setTimeout(animatePreviousWindow, 10);
          for (const property in previousWindowFinalState) {
            previousWindow.style[property] = `calc(${previousWindowInitialState[property]} + ${previousWindow.easing(progress)} * (${previousWindowFinalState[property]} - ${previousWindowInitialState[property]}))`;
          }
          progress += 1 / (previousWindow.time / 10);
        } else {
          for (const property in previousWindowFinalState) {
            previousWindow.style.removeProperty(property);
          }
        }
      }
      animatePreviousWindow();
      previousWindow.classList.add("back");
    }

    element.time = time;
    element.easing = easing;
    element.closingFinalState = closingFinalState;

    document.body.appendChild(element);
    let initialState = openingInitialState;
    let finalState = {};
    for (const property in initialState) {
      finalState[property] = window.getComputedStyle(element)[property];
    }
    let progress = 0;
    let increaseSpeed = true;
    function animate() {
      if (progress < 1) {
        window.setTimeout(animate, 10);
        for (const property in finalState) {
          element.style[property] = `calc(${initialState[property]} + ${easing(progress)} * (${finalState[property]} - ${initialState[property]}))`;
        }
        progress += 1 / (time / 10);
      } else {
        for (const property in finalState) {
          element.style.removeProperty(property);
        }
      }
    }
    animate();
    return element;
  },

  returnWindow(element0, element1) {
    door.closeWindow(element0, true);
    let initialState = {
      left: window.getComputedStyle(element1).left,
      opacity: window.getComputedStyle(element1).opacity
    };
    let finalState = {
      left: element1.style.left || element1.classList.contains("maximized") ? "0vw" : "calc(50vw - var(--width, 50vw) / 2)",
      opacity: element1.style.opacity || "1"
    };
    let progress = 0;
    function animate() {
      if (progress < 1) {
        window.setTimeout(animate, 10);
        for (const property in finalState) {
          element1.style[property] = `calc(${initialState[property]} + ${element1.easing(progress)} * (${finalState[property]} - ${initialState[property]}))`;
        }
        progress += 1 / (element1.time / 10);
      } else {
        for (const property in finalState) {
          element1.style.removeProperty(property);
        }
      }
    }
    animate();
    element1.classList.remove("back");
  },

  closeWindow(element, noRecurse) {
    if (!noRecurse && element.previousWindow) {
      door.closeWindow(element.previousWindow);
    }

    let finalState = element.closingFinalState || {
      left: "50vw",
      opacity: "0"
    };
    let initialState = {};
    for (const property in finalState) {
      initialState[property] = window.getComputedStyle(element)[property];
    }
    let progress = 0;
    function animate() {
      if (progress < 1) {
        window.setTimeout(animate, 10);
        for (const property in finalState) {
          element.style[property] = `calc(${initialState[property]} + ${element.easing(progress)} * (${finalState[property]} - ${initialState[property]}))`;
        }
        progress += 1 / (element.time / 10);
      } else {
        element.remove();
      }
    }
    animate();
  },

  minimizeWindow(element) {
    let initialState = {
      left: window.getComputedStyle(element).left,
      top: window.getComputedStyle(element).top,
      height: window.getComputedStyle(element).height
    };
    let finalState = {
      left: "0px",
      top: element.classList.contains("tabbed") ? "calc(100vh - 2ch" : "calc(100vh - 2em)",
      height: element.classList.contains("tabbed") ? "2ch" : "2em"
    };
    let progress = 0;
    function animate() {
      if (progress < 1) {
        window.setTimeout(animate, 10);
        for (const property in finalState) {
          element.style[property] = `calc(${initialState[property]} + ${element.easing(progress)} * (${finalState[property]} - ${initialState[property]}))`;
        }
        progress += 1 / (element.time / 10);
      } else {
        for (const property in finalState) {
          element.style.removeProperty(property);
        }
      }
    }
    element.querySelector(".window-minimize-button").onclick = function () {
      door.unminimizeWindow(this.parentNode);
    };
    element.querySelector(".window-minimize-button").innerHTML = "<svg width=\"16\" height=\"16\">\
  <rect x=\"0\" y=\"4\" width=\"12\" height=\"12\" fill=\"#0000\" stroke=\"#000\" />\
  <path d=\"M 4 0 l 12 0 l 0 12\" fill=\"#0000\" stroke=\"#000\" />\
  </svg>";
    animate();
    element.classList.add("minimized");
  },

  unminimizeWindow(element) {
    let initialState = {
      left: window.getComputedStyle(element).left,
      top: window.getComputedStyle(element).top,
      height: window.getComputedStyle(element).height
    };
    let finalState = {
      left: element.classList.contains("maximized") ? "0px" : "calc(50vw - var(--width, 50vw) / 2)",
      top: element.classList.contains("maximized") ? element.classList.contains("tabbed") ? "3.5em" : "0px" : element.classList.contains("tabbed") ? "calc(50vh - var(--height, 50vh) / 2 + 3.5em)" : "calc(50vh - var(--height, 50vh) / 2)",
      height: element.classList.contains("maximized") ? element.classList.contains("tabbed") ? "calc(100vh - 3.5em)" : "100vh" : element.classList.contains("tabbed") ? "calc(var(--height, 50vh) - 3.5em)" : "var(--height, 50vh)"
    };
    let progress = 0;
    function animate() {
      if (progress < 1) {
        window.setTimeout(animate, 10);
        for (const property in finalState) {
          element.style[property] = `calc(${initialState[property]} + ${element.easing(progress)} * (${finalState[property]} - ${initialState[property]}))`;
        }
        progress += 1 / (element.time / 10);
      } else {
        for (const property in finalState) {
          element.style.removeProperty(property);
        }
      }
    }
    element.querySelector(".window-minimize-button").onclick = function () {
      door.minimizeWindow(this.parentNode);
    };
    element.querySelector(".window-minimize-button").innerHTML = "<svg width=\"16\" height=\"16\">\
  <line x1=\"0\" y1=\"16\" x2=\"16\" y2=\"16\" fill=\"#0000\" stroke=\"#000\" />\
  </svg>";
    animate();
    element.classList.remove("minimized");
  },

  maximizeWindow(element) {
    let initialState = {
      left: window.getComputedStyle(element).left,
      top: window.getComputedStyle(element).top,
      width: window.getComputedStyle(element).width,
      height: window.getComputedStyle(element).height
    };
    let finalState = {
      left: "0px",
      top: element.classList.contains("tabbed") ? "3.5em" : "0px",
      width: "100vw",
      height: element.classList.contains("tabbed") ? "calc(100vh - 3.5em)" : "100vh"
    };
    let progress = 0;
    function animate() {
      if (progress < 1) {
        window.setTimeout(animate, 10);
        for (const property in finalState) {
          element.style[property] = `calc(${initialState[property]} + ${element.easing(progress)} * (${finalState[property]} - ${initialState[property]}))`;
        }
        progress += 1 / (element.time / 10);
      } else {
        for (const property in finalState) {
          element.style.removeProperty(property);
        }
      }
    }
    element.querySelector(".window-maximize-button").onclick = function () {
      door.unmaximizeWindow(this.parentNode);
    };
    element.querySelector(".window-maximize-button").innerHTML = "<svg width=\"16\" height=\"16\">\
  <rect x=\"0\" y=\"4\" width=\"12\" height=\"12\" fill=\"#0000\" stroke=\"#000\" />\
  <path d=\"M 4 0 l 12 0 l 0 12\" fill=\"#0000\" stroke=\"#000\" />\
  </svg>";
    animate();
    element.classList.add("maximized");
  },

  unmaximizeWindow(element) {
    let initialState = {
      left: window.getComputedStyle(element).left,
      top: window.getComputedStyle(element).top,
      width: window.getComputedStyle(element).width,
      height: window.getComputedStyle(element).height
    };
    let finalState = {
      left: "calc(50vw - var(--width, 50vw) / 2)",
      top: element.classList.contains("tabbed") ? "calc(50vh - var(--height, 50vh) / 2 + 3.5em)" : "calc(50vh - var(--height, 50vh) / 2)",
      width: "var(--width, 50vw)",
      height: element.classList.contains("tabbed") ? "calc(var(--height, 50vh) - 3.5em)" : "var(--height, 50vh)"
    };
    let progress = 0;
    function animate() {
      if (progress < 1) {
        window.setTimeout(animate, 10);
        for (const property in finalState) {
          element.style[property] = `calc(${initialState[property]} + ${element.easing(progress)} * (${finalState[property]} - ${initialState[property]}))`;
        }
        progress += 1 / (element.time / 10);
      } else {
        for (const property in finalState) {
          element.style.removeProperty(property);
        }
      }
    }
    element.querySelector(".window-maximize-button").onclick = function () {
      door.maximizeWindow(this.parentNode);
    };
    element.querySelector(".window-maximize-button").innerHTML = "<svg width=\"16\" height=\"16\">\
  <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#0000\" stroke=\"#000\" />\
  </svg>";
    animate();
    element.classList.remove("maximized");
  },

  easings: {
    linear: x => x,
    inQuad: x => x ** 2,
    outQuad: x => 1 - (1 - x) ** 2,
    inOutQuad: x => x < 0.5 ? 2 * x ** 2 : 2 * (1 - (1 - x) ** 2 - 1) + 1,
    inCubic: x => x ** 3,
    outCubic: x => 1 - (1 - x) ** 3,
    inOutCubic: x => x < 0.5 ? 4 * x ** 3 : 4 * (1 - (1 - x) ** 3 - 1) + 1,
    inQuart: x => x ** 4,
    outQuart: x => 1 - (1 - x) ** 4,
    inOutQuart: x => x < 0.5 ? 8 * x ** 4 : 8 * (1 - (1 - x) ** 4 - 1) + 1,
    inQuint: x => x ** 5,
    outQuint: x => 1 - (1 - x) ** 5,
    inOutQuint: x => x < 0.5 ? 16 * x ** 5 : 16 * (1 - (1 - x) ** 5 - 1) + 1,
    inBack: x => x ** 2 + (x ** 2 - x),
    outBack: x => 1 - ((1 - x) ** 2 + ((1 - x) ** 2 - (1 - x))),
    inOutBack: x => x < 0.5 ? ((1.75 * x) ** 2 + (x ** 2 - x)) : (1 - ((1.75 * (1 - x)) ** 2 + ((1 - x) ** 2 - (1 - x))) - 1) + 1,
    inElastic: x => x === 0 ? 0 : 1 - (1 - Math.sin(Math.PI * 8 * (1 - x)) - 1) / (((1 - x) || 0.625) / 0.0625) + 1,
    outElastic: x => x === 0 ? 0 : (1 - Math.sin(Math.PI * 8 * x) - 1) / ((x || 0.625) / 0.0625) + 1,
    inOutElastic: x => x === 0 ? 0 : x < 0.5 ? 1 - (1 - Math.sin(Math.PI * 8 * (1 - x)) - 1) / (((1 - x) || 0.625) / 0.0625) + 1 : (1 - Math.sin(Math.PI * 8 * x) - 1) / ((x || 0.625) / 0.0625) + 1
  }
};