fetch("/api/latestLinuxVersion")
  .then(response => response.text())
  .then(version => document.querySelector("#linux-download").href = `./sterntyl-desktop_${version}_amd64.deb`);

fetch("/api/latestWindowsVersion")
  .then(response => response.text())
  .then(version => document.querySelector("#windows-download").href = `./sterntyl_${version}.7z`);