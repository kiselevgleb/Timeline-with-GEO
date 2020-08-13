const div = document.getElementById('div');
const btn = document.getElementById('btn');
const inp = document.getElementById('inp');
const note = document.getElementById('note');
const tab = document.getElementById('tab-chat');
const mic = document.getElementById('butSendMic');
const vid = document.getElementById('butSendVid');
const winLoc = document.getElementById('locationTap');
const canсel = document.getElementById('canсel');
const ok = document.getElementById('ok');
const loc = document.getElementById('loc');
const er = document.getElementById('erInp');
const butOk = document.getElementById('butOk');
const sec = document.getElementById('sec');
const butClose = document.getElementById('butClose');


let position;

vid.addEventListener('click', () => {
  video();
});

mic.addEventListener('click', () => {
  audio();
});

inp.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    let mes = inp.value;
    if (mes.length > 0) {
      console.log(position);
      if (position !== undefined) {
        const tr = document.createElement('tr');
        tr.innerText = mes;
        inp.value = "";
        tab.appendChild(tr);
        setDateAndLoc();
      } else {
        winSetPos();
      }
    }
  }
});

function winSetPos() {
  let mes = inp.value;
  winLoc.style.display = "block";
  canсel.addEventListener('click', () => {
    winLoc.style.display = "none";
  });
  ok.addEventListener('click', () => {
    if (loc.value.length > 0 && valid(loc.value)) {
      const tr = document.createElement('tr');
      tr.innerText = mes;
      inp.value = "";
      tab.appendChild(tr);
      setDateAndLoc(loc.value);
      winLoc.style.display = "none";
      loc.value = "";
    } else {
      er.innerText = "Error: Uncorrect input";
      setTimeout(() => {
        er.innerText = "";
      }, 2000);
    }
  });
}

function valid(params) {
  return params.search(/\w\.\w+,+[ ,−]+\w+\.\w+/) !== -1;
}

function setDateAndLoc(val) {
  const trDate = document.createElement('tr');
  trDate.innerText = getDate();
  trDate.style.fontSize = "12px";
  const trLoc = document.createElement('tr');
  if (position !== undefined) {
    trLoc.innerText = `[${position.latitude}, ${position.longitude}]`;
  } else {
    if (valid(val)) {
      trLoc.innerText = val;
    }
  }
  trLoc.style.fontSize = "12px";
  tab.appendChild(trDate);
  tab.appendChild(trLoc);
}

function getDate() {
  let date = new Date;
  return date.toISOString().split('T')[0] + " " + date.getHours() + ":" + date.getMinutes();
}

var options = {
  enableHighAccuracy: true,
  timeout: 500,
  maximumAge: 0
};

function getLocation(pos) {
  position = pos.coords;
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

function display() {
  mic.style.display = "inline";
  vid.style.display = "inline";
  inp.style.display = "inline";
  butOk.style.display = "none";
  sec.style.display = "none";
  sec.innerText = "";
  butClose.style.display = "none";
}

function undisplay() {
  mic.style.display = "none";
  vid.style.display = "none";
  inp.style.display = "none";
  butOk.style.display = "inline";
  sec.style.display = "inline";
  sec.innerText = "00:00";
  butClose.style.display = "inline";
}

let boo = true;

async function audio() {
  undisplay();
  const audio = document.createElement('audio');
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  const recorder = new MediaRecorder(stream);
  const chunks = [];
  recorder.addEventListener('start', (evt) => {
    console.log('recording started');
  });
  recorder.addEventListener("dataavailable", (evt) => {
    console.log('data available');
    chunks.push(evt.data);
  });
  recorder.addEventListener('stop', (evt) => {
    if (boo) {
      console.log('recording stopped');
      const blob = new Blob(chunks);
      audio.src = URL.createObjectURL(blob);
      audio.controls = true;
      audio.classList.add("audio");
      tab.appendChild(audio);
      if (position !== undefined) {
        setDateAndLoc();
      } else {
        winSetPos();
      }
    }
  });
  recorder.start();
  butOk.addEventListener('click', () => {
    boo = true;
    recorder.stop();
    stream.getTracks().forEach(track => track.stop());
    display();
  });
  butClose.addEventListener('click', () => {
    boo = false;
    recorder.stop();
    stream.getTracks().forEach(track => track.stop());
    display();
  });
}
async function video() {
  undisplay();
  const video = document.createElement('video');
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  const recorder = new MediaRecorder(stream);
  const chunks = [];
  recorder.addEventListener('start', (evt) => {
    console.log('recording started');
  });
  recorder.addEventListener("dataavailable", (evt) => {
    console.log('data available');
    chunks.push(evt.data);
  });
  recorder.addEventListener('stop', (evt) => {
    if (boo) {
      console.log('recording stopped');
      const blob = new Blob(chunks);
      video.src = URL.createObjectURL(blob);
      video.controls = true;
      video.classList.add("video");
      tab.appendChild(video);
      if (position !== undefined) {
        setDateAndLoc();
      } else {
        winSetPos();
      }
    }
  });
  recorder.start();
  butOk.addEventListener('click', () => {
    boo = true;
    recorder.stop();
    stream.getTracks().forEach(track => track.stop());
    display();
  });
  butClose.addEventListener('click', () => {
    boo = false;
    recorder.stop();
    stream.getTracks().forEach(track => track.stop());
    display();
  });
}
navigator.geolocation.getCurrentPosition(getLocation, error, options);
