let firstInningsScore = 0;

let outPlayers = [];

let battingOrder = [];

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
battingOrder.push(striker);
battingOrder.push(nonStriker);

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

    if (innings === 1) {

        document.getElementById(
            "innings1Score"
        ).textContent =
            score + "-" + wickets +
            " (" + getOvers() + ")";

    } else {

        document.getElementById(
            "innings2Score"
        ).textContent =
            score + "-" + wickets +
            " (" + getOvers() + ")";

    }
}

function addCommentary(text) {

    commentary.unshift(text);

    document.getElementById("commentaryBox").innerHTML =
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

    if (
        wickets === 10
    ) {

        endInnings();

    }
    if (
        legalBalls >= matchConfig.overs * 6
    ) {

        endInnings();

    }
    else if (legalBalls % 6 === 0) {

        rotateStrike();

        addCommentary(
            "---- Over Completed ----"
        );

        overCompleted();

    }

    updateLastOver();
    updateScoreboard();
    updateBattingTable();
    updateBowlingTable();
    updateChaseInfo();
    checkResult();
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

    battingOrder.forEach(player => {

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

        if (
            player !== currentBowler &&
            s.balls === 0 &&
            s.runs === 0 &&
            s.wickets === 0
        ) {
            return;
        }

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

loadMatchInfo();
updateScoreboard();

addCommentary("Match Started");

function showInnings(no) {

    document.getElementById("innings1Content").style.display =
        no === 1 ? "block" : "none";

    document.getElementById("innings2Content").style.display =
        no === 2 ? "block" : "none";
}

function wicket() {

    if (inningsEnded || scoringLocked) {
        return;
    }

    scoringLocked = true;

    document.getElementById("wicketPanel").style.display = "block";

    let fielderSelect = document.getElementById("fielderSelect");
    let newBatsmanSelect = document.getElementById("newBatsmanSelect");

    fielderSelect.innerHTML = "";
    newBatsmanSelect.innerHTML = "";

    let fielders =
        bowlingTeam === matchConfig.team1
            ? matchConfig.team1Players
            : matchConfig.team2Players;

    fielders.forEach(player => {

        fielderSelect.innerHTML +=
            `<option value="${player}">${player}</option>`;

    });

    let batters =
        battingTeam === matchConfig.team1
            ? matchConfig.team1Players
            : matchConfig.team2Players;

    batters.forEach(player => {

        if (
            player !== striker &&
            player !== nonStriker &&
            !outPlayers.includes(player)
        ) {

            newBatsmanSelect.innerHTML +=
                `<option value="${player}">${player}</option>`;
        }

    });

}

function wicketTypeChanged() {

    let type =
        document.getElementById("wicketType").value;

    if (type === "Bowled" || type === "LBW") {

        document.getElementById("fielderSelect")
            .style.display = "none";

    } else {

        document.getElementById("fielderSelect")
            .style.display = "block";

    }

}

function confirmWicket() {

    let type =
        document.getElementById("wicketType").value;

    let fielder =
        document.getElementById("fielderSelect").value;

    let newBatsman =
        document.getElementById("newBatsmanSelect").value;

    if (type === "") {
        alert("Select wicket type");
        return;
    }

    wickets++;
    legalBalls++;

    lastOverBalls.push("W");

    if (lastOverBalls.length > 6) {
        lastOverBalls.shift();
    }

    if (
        wickets !== 10 &&
        legalBalls % 6 === 0
    ) {

        rotateStrike();

        addCommentary(
            "---- Over Completed ----"
        );

        overCompleted();

    }

    battingStats[striker].balls++;

    bowlingStats[currentBowler].balls++;
    bowlingStats[currentBowler].wickets++;

    let dismissal = "";

    if (type === "Bowled") {
        dismissal = "b " + currentBowler;
    }

    if (type === "LBW") {
        dismissal = "lbw b " + currentBowler;
    }

    if (type === "Caught") {
        dismissal =
            "c " + fielder +
            " b " + currentBowler;
    }

    if (type === "Run Out") {
        dismissal =
            "run out (" + fielder + ")";
    }

    if (type === "Stumped") {

        let keeper =
            bowlingTeam === matchConfig.team1
                ? matchConfig.team1WK
                : matchConfig.team2WK;

        dismissal =
            "st " + keeper +
            " b " + currentBowler;
    }
    outPlayers.push(striker);

    battingStats[striker].dismissal =
        dismissal;

    addCommentary(
        getOvers() +
        " : WICKET - " +
        striker
    );

    document.getElementById("wicketPanel").style.display =
        "none";

    updateLastOver();
    updateScoreboard();
    updateBattingTable();
    updateBowlingTable();

    if (innings === 1 && wickets >= 10) {

        scoringLocked = false;
        endInnings();
        return;

    }

    striker = newBatsman;

    battingOrder.push(newBatsman);

    document.getElementById("strikerName").textContent =
        striker + " ★";

    scoringLocked = false;

    updateScoreboard();
    updateBattingTable();

    updateChaseInfo();
    checkResult();
}

function overCompleted() {

    scoringLocked = true;

    document.getElementById(
        "newBowlerPanel"
    ).style.display = "block";

    let select =
        document.getElementById(
            "newBowlerSelect"
        );

    select.innerHTML = "";

    let bowlers =
        bowlingTeam === matchConfig.team1
            ? matchConfig.team1Players
            : matchConfig.team2Players;

    bowlers.forEach(player => {

        if (player !== currentBowler) {

            select.innerHTML +=
                `<option value="${player}">
                ${player}
            </option>`;

        }

    });

}

function confirmBowler() {

    currentBowler =
        document.getElementById(
            "newBowlerSelect"
        ).value;

    document.getElementById(
        "newBowlerPanel"
    ).style.display = "none";

    scoringLocked = false;

    updateScoreboard();

}

function endInnings() {

    if (innings === 2) {
        return;
    }
    inningsEnded = true;

    scoringLocked = true;

    document.getElementById("wicketPanel").style.display = "none";
    document.getElementById("newBowlerPanel").style.display = "none";

    firstInningsScore = score;

    target = score + 1;

    addCommentary("🏏 End of 1st Innings");

    document.getElementById(
        "targetDisplay"
    ).textContent =
        "Target : " + target;

    loadSecondInningsPlayers();

    document.getElementById(
        "secondInningsPanel"
    ).style.display = "block";


}

function loadSecondInningsPlayers() {

    let strikerSelect =
        document.getElementById(
            "secondStriker"
        );

    let nonStrikerSelect =
        document.getElementById(
            "secondNonStriker"
        );

    let bowlerSelect =
        document.getElementById(
            "secondBowler"
        );

    strikerSelect.innerHTML = "";
    nonStrikerSelect.innerHTML = "";
    bowlerSelect.innerHTML = "";

    let batters =
        battingTeam === matchConfig.team1
            ? matchConfig.team2Players
            : matchConfig.team1Players;

    let bowlers =
        battingTeam === matchConfig.team1
            ? matchConfig.team1Players
            : matchConfig.team2Players;
    batters.forEach(player => {

        strikerSelect.innerHTML +=
            `<option value="${player}">
            ${player}
        </option>`;

        nonStrikerSelect.innerHTML +=
            `<option value="${player}">
            ${player}
        </option>`;

    });

    bowlers.forEach(player => {

        bowlerSelect.innerHTML +=
            `<option value="${player}">
            ${player}
        </option>`;

    });

}

function startSecondInnings() {

    score = 0;
    wickets = 0;
    legalBalls = 0;

    inningsEnded = false;

    scoringLocked = false;

    battingStats = {};
    bowlingStats = {};

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

    battingTeam =
        battingTeam === matchConfig.team1
            ? matchConfig.team2
            : matchConfig.team1;

    bowlingTeam =
        bowlingTeam === matchConfig.team1
            ? matchConfig.team2
            : matchConfig.team1;

    striker =
        document.getElementById(
            "secondStriker"
        ).value;

    nonStriker =
        document.getElementById(
            "secondNonStriker"
        ).value;

    if (striker === nonStriker) {

        alert(
            "Striker and Non-Striker cannot be same"
        );

        return;
    }

    innings = 2;
    outPlayers = [];
    battingOrder = [];
    lastOverBalls = [];

    currentBowler =
        document.getElementById(
            "secondBowler"
        ).value;

    battingOrder.push(striker);
    battingOrder.push(nonStriker);

    document.getElementById(
        "secondInningsPanel"
    ).style.display = "none";

    document.getElementById(
        "secondInningsInfo"
    ).style.display = "block";

    showInnings(2);

    document.querySelector(
        "#battingTable tbody"
    ).innerHTML = "";

    document.querySelector(
        "#bowlingTable tbody"
    ).innerHTML = "";

    loadMatchInfo();
    updateScoreboard();

    document.getElementById(
        "inningsDisplay"
    ).textContent =
        "2nd Innings";

    updateBattingTable();
    updateBowlingTable();
    updateChaseInfo();
    updateLastOver();
    updateScoreboard();
    addCommentary("🏏 2nd Innings Started");
}

function updateChaseInfo() {

    if (innings !== 2) {
        return;
    }
    let runsNeeded =
        Math.max(
            0,
            target - score
        );

    let ballsLeft =
        (matchConfig.overs * 6)
        - legalBalls;

    let rrr =
        ballsLeft > 0
            ? ((runsNeeded * 6) / ballsLeft)
                .toFixed(2)
            : "0.00";

    document.getElementById(
        "needDisplay"
    ).textContent =
        "Need " + runsNeeded +
        " from " + ballsLeft;

    document.getElementById(
        "rrrDisplay"
    ).textContent =
        "RRR " + rrr;

}

function checkResult() {

    if (innings !== 2) {
        return;
    }

    if (score >= target) {

        document.getElementById(
            "resultCard"
        ).style.display = "block";

        document.getElementById(
            "resultDisplay"
        ).textContent =
            battingTeam +
            " won by " +
            (10 - wickets) +
            " wickets";

        inningsEnded = true;
        scoringLocked = true;

        document.getElementById(
            "wicketPanel"
        ).style.display = "none";

        document.getElementById(
            "newBowlerPanel"
        ).style.display = "none";

        document.getElementById(
            "secondInningsPanel"
        ).style.display = "none";
    }
    if (
        legalBalls >= matchConfig.overs * 6
        || wickets === 10
    ) {
        if (score === firstInningsScore) {

            document.getElementById(
                "resultCard"
            ).style.display = "block";

            document.getElementById(
                "resultDisplay"
            ).textContent =
                "Match Tied";

            inningsEnded = true;
            scoringLocked = true;

            return;
        }
        if (score < target) {

            document.getElementById(
                "resultCard"
            ).style.display = "block";

            document.getElementById(
                "resultDisplay"
            ).textContent =
                bowlingTeam +
                " won by " +
                (target - score - 1) +
                " runs";

            inningsEnded = true;
            scoringLocked = true;

            document.getElementById(
                "wicketPanel"
            ).style.display = "none";

            document.getElementById(
                "newBowlerPanel"
            ).style.display = "none";

            document.getElementById(
                "secondInningsPanel"
            ).style.display = "none";
        }
    }

}

