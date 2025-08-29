// Bancos y configuración
const BANKS = [
  "Banco General","BAC","Banco Nacional","Scotiabank","Global Bank",
  "Caja de Ahorros","Multibank","Banistmo","Davivienda","HSBC","Citibank",
  "BBVA","Santander","Banesco" // incluimos Banesco
];
const FINAL_WINNER = "Banesco";
const TOTAL_DURATION_MS = 7000; // 7 segundos
const MIN_INTERVAL_MS = 50;
const MAX_INTERVAL_MS = 400;

const $ = s => document.querySelector(s);
const nameEl = $("#bankName");
const startBtn = $("#startBtn");
const display = document.querySelector(".display");
const progressBar = $("#progressBar");
const winnerTag = $("#winnerTag");

let running = false;
let startTime = 0;
let tickTimeout = null;
let lastIndex = -1;

function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

function currentInterval(progress){
  const eased = easeOutCubic(progress);
  return MIN_INTERVAL_MS + (MAX_INTERVAL_MS - MIN_INTERVAL_MS) * eased;
}

function pickRandomBank(){
  let idx;
  do { idx = Math.floor(Math.random()*BANKS.length); }
  while(idx===lastIndex);
  lastIndex=idx;
  return BANKS[idx];
}

function spinTick(){
  if(!running) return;
  const elapsed = Date.now()-startTime;
  const progress = Math.min(1, elapsed/TOTAL_DURATION_MS);

  if(progress<1){
    nameEl.textContent = pickRandomBank();
    progressBar.style.width = `${progress*100}%`;
    tickTimeout=setTimeout(spinTick,currentInterval(progress));
  }else{
    finishWithWinner();
  }
}

function finishWithWinner(){
  running=false;
  clearTimeout(tickTimeout);
  // pequeño redoble
  nameEl.textContent="Banistmo";
  setTimeout(()=>{
    nameEl.textContent=FINAL_WINNER;
    display.classList.remove("spinning");
    display.classList.add("to-winner");
    startBtn.disabled=false;
    startBtn.textContent="Reiniciar";
  },500);
}

function resetUI(){
  display.classList.remove("to-winner");
  nameEl.textContent="—";
  progressBar.style.width="0%";
  winnerTag.style.opacity=0;
}

function startDraw(){
  if(running) return;
  resetUI();
  running=true;
  startBtn.disabled=true;
  startBtn.textContent="Seleccionando…";
  display.classList.add("spinning");
  startTime=Date.now();
  spinTick();
}

startBtn.addEventListener("click",()=>{
  if(!running && display.classList.contains("to-winner")) resetUI();
  startDraw();
});

resetUI();
