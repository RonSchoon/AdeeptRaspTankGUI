/* BSD 3-Clause License

Copyright (c) 2022, silorenz (Simon Lorenz)
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/

var connected = false;
var ws = null;

var videoStreamIndex = 0;

var initializedConnect = false;
var defaultSpeedValue = 50;

////////////////////////
// WebSocket Connection
function WebSocketConnect() {

    if ("WebSocket" in window) {
        //alert("WebSocket is supported by your Browser!");

        // open the web socket
        ws = new WebSocket("ws://" + location.hostname + ":8888");

        ws.onopen = function () {

            // web socket connected, "authenticate" ;-) by sending user and password via web socket send()
            ws.send("admin:123456");
            connected = true;
            var status = document.getElementById("statusLine")
            status.innerHTML = "Connected";
            status.style.color = "#fdfdfd";
            document.getElementById("videoStream").src = 'http://' + location.hostname + ':5000/video_feed?rand=' + videoStreamIndex++;
            if (initializedConnect == false) {
                initializedConnect = true;
                runAfterFirstConnect();     // do some things as a first init, let's believe we are alone ;-)
            }
        };

        ws.onmessage = function (evt) {
            handleReceivedMsg(evt.data)     // robot sent us a message, let's handle it
        };

        ws.onclose = function () {
            // websocket is closed
            console.log("Connection is closed...");
            connected = false;
            var status = document.getElementById("statusLine")
            status.innerHTML = "Disconnected";
            status.style.color = 'red';
        };
    } else {

        // the browser doesn't support WebSocket
        alert("WebSocket is NOT supported by your Browser!");
        connected = false;
    }
}

function handleReceivedMsg(received_msg) {
    console.log("Message received..." + received_msg);

    var recvData = null;
    try {
        recvData = JSON.parse(received_msg);
    } catch (e) {
        console.log(e);
        return;
    }

    if ('get_info' === recvData.title) {
        setRobotStatus(recvData.data);
    }
}

function ensureConnected() {
    //return false;
    if (ws == null || connected == false) {
        WebSocketConnect();
    }
    return !(ws == null || connected == false);
}


///////////////////
// Action Handlers

// drive control
function runDCForward() {
    ensureConnectedAndSend("\"forward\"");
}
function stopDCForward() {
    ensureConnectedAndSend("\"DS\"");
}

function runDCBackward() {
    ensureConnectedAndSend("\"backward\"");
}
function stopDCBackward() {
    ensureConnectedAndSend("\"DS\"");
}
function runDCLeft() {
    ensureConnectedAndSend("\"left\"");
}
function stopDCLeft() {
    ensureConnectedAndSend("\"TS\"");
}

function runDCRight() {
    ensureConnectedAndSend("\"right\"");
}
function stopDCRight() {
    ensureConnectedAndSend("\"TS\"");
}

function stopDCRun() {
    ensureConnectedAndSend("\"DS\"");
    ensureConnectedAndSend("\"TS\"");
}

function speedChange(speedValue) {
    ensureConnectedAndSend("\"wsB " + speedValue + "\"");
}


// arm control
function runAGrab() {
    ensureConnectedAndSend("\"grab\"");
}
function stopAGrab() {
    ensureConnectedAndSend("\"stop\"");
}

function runALoose() {
    ensureConnectedAndSend("\"loose\"");
}
function stopALoose() {
    ensureConnectedAndSend("\"stop\"");
}

function runALeft() {
    ensureConnectedAndSend("\"lookleft\"");
}
function stopALeft() {
    ensureConnectedAndSend("\"LRstop\"");
}

function runARight() {
    ensureConnectedAndSend("\"lookright\"");
}
function stopARight() {
    ensureConnectedAndSend("\"LRstop\"");
}

function runAHandUp() {
    ensureConnectedAndSend("\"forearmup\"");
}
function stopAHandUp() {
    ensureConnectedAndSend("\"FAstop\"");
}

function runAHandDown() {
    ensureConnectedAndSend("\"forearmdown\"");
}
function stopAHandDown() {
    ensureConnectedAndSend("\"FAstop\"");
}

function runAArmUp() {
    ensureConnectedAndSend("\"armup\"");
}
function stopAArmUp() {
    ensureConnectedAndSend("\"ARstop\"");
}

function runAArmDown() {
    ensureConnectedAndSend("\"armdown\"");
}
function stopAArmDown() {
    ensureConnectedAndSend("\"ARstop\"");
}

function runAUp() {
    ensureConnectedAndSend("\"handup\"");
}
function stopAUp() {
    ensureConnectedAndSend("\"HAstop\"");
}

function runADown() {
    ensureConnectedAndSend("\"handdown\"");
}
function stopADown() {
    ensureConnectedAndSend("\"HAstop\"");
}

function runRCamUp() {
    ensureConnectedAndSend("\"up\"");
}
function stopRCamUp() {
    ensureConnectedAndSend("\"UDstop\"");
}

function runRCamDown() {
    ensureConnectedAndSend("\"down\"");
}
function stopRCamDown() {
    ensureConnectedAndSend("\"UDstop\"");
}

function runAHome() {
    ensureConnectedAndSend("\"home\"");
}


// robot status
function getRobotStatus() {
    ensureConnectedAndSend("\"get_info\"");
}

function setRobotStatus(statusData) {
    // Sample for get_info: "{"status": "ok", "title": "get_info", "data": ["45.3", "16.5", "4.3"]}"
    setRobotStatusColor("CPUTemp", statusData[0], " °C", 55, 70);
    setRobotStatusColor("CPUUsage", statusData[1], " %", 70, 85);
    setRobotStatusColor("RAMUsage", statusData[2], " %", 70, 85);
}

function setRobotStatusColor(id, number, unit, med, high) {
    element = document.getElementById(id);
    element.innerHTML = number + unit;
    if (number < med)
        element.style.color = "#101010";
    else if (number < high)
        element.style.color = "orange";
    else
        element.style.color = "red";
}


///////////
// Helpers
// adds left mouse button down and up handlers for given html button ids
// function... provides the funtion to call. If null, no handler will be added for this mouse event
function addEventListenerDownUp(id, functionDown, functionUp) {
    let element = document.getElementById(id);
    if (element !== null) {
        if (isTouchEnabled()) {
            if (functionDown !== null) {
                element.addEventListener("touchstart", function() {
                    functionDown();
                });
            }
            if (functionUp !== null) {
                element.addEventListener("touchend", function() {
                    functionUp();
                });
            }
        } else {
            if (functionDown !== null) {
                element.addEventListener("mousedown", event => {
                    if (event.button == 0) {
                        functionDown();
                    }
                });
            }
            if (functionUp !== null) {
                element.addEventListener("mouseup", event => {
                    if (event.button == 0) {
                        functionUp();
                    }
                });
            }
        }
    } else {
        alert("Please check your html page. There is no element with id: " + id + "! Any typo?");
    }
}

function isTouchEnabled() {
    return ( 'ontouchstart' in window );
}

// first ensure we are connected. If yes, send the provided data
function ensureConnectedAndSend(toSend) {
    if (ensureConnected()) {
        ws.send(toSend);
    }
}


////////////////
// Init Section
function initButtons() {

    // drive control
    addEventListenerDownUp('btnDCForward', runDCForward, stopDCForward);
    addEventListenerDownUp('btnDCBackward', runDCBackward, stopDCBackward);
    addEventListenerDownUp('btnDCLeft', runDCLeft, stopDCLeft);
    addEventListenerDownUp('btnDCRight', runDCRight, stopDCRight);
    addEventListenerDownUp('btnDCStop', stopDCRun, null);

    // arm control
    addEventListenerDownUp('btnAGrab', runAGrab, stopAGrab);
    addEventListenerDownUp('btnALoose', runALoose, stopALoose);
    addEventListenerDownUp('btnALeft', runALeft, stopALeft);
    addEventListenerDownUp('btnARight', runARight, stopARight);
    addEventListenerDownUp('btnAHandUp', runAHandUp, stopAHandUp);
    addEventListenerDownUp('btnAHandDown', runAHandDown, stopAHandDown);
    addEventListenerDownUp('btnAArmUp', runAArmUp, stopAArmUp);
    addEventListenerDownUp('btnAArmDown', runAArmDown, stopAArmDown);
    addEventListenerDownUp('btnAUp', runAUp, stopAUp);
    addEventListenerDownUp('btnADown', runADown, stopADown);
    addEventListenerDownUp('btnAHome', runAHome, null);

    // camera
    addEventListenerDownUp('btnRCamUp', runRCamUp, stopRCamUp);
    addEventListenerDownUp('btnRCamDown', runRCamDown, stopRCamDown);
}

function runAfterFirstConnect() {
    // reduce speed to 50
    var rangeSpeed = document.getElementById("rangeDCSpeed");
    rangeSpeed.value = defaultSpeedValue;

    // get robot status
    getRobotStatus();
}

window.onload = function initAll() {
    // run the following once the webpage fully loaded
    initButtons();                        // add mouse event handlers
    WebSocketConnect();                   // connect to the robot
    setInterval(getRobotStatus, 5000);    // request robot status every 5 secs.
}
