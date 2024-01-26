let downloads = {
  "sd0.zip": `
  <img src="sd0.png" />
  <h3>SD0 (Secret Door 0)</h3>
  <p>SD0 is a secret door data pack & resource pack for Minecraft.</p>
  <p>This zip file contains two folders:</p>
  <ol>
    <li>sd0_datapack - put this folder in your <code>.minecraft/saves/&lt;your save name>/datapacks/</code> folder.</li>
    <li>sd0_resourcepack - put this folder in your <code>.minecraft/resourcepacks/</code> folder, and enable this resource pack from Options > Resource packs.</li>
  </ol>
`,
  "generator-linux.zip": `
  <h3>Generator testów (Linux)</h3>
  <p>Włóż folder <code>.generator</code> do katalogu domowego. Powinien zawierać pliki <code>tksta.genfile</code> i <code>tksts.genfile</code>. Uruchom plik wykonywalny.</p>
`,
  "generator-windows.zip": `
  <h3>Generator testów (Windows)</h3>
  <p>Uwaga: gtkmm 3 musi być zainstalowany na komputerze.</p>
  <p>Włóż folder <code>.generator</code> do folderu %appdata%. Powinien zawierać pliki <code>tksta.genfile</code> i <code>tksts.genfile</code>. Uruchom plik .exe.</p>
`,
  "genfile-convert-linux": `
  <h3>Konwertowanie plików genfile (Linux)</h3>
  <p>Uruchom plik wykonywalny. Następnie wybirz:</p>
  <ul>
    <li>0: wyjście</li>
    <li>1: konwertuj plik .txt na .genfile</li>
    <li>2: konwertuj plik .genfile na .txt</li>
  </ul>
`,
  "genfile-convert-windows.exe": `
  <h3>Konwertowanie plików genfile (Windows)</h3>
  <p>Uruchom plik .exe. Następnie wybirz:</p>
  <ul>
    <li>0: wyjście</li>
    <li>1: konwertuj plik .txt na .genfile</li>
    <li>2: konwertuj plik .genfile na .txt</li>
  </ul>
`
};

