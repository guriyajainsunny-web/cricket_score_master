// ==========================
// LOAD MATCH DATA
// ==========================

const match = JSON.parse(
    localStorage.getItem("matchConfig")
);




if (!match) {


    alert("No Match Found");

    window.location.href =
        "SCORER.html";


}

// ==========================
// MATCH STATE
// ==========================

const matchState = {


    innings: 1,

    score: 0,

    wickets: 0,

    balls: 0,

    battingTeam:
        match.battingTeam,

    bowlingTeam:
        match.bowlingTeam,

    striker:
        match.striker,

    nonStriker:
        match.nonStriker,

    currentBowler:
        match.firstBowler,

    overHistory: []


};

// ==========================
// PLAYER LISTS
// ==========================

const battingPlayers =


    match.battingTeam === match.team1

        ? [...match.team1Players]

        : [...match.team2Players];

const batsmenUsed = [

    match.striker,

    match.nonStriker

];

const bowlersUsed = [

    match.firstBowler

];


const bowlingPlayers =


    match.bowlingTeam === match.team1

        ? [...match.team1Players]

        : [...match.team2Players];


// ==========================
// BATTING STATS
// ==========================

const battingStats = {};

battingPlayers.forEach(player => {


    battingStats[player] = {

        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        dismissal: "Not Out"

    };


});

// ==========================
// BOWLING STATS
// ==========================

const bowlingStats = {};

bowlingPlayers.forEach(player => {


    bowlingStats[player] = {

        balls: 0,
        maidens: 0,
        runs: 0,
        wickets: 0

    };


});

// ==========================
// EXTRAS
// ==========================

const extras = {


    wides: 0,
    noBalls: 0,
    byes: 0,
    legByes: 0


};

// ==========================
// PARTNERSHIP
// ==========================

let partnershipRuns = 0;
let partnershipBalls = 0;

// ==========================
// FALL OF WICKETS
// ==========================

const fallOfWickets = [];

// ==========================
// BALL HISTORY
// ==========================

const ballHistory = [];

let overBreak = false;

// ==========================
// LOAD SCOREBOARD
// ==========================

function loadScoreboard() {


    document.getElementById(
        "teamBat"
    ).textContent =
        matchState.battingTeam;

    document.getElementById(
        "teamBowl"
    ).textContent =
        matchState.bowlingTeam;

    document.getElementById(
        "matchName"
    ).textContent =
        match.matchName;

    document.getElementById(
        "strikerName"
    ).textContent =
        matchState.striker + " ★";

    document.getElementById(
        "nonStrikerName"
    ).textContent =
        matchState.nonStriker;

    document.getElementById(
        "strikerScore"
    ).textContent =
        "0 (0)";

    document.getElementById(
        "nonStrikerScore"
    ).textContent =
        "0 (0)";

    document.getElementById(
        "bowlerDisplay"
    ).innerHTML =
        `<strong>${matchState.currentBowler}</strong><br>0-0 (0.0)`;


}

// ==========================
// UPDATE SCOREBOARD
// ==========================

function updateScoreboard() {


    document.getElementById(
        "scoreDisplay"
    ).textContent =
        matchState.score +
        "-" +
        matchState.wickets;

    document.getElementById(
        "oversDisplay"
    ).textContent =
        Math.floor(
            matchState.balls / 6
        ) +
        "." +
        (
            matchState.balls % 6
        ) +
        " Overs";

    let rr = 0;

    if (
        matchState.balls > 0
    ) {

        rr =
            matchState.score /
            (
                matchState.balls / 6
            );
    }

    document.getElementById(
        "runRate"
    ).textContent =
        "RR " +
        rr.toFixed(2);


}

// ==========================
// SAVE MATCH
// ==========================

function saveMatch() {


    localStorage.setItem(

        "liveMatch",

        JSON.stringify({

            matchState,
            battingStats,
            bowlingStats,
            extras,
            partnershipRuns,
            partnershipBalls,
            fallOfWickets,
            ballHistory

        })

    );


}

// ==========================
// START PAGE
// ==========================

