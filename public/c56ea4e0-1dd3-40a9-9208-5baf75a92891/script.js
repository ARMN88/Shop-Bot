eruda.init();
const socket = io();

const channelsDiv = document.querySelector(".channels");
const rolesDiv = document.querySelector(".roles");

window.onload = function() {
  socket.emit("get-data", location.pathname.replaceAll("/",""));
};

socket.on('server-data', data => {
  const { channels, roles, webhook } = data;
  
  for(let [channelName, channelId] of Object.entries(channels)) {
    if(!channelsDiv.querySelector("#"+channelName)) continue;
    channelsDiv.querySelector("#"+channelName).placeholder = channelId;
  }

  for(let [roleName, roleId] of Object.entries(roles)) {
    if(!rolesDiv.querySelector("#"+roleName)) continue;
    rolesDiv.querySelector("#"+roleName).placeholder = roleId;
  }

  if(!webhook) return;
  document.querySelector("#webhookURL").placeholder = webhook;
});