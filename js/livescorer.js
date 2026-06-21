const matchConfig = JSON.parse(localStorage.getItem("matchConfig"));

if (!matchConfig) {
    alert("Match not found");
    location.href = "scorer.html";
}

let innings = 1;
let score = 0;
let wickets = 0;
let legalBalls = 0;
let target = 0;

let inningsEnded = false;
let scoringLocked = false;

let striker = matchConfig.striker;
let nonStriker = matchConfig.nonStriker;
let currentBowler = matchConfig.firstBowler;

let battingTeam = matchConfig.battingTeam;
let bowlingTeam = matchConfig.bowlingTeam;

let commentary = [];
let lastOverBalls = [];

let battingStats = {};
let bowlingStats = {};

const allPlayers = [
    ...matchConfig.team1Players,
    ...matchConfig.team2Players
];

allPlayers.forEach(player => {


    battingStats[player] = {
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        dismissal: "Not Out"
    };

    bowlingStats[player] = {
        balls: 0,
        runs: 0,
        wickets: 0
    };


});


function getOvers() {
    return Math.floor(legalBalls / 6) + "." + (legalBalls % 6);
}

function getRunRate() {
    if (legalBalls === 0) return "0.00";
    return (score / (legalBalls / 6)).toFixed(2);
}

function loadMatchInfo() {


    document.getElementById("teamBat").textContent =
        battingTeam;

    document.getElementById("teamBowl").textContent =
        bowlingTeam;

    document.getElementById("matchName").textContent =
        matchConfig.matchName;

    document.getElementById("strikerName").textContent =
        striker + " ★";

    document.getElementById("nonStrikerName").textContent =
        nonStriker;

    document.getElementById("bowlerDisplay").textContent =
        currentBowler;


}

function updateScoreboard() {

    document.getElementById("scoreDisplay").textContent =
        score + "-" + wickets;

    document.getElementById("oversDisplay").textContent =
        getOvers() + " Overs";

    document.getElementById("runRate").textContent =
        "RR " + getRunRate();

    document.getElementById("strikerScore").textContent =
        battingStats[striker].runs +
        " (" +
        battingStats[striker].balls +
        ")";

    document.getElementById("nonStrikerScore").textContent =
        battingStats[nonStriker].runs +
        " (" +
        battingStats[nonStriker].balls +
        ")";

    document.getElementById("bowlerDisplay").textContent =
        currentBowler;

    document.getElementById("bowlerFigures").textContent =
        bowlingStats[currentBowler].wickets +
        "-" +
        bowlingStats[currentBowler].runs;
}

function addCommentary(text) {


    commentary.unshift(text);

    if (commentary.length > 20) {
        commentary.pop();
    }

    commentaryBox.innerHTML =
        commentary.join("<br>");


}

function updateLastOver() {

    lastOverDisplay.textContent =
        "Last 6 Balls : " +
        lastOverBalls.join(" ");


}
function rotateStrike() {

    let temp = striker;
    striker = nonStriker;
    nonStriker = temp;

    document.getElementById("strikerName").textContent =
        striker + " ★";

    document.getElementById("nonStrikerName").textContent =
        nonStriker;

    document.getElementById("strikerScore").textContent =
        battingStats[striker].runs +
        " (" +
        battingStats[striker].balls +
        ")";

    document.getElementById("nonStrikerScore").textContent =
        battingStats[nonStriker].runs +
        " (" +
        battingStats[nonStriker].balls +
        ")";
}


function addRuns(runs) {

    if (inningsEnded || scoringLocked) {
        return;
    }

    score += runs;
    legalBalls++;

    battingStats[striker].runs += runs;
    battingStats[striker].balls++;

    bowlingStats[currentBowler].runs += runs;
    bowlingStats[currentBowler].balls++;

    if (runs === 4) {
        battingStats[striker].fours++;
    }

    if (runs === 6) {
        battingStats[striker].sixes++;
    }

    lastOverBalls.push(runs);

    if (lastOverBalls.length > 6) {
        lastOverBalls.shift();
    }

    addCommentary(
        getOvers() + " : " +
        striker +
        " scored " +
        runs
    );

    if (runs === 1 || runs === 3 || runs === 5) {
        rotateStrike();
    }

    if (legalBalls % 6 === 0) {

        rotateStrike();

    }

    updateLastOver();
    updateScoreboard();
    updateBattingTable();
    updateBowlingTable();
}

function addWide() {


    if (inningsEnded || scoringLocked) {
        return;
    }

    score++;

    bowlingStats[currentBowler].runs++;

    lastOverBalls.push("WD");

    if (lastOverBalls.length > 6) {
        lastOverBalls.shift();
    }

    addCommentary(
        getOvers() + " : Wide Ball"
    );

    updateLastOver();
    updateScoreboard();
    updateBattingTable();
    updateBowlingTable();
}

function addNoBall() {


    if (inningsEnded || scoringLocked) {
        return;
    }

    score++;

    bowlingStats[currentBowler].runs++;

    lastOverBalls.push("NB");

    if (lastOverBalls.length > 6) {
        lastOverBalls.shift();
    }

    addCommentary(
        getOvers() + " : No Ball"
    );

    updateLastOver();
    updateScoreboard();
    updateBattingTable();
    updateBowlingTable();
}

function updateBattingTable() {


    const table = innings === 1
        ? document.querySelector("#innings1BattingTable tbody")
        : document.querySelector("#battingTable tbody");

    table.innerHTML = "";

    Object.keys(battingStats).forEach(player => {

        const s = battingStats[player];

        if (s.runs === 0 && s.balls === 0) return;

        const sr = s.balls === 0
            ? "0.00"
            : ((s.runs / s.balls) * 100).toFixed(2);

        table.innerHTML += `
    <tr>
        <td>${player}</td>
        <td>${s.dismissal}</td>
        <td>${s.runs}</td>
        <td>${s.balls}</td>
        <td>${s.fours}</td>
        <td>${s.sixes}</td>
        <td>${sr}</td>
    </tr>`;
    });


}

function updateBowlingTable() {


    const table = innings === 1
        ? document.querySelector("#innings1BowlingTable tbody")
        : document.querySelector("#bowlingTable tbody");

    table.innerHTML = "";

    Object.keys(bowlingStats).forEach(player => {

        const s = bowlingStats[player];

        if (s.balls === 0 && s.runs === 0) return;

        const overs =
            Math.floor(s.balls / 6) + "." + (s.balls % 6);

        const eco = s.balls === 0
            ? "0.00"
            : (s.runs / (s.balls / 6)).toFixed(2);

        table.innerHTML += `
    <tr>
        <td>${player}</td>
        <td>${overs}</td>
        <td>${s.runs}</td>
        <td>${s.wickets}</td>
        <td>${eco}</td>
    </tr>`;
    });


}

function showInnings(no) {


    document.getElementById("innings1Content").style.display =
        no === 1 ? "block" : "none";

    document.getElementById("innings2Content").style.display =
        no === 2 ? "block" : "none";


}


loadMatchInfo();
updateScoreboard();

addCommentary("Match Started");

function showInnings(no) {

    document.getElementById("innings1Content").style.display =
        no === 1 ? "block" : "none";

    document.getElementById("innings2Content").style.display =
        no === 2 ? "block" : "none";
}

