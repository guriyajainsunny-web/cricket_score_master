const matchConfig=JSON.parse(localStorage.getItem("matchConfig"));

if(!matchConfig){
alert("Match not found");
location.href="scorer.html";
}

let innings=1;
let score=0;
let wickets=0;
let legalBalls=0;
let target=0;

let inningsEnded=false;
let scoringLocked=false;

let striker=matchConfig.striker;
let nonStriker=matchConfig.nonStriker;
let currentBowler=matchConfig.firstBowler;

let battingTeam=matchConfig.battingTeam;
let bowlingTeam=matchConfig.bowlingTeam;

let commentary=[];
let lastOverBalls=[];

let battingStats={};
let bowlingStats={};

const allPlayers=[
...matchConfig.team1Players,
...matchConfig.team2Players
];

allPlayers.forEach(player=>{


battingStats[player]={
    runs:0,
    balls:0,
    fours:0,
    sixes:0,
    dismissal:"Not Out"
};

bowlingStats[player]={
    balls:0,
    runs:0,
    wickets:0
};


});


function getOvers(){
return Math.floor(legalBalls/6)+"."+(legalBalls%6);
}

function getRunRate(){
if(legalBalls===0)return "0.00";
return (score/(legalBalls/6)).toFixed(2);
}

function loadMatchInfo(){


teamBat.textContent=battingTeam;
teamBowl.textContent=bowlingTeam;

matchName.textContent=
    matchConfig.matchName;

strikerName.textContent=
    striker+" ★";

nonStrikerName.textContent=
    nonStriker;

bowlerDisplay.textContent=
    currentBowler;


}
function updateScoreboard(){

    document.getElementById("scoreDisplay").textContent=
        score+"-"+wickets;

    document.getElementById("oversDisplay").textContent=
        getOvers()+" Overs";

    document.getElementById("runRate").textContent=
        "RR "+getRunRate();

    document.getElementById("strikerScore").textContent=
        battingStats[striker].runs+
        " ("+
        battingStats[striker].balls+
        ")";

    document.getElementById("nonStrikerScore").textContent=
        battingStats[nonStriker].runs+
        " ("+
        battingStats[nonStriker].balls+
        ")";

    document.getElementById("bowlerDisplay").textContent=
        currentBowler;

    document.getElementById("bowlerFigures").textContent=
        bowlingStats[currentBowler].wickets+
        "-" +
        bowlingStats[currentBowler].runs;
}

function addCommentary(text){


commentary.unshift(text);

if(commentary.length>20){
    commentary.pop();
}

commentaryBox.innerHTML=
    commentary.join("<br>");


}

function updateLastOver(){

lastOverDisplay.textContent=
    "Last 6 Balls : "+
    lastOverBalls.join(" ");


}
function rotateStrike(){

    let temp=striker;
    striker=nonStriker;
    nonStriker=temp;

    document.getElementById("strikerName").textContent=
        striker+" ★";

    document.getElementById("nonStrikerName").textContent=
        nonStriker;

    document.getElementById("strikerScore").textContent=
        battingStats[striker].runs+
        " ("+
        battingStats[striker].balls+
        ")";

    document.getElementById("nonStrikerScore").textContent=
        battingStats[nonStriker].runs+
        " ("+
        battingStats[nonStriker].balls+
        ")";
}


function addRuns(runs){

if(inningsEnded||scoringLocked){
    return;
}

score+=runs;
legalBalls++;

battingStats[striker].runs+=runs;
battingStats[striker].balls++;

bowlingStats[currentBowler].runs+=runs;
bowlingStats[currentBowler].balls++;

if(runs===4){
    battingStats[striker].fours++;
}

if(runs===6){
    battingStats[striker].sixes++;
}

lastOverBalls.push(runs);

if(lastOverBalls.length>6){
    lastOverBalls.shift();
}

addCommentary(
    getOvers()+" : "+
    striker+
    " scored "+
    runs
);

if(runs===1||runs===3||runs===5){
    rotateStrike();
}

if(legalBalls%6===0){

    rotateStrike();

}

updateLastOver();
updateScoreboard();
}

function addWide(){


if(inningsEnded||scoringLocked){
    return;
}

score++;

bowlingStats[currentBowler].runs++;

lastOverBalls.push("WD");

if(lastOverBalls.length>6){
    lastOverBalls.shift();
}

addCommentary(
    getOvers()+" : Wide Ball"
);

updateLastOver();
updateScoreboard();


}

function addNoBall(){

  
if(inningsEnded||scoringLocked){
    return;
}

score++;

bowlingStats[currentBowler].runs++;

lastOverBalls.push("NB");

if(lastOverBalls.length>6){
    lastOverBalls.shift();
}

addCommentary(
    getOvers()+" : No Ball"
);

updateLastOver();
updateScoreboard();
}

loadMatchInfo();
updateScoreboard();

addCommentary("Match Started");