function download(file) {
  const progress = document.createElement("progress");
  progress.max = 100;
  progress.value = 0;
  downloadingWindow = door.openWindow({
    title: `Pobieranie pliku ${file}`,
    content: progress,
    maximizable: false,
    onClose: () => {}
  });
  const dataChunks = [];
  fetch(file).
    then(response => {
      const reader = response.body.getReader();
      const totalSize = +response.headers.get("content-length");
      let downloadedSize = 0;
      function readData() {
        return reader.read().then(({ done, value }) => {
          if (value) {
            dataChunks.push(value);
            downloadedSize += value.length;
            const percentage = Math.floor(downloadedSize / totalSize * 100);
            progress.value = percentage;
          }
          if (!done) {
            return readData();
          }
        });
      }
      return readData();
    }).
    then(() => {
      const blob = new Blob(dataChunks, { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      door.openWindow({
        title: `Pobrano plik ${file}`,
        previousWindow: downloadingWindow,
        content: downloads[file],
        onReturn:() => {}
      });
    });
}

function hash(str) {
  let hash = 0;
  if (str.length == 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

function openTerminal(command) {
  let element = document.createElement("div");
  element.innerHTML = "<div class=\"stwindow\" style=\"opacity: 0; transform: scale(0.75);\" onmousedown=\"if (event.offsetY < 0) {drag = {element: this, x: event.offsetX + 1, y: event.offsetY + 30}; body.style.setProperty('user-select', 'none');}\" onclick=\"if (!window.getSelection().toString()) {this.querySelector('.terminal_textarea').focus();} this.querySelector('.terminal_textarea').selectionStart = -1; this.querySelector('.terminal_textarea').selectionEnd = -1;\"> <div class=\"stwindow_title\">Terminal</div> <div class=\"stwindow_close_button\" onclick=\"closeWindow(this.parentNode);\"> <svg width=\"10\" height=\"10\"> <path d=\"M 0 0 l 10 10 m 0 -10 l -10 10\" fill=\"#00000000\" stroke=\"#ffffff\"> </svg> </div> <div class=\"terminal_container\"> <textarea class=\"terminal_textarea\" onkeydown=\"handleTerminalTextareaKeydown(this, event);\">&gt;</textarea> <div class=\"terminal\">&gt;<div class=\"terminal_caret_position\">&gt;<div class=\"terminal_caret\"></div> </div> </div> </div>";
  terminal = element.firstChild;
  document.body.append(terminal);
  terminal.querySelector(".terminal_textarea").currentCommandHistoryEntry = -1;
  terminal.querySelector(".terminal_textarea").commandStart = 1;
  terminal.querySelector(".terminal_textarea").commandEnd = 1;
  terminal.click();
  let speed = 0.01;
  let increaseSpeed = true;
  function animate() {
    if (speed >= 0.01) {
      setTimeout(animate, 10); 
      terminal.style.setProperty("opacity", (Number(terminal.style.getPropertyValue("opacity")) + speed)); terminal.style.setProperty("transform", "scale(" + ((Number(terminal.style.getPropertyValue("transform").slice(terminal.style.getPropertyValue("transform").indexOf("(") + 1, terminal.style.getPropertyValue("transform").indexOf(")")))) + speed / 4) + ")");
    } else {
      terminal.removeAttribute("style");
    }   
    
    if (speed < 0.095 && increaseSpeed) {
      speed += 0.01;
    } else {
      increaseSpeed = false;
      speed -= 0.01;
    }
  }
  animate();
  if (command) {
    runCommand(terminal, command);
    closeWindow(terminal);
  }
}

function closeWindow(window) {
  if (!window.classList.contains("stwindow")) {
    throw "SterntylPlError: Cannot close a window that is not a window";
  }
  window.style.setProperty("opacity", 1);
  window.style.setProperty("transform", "scale(1)");
  let speed = 0.01;
  let increaseSpeed = true;
  function animate() {
    if (speed >= 0.01) {
      setTimeout(animate, 10); 
      terminal.style.setProperty("opacity", (Number(terminal.style.getPropertyValue("opacity")) - speed)); terminal.style.setProperty("transform", "scale(" + ((Number(terminal.style.getPropertyValue("transform").slice(terminal.style.getPropertyValue("transform").indexOf("(") + 1, terminal.style.getPropertyValue("transform").indexOf(")")))) - speed / 4) + ")");
    } else {
      window.remove();
    }   
    
    if (speed < 0.095 && increaseSpeed) {
      speed += 0.01;
    } else {
      increaseSpeed = false;
      speed -= 0.01;
    }
  }
  animate();
}

function openScreen(screen) {
  screen.classList.add("open");
}

function closeScreen(screen) {
  if (!screen.classList.contains("screen")) {
    throw "SterntylPlError: Cannot close a screen that is not a screen";
  }
  screen.classList.remove("open");
}

function notify(notification) {
  if (!notification.classList.contains("notification")) {
    throw "SterntylPlError: Cannot notify non-notification";
  }
  notification.classList.add("open");
  setTimeout(function (notification) {notification.classList.remove("open");}, 5000, notification);
}

function closeNotification(notification) {
  if (!notification.classList.contains("notification")) {
    throw "SterntylPlError: Cannot notify non-notification";
  }
  notification.classList.remove("open");
}

async function runCommand(textarea, input) {
  let commands = input.split(/([^;]*"[^"]*"[^;]*)|;/).filter(element => element?.trimStart());
  for (let i = 0; i < commands.length; i++) {
    let command = commands[i].trimStart();
    let args = command.split(/([^ ]*"[^"]*"[^ ]*)| /).filter(element => element !== undefined);

    textarea.parentNode.querySelector(".terminal").innerHTML = ansiEscCode(textarea.value.replace(/</g, "&lt;").replace(/>/g, "&gt;"), textarea) + "<div class=\"terminal_caret_position\">&gt;<div class=\"terminal_caret\"></div> </div>";
    textarea.parentNode.querySelector(".terminal_caret_position").innerHTML = textarea.value.slice(0, textarea.selectionEnd).replace(/\u001b\[[^A-Za-z]*[A-Za-z]/g, "").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "<div class=\"terminal_caret\"></div>";
    
    switch (args[0]) {
      case "":
        break;
      case "calc":
        if (/^[\dn_*/+ -]+$/.test(args.slice(1).join(" "))) {
          textarea.value += eval(args.slice(1).join(" ")) + "\n";
        } else {
          textarea.value += "Błąd\n";
        }
        break;
      case "clear":
        textarea.value = "";
        break;
      case "download":
        if (args[1] in downloads) {
          download(args[1]);
        } else {
          insertTextInTextarea(textarea, `Błąd: Nie znaleziono pliku o nazwie ${args[1]}.\n`);
        }
        break;
      case "echo":
        if (/^-[^\s]*e[^\s]*$/.test(args[1])) {
          eval("insertTextInTextarea(textarea, \"" + command.replace(/"/g, "\\\"") + "\".split(/ /).slice(1).join(\" \").replace(/^-[^\\s]*\\s/, \"\").replace(/^\"([^\"]*)\"$/, \"$1\") + (/^-[^\\s]*n[^\\s]*$/.test(arguments[1]) ? \"\" : \"\\n\"))");
        } else {
          insertTextInTextarea(textarea, args.slice(1).join(" ").replace(/^-[^\s]*\s/, "") + (/^-[^\s]*n[^\s]*$/.test(args[1]) ? "" : "\n"));
        }
        break;
      case "exit":
        closeWindow(textarea.parentNode.parentNode);
        break;
      case "go":
        if (/^-[^\s]*$/.test(args[1])) {
          if (/^-[^\s]*w[^\s]*$/.test(args[1])) {
            door.openWindow({
              title: args.slice(2).join(" ").replace(/^(?!https?:\/\/)/, "https://"),
              content: `<iframe src="${args.slice(2).join(" ").replace(/^(?!https?:\/\/)/, "http://").replace(/"/, "&quot;")}" style="width: 100%; height: 100%; border: none;"></iframe>`
            });
          } else {
            location = args.slice(2).join(" ").replace(/^(?!https?:\/\/)/, "https://");
          }
        } else {
          location = args.slice(1).join(" ").replace(/^(?!https?:\/\/)/, "https://");
        }
        break;
      case "m":
        if (/^-[^\s]*n[^\s]*$/.test(args[1])) {
          document.querySelector(".money").innerHTML = "Masz " + (/^-[^\s]*d[^\s]*$/.test(args[1]) ? "0,00" : args.slice(2).join(" ")) + " " + document.querySelector(".money").innerHTML.split(/ /)[2];
        } else if (/^-[^\s]*u[^\s]*$/.test(args[1])) {
          document.querySelector(".money").innerHTML = "Masz " + document.querySelector(".money").innerHTML.split(/ /)[1] + " " + (/^-[^\s]*d[^\s]*$/.test(args[1]) ? "zł" : args.slice(2).join(" "));
        } else {
          document.querySelector(".money").innerHTML = "Masz " + (/^-[^\s]*d[^\s]*$/.test(args[1]) ? "0,00 zł" : command.replace(/^-[^\s]*\s/g, "").split(/ /).slice(1).join(" "));
        }
        break;
      case "history":
        if (/^-[^\s]*c[^\s]*$/.test(args[1])) {
          commandHistory = [];
        } else {
          insertTextInTextarea(textarea, commandHistory.join("\n") + "\n");
        }
        break;
      case "search":
        search(args.slice(1).join(" "));
        break;
      case "sleep":
        await new Promise(resolve => setTimeout(resolve, Number(args[1])));
        break;
      case "terminal":
        openTerminal(args.slice(1).join(" "));
        break;
      default:
        insertTextInTextarea(textarea, args[0] + ": nie znaleziono polecenia\n");
        break;
    }
  }
}

async function handleTerminalTextareaKeydown(element, event) {
  let oldLength = element.value.length;
  element.parentNode.querySelector(".terminal").scrollTop = element.parentNode.querySelector(".terminal").scrollHeight;
  switch (event.code) {
    case "ArrowDown":
      if (element.currentCommandHistoryEntry > 0) {
        element.currentCommandHistoryEntry--;
        element.value = element.value.slice(0, element.commandStart) + commandHistory[element.currentCommandHistoryEntry] + element.value.slice(element.commandEnd);
      }
      event.preventDefault();
      break;
    case "ArrowLeft":
      if (element.selectionEnd < element.commandStart + 1 || event.shiftKey) {
        event.preventDefault();
      }
      break;
    case "ArrowRight":
      if (element.selectionEnd < element.commandStart || event.shiftKey) {
        event.preventDefault();
      }
      break;
    case "ArrowUp":
     if (element.currentCommandHistoryEntry < commandHistory.length - 1) {
      element.currentCommandHistoryEntry++;
      element.value = element.value.slice(0, element.commandStart) + commandHistory[element.currentCommandHistoryEntry] + element.value.slice(element.commandEnd);
    }
      event.preventDefault();
      break;
    case "Backspace":
      if (element.selectionEnd < element.commandStart + 1 || event.ctrlKey) {
        event.preventDefault();
      }
      break;
    case "Enter":
      event.preventDefault();
      if (element.value.slice(element.commandStart, element.commandEnd) !== commandHistory[0]) {
        commandHistory.unshift(element.value.slice(element.commandStart, element.commandEnd));
      }
      insertTextInTextarea(element, "\n", element.commandEnd);
      await runCommand(element, element.value.slice(element.commandStart, element.commandEnd));
      insertTextInTextarea(element, ">", element.selectionEnd);
      cursorMoveEntered = false;
      element.commandStart = element.commandEnd = element.selectionEnd < 0 ? element.value.length - element.selectionEnd : element.selectionEnd;
      element.currentCommandHistoryEntry = -1;
      break;
  }
  setTimeout(() => {
    element.parentNode.querySelector(".terminal").innerHTML = ansiEscCode(element.value.replace(/</g, "&lt;").replace(/>/g, "&gt;"), element) + "<div class=\"terminal_caret_position\">&gt;<div class=\"terminal_caret\"></div> </div>";
    element.parentNode.querySelector(".terminal_caret_position").innerHTML = element.value.slice(0, element.selectionEnd).replace(/\u001b\[[^A-Za-z]*[A-Za-z]/g, "").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "<div class=\"terminal_caret\"></div>";
    element.parentNode.querySelector(".terminal").scrollTop = element.parentNode.querySelector(".terminal").scrollHeight;
    element.commandEnd += element.value.length - oldLength;
    element.commandEnd = Math.min(Math.max(0, element.commandEnd), element.value.length);
  }, 30);
}

function insertTextInTextarea(textarea, text, position = textarea.selectionEnd, keepSelection) {
  position = position === -1 ? textarea.value.length : position;
  let selectionStart = textarea.selectionStart;
  let selectionEnd = textarea.selectionEnd;
  textarea.value = textarea.value.slice(0, position) + text + textarea.value.slice(position);
  textarea.selectionEnd = keepSelection ? selectionEnd : position + text.length;
  textarea.selectionStart = keepSelection ? selectionStart : textarea.selectionEnd;
}

function ansiEscCode(string, textarea) {
  let mHTML = {
    1: "<span style=\"font-weight: bold;\">",
    2: "<span style=\"opacity: 0.5;\">",
    3: "<span style=\"font-style: italic;\">",
    4: "<span style=\"text-decoration: underline;\">",
    5: "<span style=\"animation-name: blink; animation-duration: 1000ms; animation-timing-function: linear; animation-iteration-count: infinite;\">",
    6: "<span style=\"animation-name: blink; animation-duration: 500ms; animation-timing-function: linear; animation-iteration-count: infinite;\">",
    7: "<span style=\"--fg1: var(--bg); --bg1: var(--fg);\">",
    8: "<span style=\"visibility: hidden;\">",
    9: "<span style=\"text-decoration: line-through;\">",
    30: "<span style=\"--fg: #000000;\">",
    31: "<span style=\"--fg: #ff0000;\">",
    32: "<span style=\"--fg: #00ff00;\">",
    33: "<span style=\"--fg: #ff7f00;\">",
    34: "<span style=\"--fg: #0000ff;\">",
    35: "<span style=\"--fg: #ff00ff;\">",
    36: "<span style=\"--fg: #00ffff;\">",
    37: "<span style=\"--fg: #ffffff;\">",
    39: "<span style=\"--fg: #ffffff;\">",
    40: "<span style=\"--bg: #000000;\">",
    41: "<span style=\"--bg: #ff0000;\">",
    42: "<span style=\"--bg: #00ff00;\">",
    43: "<span style=\"--bg: #ff7f00;\">",
    44: "<span style=\"--bg: #0000ff;\">",
    45: "<span style=\"--bg: #ff00ff;\">",
    46: "<span style=\"--bg: #00ffff;\">",
    47: "<span style=\"--bg: #ffffff;\">",
    49: "<span style=\"--bg: #ffffff;\">"
  };

  string.replace(/\u001b\[(\d*)A/g, (string, number) => {
    number = number === "" ? 1 : Number(number);
    for (let i = 0; i < number; i++) {
      textarea.selectionStart = textarea.selectionEnd = textarea.value.lastIndexOf("\n", textarea.value.lastIndexOf("\n", textarea.selectionEnd) - 1);
    }
  });

  string.replace(/\u001b\[(\d*)B/g, (string, number) => {
    number = number === "" ? 1 : Number(number);
    for (let i = 0; i < number; i++) {
      textarea.selectionStart = textarea.selectionEnd = textarea.value.indexOf("\n", textarea.selectionEnd);
    }
  });
  
  string.replace(/\u001b\[(\d*)C/g, (string, number) => {
    number = number === "" ? 1 : Number(number);
    textarea.selectionStart = textarea.selectionEnd += number;
    return "";
  });
  string.replace(/\u001b\[(\d*)D/g, (string, number) => {
    number = number === "" ? 1 : Number(number);
    textarea.selectionStart = textarea.selectionEnd -= number;
    return "";
  });

  string = string.replace(/\u001b\[J.*/, "");
  string = string.replace(/\u001b\[K.*/gm, "");

  string = string.replace(/(?<=\u001b\[(?:\d*;)*\d*)(\d*)(?=\d*(?:;\d*)*m)/g, (string, number) => {
    if (number === "") {
      return "";
    }
    number = Number(number);
    if (
      number > 9 && number < 30 ||
      number === 38 ||
      number === 48 ||
      number > 49
    ) {
      return "";
    }
    if (number === 0) {
      return 0;
    }

    return mHTML[number];
  });
  string = string.replace(/\u001b\[;*0;*m/g, () => {
    let string1 = "";
    while ((string.match(/<span[^>]*>/g) || []).length !== (string1.match(/<\/span>/g) || []).length + (string.match(/<\/span>/g) || []).length) {
      string1 += "</span>";
    }
    
    return string1;
  });

  while ((string.match(/<span[^>]*>/g) || []).length !==
    (string.match(/<\/span[^>]*>/g) || []).length) {
    string += "</span>";
  }
  textarea.value = textarea.value.replace(/\u001b\[\d*[A-D]/g, "");

  return string.replace(/(?<=<span[^>]*>)[m;]/g, "").replace(/\u001b\[/g, "");
}

async function updateCommandCompletions(command) {
  const completionElement = document.querySelector(".command_completions");
  const searchBox = document.querySelector(".search_box");
  
  function complete(completions) {
    for (const completion of completions) {
      if (completion.split(" ").at(-1).includes(command.split(/ /).at(-1))) {
        const element = document.createElement("div");
        element.classList.add("command_completion");
        element.textContent = completion;
        element.onclick = () => {
          searchBox.value = searchBox.value.replace(/[^ ]*$/, completion.replace(/$\$/, "$$$$"));
          searchBox.focus();
        }
        completionElement.appendChild(element);
      }
    }
  }
  
  function syntaxHint(strings) {
    for (const string of strings) {
      const element = document.createElement("div");
      element.classList.add("command_syntax_hint");
      element.textContent = string;
      completionElement.appendChild(element);
    }
  }
  
  completionElement.innerHTML = "";
  if (/^\S*$/.test(command)) {
    complete(["download", "go", "m", "search", "terminal"]);
  } else {
    switch (command.split(/ /)[0]) {
      case "download":
        syntaxHint(["<name>"]);
        complete(Object.keys(downloads));
        syntaxHint(["download <name>"]);
        break;
      case "go":
        if (/ -$/.test(command)) {
          complete(["-w"]);
        } else {
          syntaxHint(["<url>"]);
        }
        syntaxHint(["go [-w] <url>"]);
        break;
      case "m":
        if (/ -$/.test(command)) {
          complete(["-n", "-u", "-d"]);
        } else if (/-d$/.test(command)) {
          complete(["-dn", "-du"]);
        } else if (/-[nu]$/.test(command)) {
          complete([command.split(/ /).at(-1) + "d"]);
        } else if (/ (?:-n|-u)? $/.test(command)) {
          syntaxHint(["<value>"]);
        }
        syntaxHint(["m -(n|u) <value>", "m -d(n|u)"]);
        break;
      case "search":
        syntaxHint(["[<query>]", "search [<query>]"]);
        break;
      case "terminal":
        updateCommandCompletions(command.split(/ /).slice(1).join(" "));
        syntaxHint(["terminal [<command>]"]);
    }
  }
}
updateCommandCompletions("");

function search(searchString) {
  document.querySelector(".search_box").value = searchString;
  if (searchString.trim() === "") {
    document.querySelector(".exit_search_button").classList.add("hidden");
  } else {
    document.querySelector(".exit_search_button").classList.remove("hidden");
  }
  let elements = document.querySelectorAll(".element");
  elements.forEach(element => element.classList.add("hidden"));
  Array.prototype.slice.call(elements).filter(element => {
    let array = searchString.split(/ /);
    let shouldUnhide = true;
    array.forEach(arrayElement => {
      if (!element.textContent.match(new RegExp("\\b" + arrayElement + "\\b", "i"))) {
        shouldUnhide = false;
      }
    });
    return shouldUnhide;
  }).forEach(element => element.classList.remove("hidden"));
}