loadScoreboard();

updateScoreboard();

updateBattingTable();

updateCurrentBowlerDisplay();

updateBowlingTable();

overBreak = false;

toggleScoringButtons(false);

saveMatch();

console.log(
    "Stage 1 Loaded Successfully"
);

// ==========================
// THIS OVER
// ==========================

function renderThisOver() {

    const lastSix =
        matchState.overHistory
            .slice(-6);

    document.getElementById(
        "lastOverDisplay"
    ).innerHTML =

        "Last Over : " + lastSix.join(" ");
}

// ==========================
// ADD RUNS
// ==========================

function addRuns(runs) {

    matchState.score += runs;

    matchState.balls++;

    battingStats[
        matchState.striker
    ].runs += runs;

    battingStats[
        matchState.striker
    ].balls++;

    if (runs === 4) {

        battingStats[
            matchState.striker
        ].fours++;
    }

    if (runs === 6) {

        battingStats[
            matchState.striker
        ].sixes++;
    }

    bowlingStats[
        matchState.currentBowler
    ].balls++;

    bowlingStats[
        matchState.currentBowler
    ].runs += runs;

    partnershipRuns += runs;

    partnershipBalls++;

    matchState.overHistory.push(
        runs
    );

    if (
        runs === 1 ||
        runs === 3 ||
        runs === 5
    ) {

        swapStrike();
    }

    updatePlayerScores();

    updateScoreboard();

    renderThisOver();

    updateBattingTable();

    updateBowlingTable();

    updateCurrentBowlerDisplay();

    updateMatchInfo();

    checkOverComplete();

    checkMatchEnd();

    saveMatch();
}

function swapStrike() {

    let temp =
        matchState.striker;

    matchState.striker =
        matchState.nonStriker;

    matchState.nonStriker =
        temp;

    document.getElementById(
        "strikerName"
    ).textContent =
        matchState.striker + " ★";

    document.getElementById(
        "nonStrikerName"
    ).textContent =
        matchState.nonStriker;
}

function updatePlayerScores() {

    const striker =

        battingStats[
        matchState.striker
        ];

    const nonStriker =

        battingStats[
        matchState.nonStriker
        ];

    document.getElementById(
        "strikerScore"
    ).textContent =

        striker.runs +
        " (" +
        striker.balls +
        ")";

    document.getElementById(
        "nonStrikerScore"
    ).textContent =

        nonStriker.runs +
        " (" +
        nonStriker.balls +
        ")";
}



function updateBattingTable() {

    const tbody =

        document.querySelector(
            "#battingTable tbody"
        );

    let html = "";

    batsmenUsed.forEach(player => {

        const p =
            battingStats[player];

        const sr =

            p.balls === 0

                ? 0

                :

                (
                    p.runs /
                    p.balls
                ) * 100;
        html += `
<tr>
    <td>${player}</td>
    <td>${p.dismissal}</td>
    <td>${p.runs}</td>
    <td>${p.balls}</td>
    <td>${p.fours}</td>
    <td>${p.sixes}</td>
    <td>${sr.toFixed(2)}</td>
</tr>
`;
    });

    tbody.innerHTML =
        html;
}

function updateBowlingTable() {

    const tbody =

        document.querySelector(
            "#bowlingTable tbody"
        );

    let html = "";

    bowlersUsed.forEach(player => {

        const b =
            bowlingStats[player];

        const overs =
            Math.floor(b.balls / 6) +
            "." +
            (b.balls % 6);

        const eco =
            b.balls === 0
                ? 0
                : b.runs / (b.balls / 6);

        html += `

        <tr>

            <td>${player}</td>

            <td>${overs}</td>

            <td>${b.maidens}</td>

            <td>${b.runs}</td>

            <td>${b.wickets}</td>

            <td>${eco.toFixed(2)}</td>

        </tr>

        `;
    });

    tbody.innerHTML =
        html;
}

// ==========================
// OVER COMPLETE
// ==========================

