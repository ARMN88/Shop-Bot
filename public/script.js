const socket = io();

const button = document.querySelector("button");
const authInput = document.querySelector("input");

const logDiv = document.querySelector(".log");

button.onclick = Submit;

authInput.onkeydown = e => {
  if(e.code !== "Enter") return;
  Submit();
}

function Submit() {
  if (!authInput.value) return;
  socket.emit('auth', authInput.value);
};

socket.on('authSuccess', () => {
  let successDiv = document.createElement("div");
  successDiv.classList.add("info");

  let successH3 = document.createElement("h3");
  successH3.appendChild(document.createTextNode("Successfully logged in!"));

  successDiv.appendChild(successH3);
  logDiv.insertBefore(successDiv, logDiv.firstChild);

  setTimeout(function() {
    window.location.href = "/"+authInput.value;
  }, 200);
});

socket.on('authError', () => {
  let errorDiv = document.createElement("div");
  errorDiv.classList.add("info");
  errorDiv.setAttribute("style", "background:#ff4242;");

  let errorH3 = document.createElement("h3");
  errorH3.appendChild(document.createTextNode("Error logging in."));

  errorDiv.appendChild(errorH3);
  logDiv.insertBefore(errorDiv, logDiv.firstChild);

  setTimeout(function() {
  errorDiv.setAttribute("style", "opacity:0");
  setTimeout(function() {
    errorDiv.remove();
  }, 1000);
  }, 1500);
});