function checkOverComplete() {

    if (

        matchState.balls % 6 === 0

        &&

        matchState.balls > 0

    ) {

        swapStrike();

        loadNewBowlerOptions();

        overBreak = true;

        toggleScoringButtons(
            true
        );

        document.getElementById(
            "newBowlerPanel"
        ).style.display =
            "block";
    }
}

// ==========================
// NEW BOWLER OPTIONS
// ==========================

function loadNewBowlerOptions() {

    const select =

        document.getElementById(
            "newBowlerSelect"
        );

    let html = "";

    bowlingPlayers.forEach(player => {

        if (

            player !==

            matchState.currentBowler

        ) {

            html += `

            <option value="${player}">
                ${player}
            </option>

            `;
        }

    });

    select.innerHTML =
        html;
}

// ==========================
// CONFIRM BOWLER
// ==========================
function confirmBowler() {
    const bowler =
        document.getElementById(
            "newBowlerSelect"
        ).value;

    matchState.currentBowler =
        bowler;

    if (
        !bowlersUsed.includes(
            bowler
        )
    ) {

        bowlersUsed.push(
            bowler
        );

    }

    document.getElementById(
        "newBowlerPanel"
    ).style.display =
        "none";

    updateCurrentBowlerDisplay();

    updateBowlingTable();
    overBreak = false;

    toggleScoringButtons(false);
    saveMatch();

}
function updateCurrentBowlerDisplay() {


    document.getElementById(
        "bowlerDisplay"
    )


    const b =

        bowlingStats[
        matchState.currentBowler
        ];

    const overs =

        Math.floor(
            b.balls / 6
        ) +

        "." +

        (
            b.balls % 6
        );

    document.getElementById(
        "bowlerDisplay"
    ).innerHTML =

        `
        <strong>
            ${matchState.currentBowler}
        </strong>

        <br>

        ${b.wickets}-${b.runs}
        (${overs})
        `;
}


function toggleScoringButtons(disabled) {

    document.querySelectorAll(
        '.info-card button'
    ).forEach(btn => {

        if (
            btn.onclick &&
            btn.onclick.toString().includes(
                "confirmBowler"
            )
        ) {
            return;
        }

        btn.disabled =
            disabled;

    });

}

function updateMatchInfo() {

    // LAST OVER

    const lastSix =
        matchState.overHistory
        .slice(-6);

    document.getElementById(
        "lastOverDisplay"
    ).innerHTML =

        "Last Over : " +
        lastSix.join(" ");

    // LAST 5 OVERS RUNS

    const last30Balls =
        matchState.overHistory
        .slice(-30);

    const last5Runs =
        last30Balls.reduce(
            (a,b)=>a+b,
            0
        );

    document.getElementById(
        "last5OversDisplay"
    ).innerHTML =

        "Last 5 Overs : " +
        last5Runs +
        " Runs";

    // PREDICTED SCORE

    let predicted = 0;

    if (
        matchState.balls > 0
    ) {

        predicted = Math.round(

            (
                matchState.score /

                matchState.balls

            ) *

            (
                match.overs * 6
            )

        );

    }

    document.getElementById(
        "predictedScoreDisplay"
    ).innerHTML =

        "Predicted Score : " +
        predicted;

    // LIVE WIN %

    document.getElementById(
        "winPercentDisplay"
    ).innerHTML =

        "Live Win % : 50% - 50%";

}

function checkMatchEnd() {

    if (
        matchState.balls >=
        match.overs * 6
    ) {

        document.getElementById(
            "resultDisplay"
        ).innerHTML =

            `${matchState.battingTeam}
             finished on
             ${matchState.score}-${matchState.wickets}`;

        let bestPlayer =
            match.striker;

        let bestRuns =
            0;

        batsmenUsed.forEach(player => {

            if (
                battingStats[player].runs >
                bestRuns
            ) {

                bestRuns =
                    battingStats[player].runs;

                bestPlayer =
                    player;
            }

        });

        document.getElementById(
            "potmDisplay"
        ).innerHTML =

            `
            ${bestPlayer}
            <br>
            ${bestRuns} Runs
            `;

    }

}