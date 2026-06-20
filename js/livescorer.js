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

    updatePartnership();

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
    matchState.balls >=
    match.overs * 6
) {

    endInnings();

    return;
}

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

//partnership

function updatePartnership() {

    document.getElementById(
        "partnershipDisplay"
    ).innerHTML =

        partnershipRuns +
        " (" +
        partnershipBalls +
        ")";
}
function updateMatchInfo() {

    // LAST OVER RUNS

    const lastOverRuns =

        matchState.overHistory

            .slice(-6)

            .reduce(

                (sum, ball) => {

                    if (
                        typeof ball ===
                        "number"
                    ) {

                        return sum + ball;

                    }

                    return sum;

                },

                0

            );

    document.getElementById(
        "lastOverDisplay"
    ).innerHTML =

        "Last Over : " +
        lastOverRuns +
        " Runs";

    // LAST 5 OVERS RUNS

    const last5Runs =

        matchState.overHistory

            .slice(-30)

            .reduce(

                (sum, ball) => {

                    if (
                        typeof ball ===
                        "number"
                    ) {

                        return sum + ball;

                    }

                    return sum;

                },

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

    document.getElementById(
    "predictedScoreDisplay"
).innerHTML =

    "Predicted Score : " +
    predicted;

// TARGET

if (
    matchState.innings === 2
) {

    document.getElementById(
        "targetDisplay"
    ).innerHTML =

        "Target : " +

        matchState.target;

}

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

// ==========================
// BYE
// ==========================

function showByeOptions() {

    const panel =

        document.getElementById(
            "extraOptions"
        );

    let html =

        "<h3>Bye Runs</h3>";

    for (
        let i = 1;
        i <= 6;
        i++
    ) {

        html +=

            `
        <button onclick="addBye(${i})">
            B${i}
        </button>
        `;
    }

    panel.innerHTML =
        html;

    panel.style.display =
        "block";
}

function addBye(runs) {

    matchState.score += runs;

    if (
        runs % 2 !== 0
    ) {
        swapStrike();
    }

    extras.byes += runs;

    matchState.balls++;

    partnershipRuns += runs;

    partnershipBalls++;

    updatePartnership();

    battingStats[
        matchState.striker
    ].balls++;

    bowlingStats[
        matchState.currentBowler
    ].balls++;

    matchState.overHistory.push(
        "B" + runs
    );

    renderThisOver();

    updatePlayerScores();

    updateScoreboard();

    updateBowlingTable();

    updateCurrentBowlerDisplay();

    checkOverComplete();

    saveMatch();

    document.getElementById(
        "extraOptions"
    ).style.display =
        "none";
}

// ==========================
// LEG BYE
// ==========================

function showLegByeOptions() {

    const panel =

        document.getElementById(
            "extraOptions"
        );

    let html =

        "<h3>Leg Bye Runs</h3>";

    for (
        let i = 1;
        i <= 6;
        i++
    ) {

        html +=

            `
        <button onclick="addLegBye(${i})">
            LB${i}
        </button>
        `;
    }

    panel.innerHTML =
        html;

    panel.style.display =
        "block";
}

function addLegBye(runs) {

    matchState.score += runs;

    if (
        runs % 2 !== 0
    ) {
        swapStrike();
    }

    extras.legByes += runs;

    matchState.balls++;

    partnershipRuns += runs;

    partnershipBalls++;

    updatePartnership();

    battingStats[
        matchState.striker
    ].balls++;

    bowlingStats[
        matchState.currentBowler
    ].balls++;

    matchState.overHistory.push(
        "LB" + runs
    );

    renderThisOver();

    updatePlayerScores();

    updateScoreboard();

    updateBowlingTable();

    updateCurrentBowlerDisplay();

    checkOverComplete();

    saveMatch();

    document.getElementById(
        "extraOptions"
    ).style.display =
        "none";
}

function updateFOW() {

    document.getElementById(
        "fowDisplay"
    ).innerHTML =

        fallOfWickets.join(
            "<br>"
        );
}

// ==========================
// WIDE
// ==========================

function showWideOptions() {

    toggleScoringButtons(true);

    const panel =
        document.getElementById(
            "extraOptions"
        );

    let html =
        "<h3>Wide Runs</h3>";

    for (let i = 0; i <= 6; i++) {

        html += `
        <button onclick="addWide(${i})">
            WD+${i}
        </button>
        `;
    }

    panel.innerHTML = html;

    panel.style.display =
        "block";
}

function addWide(extraRuns) {

    const totalRuns =
        1 + extraRuns;

    matchState.score +=
        totalRuns;

    partnershipRuns +=
        totalRuns;

    updatePartnership();

    // YOUR RULE
    // WD+0=1 stay
    // WD+1=2 change
    // WD+2=3 stay
    // WD+3=4 change

    if (
        totalRuns % 2 === 0
    ) {

        swapStrike();

    }

    extras.wides +=
        totalRuns;

    bowlingStats[
        matchState.currentBowler
    ].runs +=
        totalRuns;

    matchState.overHistory.push(
        "Wd"
    );

    renderThisOver();

    updateScoreboard();

    updateBowlingTable();

    updateCurrentBowlerDisplay();

    saveMatch();

    toggleScoringButtons(false);

    document.getElementById(
        "extraOptions"
    ).style.display =
        "none";
}

// ==========================
// NO BALL
// ==========================

function showNoBallOptions() {

    toggleScoringButtons(true);

    const panel =
        document.getElementById(
            "extraOptions"
        );

    let html =
        "<h3>No Ball</h3>";

    for (let i = 0; i <= 6; i++) {

        html += `

        <button onclick="addNoBall(${i},true)">
            NB+${i} from bat
        </button>

        <button onclick="addNoBall(${i},false)">
            NB+${i} not from bat
        </button>

        <br><br>

        `;
    }

    panel.innerHTML =
        html;

    panel.style.display =
        "block";
}

function addNoBall(
    runs,
    fromBat
) {

    const totalRuns =
        1 + runs;

    matchState.score +=
        totalRuns;

    partnershipRuns +=
        totalRuns;

    updatePartnership();

    // YOUR RULE
    // NB+0=1 stay
    // NB+1=2 change
    // NB+2=3 stay
    // NB+3=4 change

    if (
        totalRuns % 2 === 0
    ) {

        swapStrike();

    }

    extras.noBalls++;

    bowlingStats[
        matchState.currentBowler
    ].runs +=
        totalRuns;

    if (fromBat) {

        battingStats[
            matchState.striker
        ].runs += runs;

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

    }

    matchState.overHistory.push(
        "Nb"
    );

    renderThisOver();

    updatePlayerScores();

    updateScoreboard();

    updateBowlingTable();

    updateCurrentBowlerDisplay();

    saveMatch();

    toggleScoringButtons(false);

    document.getElementById(
        "extraOptions"
    ).style.display =
        "none";
}

// ==========================
// WICKET
// ==========================

function wicket() {

    loadNewBatsmanOptions();

    loadFielderOptions();

    document.getElementById(
        "fielderSelect"
    ).style.display =
        "none";

    document.getElementById(
        "wicketPanel"
    ).style.display =
        "block";
}

function wicketTypeChanged() {

    const type =
        document.getElementById(
            "wicketType"
        ).value;

    const fielder =
        document.getElementById(
            "fielderSelect"
        );

    if (
        type === "Caught" ||
        type === "Run Out"
    ) {

        fielder.style.display =
            "block";

    } else {

        fielder.style.display =
            "none";

    }

    if (
        type === "Stumped"
    ) {

        fielder.value =
            "Wicket Keeper";

    }
}

function loadNewBatsmanOptions() {

    const select =
        document.getElementById(
            "newBatsmanSelect"
        );

    let html = "";

    battingPlayers.forEach(player => {

        if (
            !batsmenUsed.includes(
                player
            )
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

function loadFielderOptions() {

    const select =
        document.getElementById(
            "fielderSelect"
        );

    let html =
        `<option value="">
            Select Fielder
        </option>`;

    bowlingPlayers.forEach(player => {

        html += `
        <option value="${player}">
            ${player}
        </option>
        `;
    });

    select.innerHTML =
        html;
}

function confirmWicket() {

    const wicketType =
        document.getElementById(
            "wicketType"
        ).value;

    const newBatsman =
        document.getElementById(
            "newBatsmanSelect"
        ).value;

    if (!wicketType) {

        return;
    }

    if (!newBatsman) {

        return;
    }

    matchState.wickets++;

    matchState.balls++;

    partnershipBalls++;

    battingStats[
        matchState.striker
    ].balls++;

    bowlingStats[
        matchState.currentBowler
    ].balls++;

    if (
        wicketType !==
        "Run Out"
    ) {

        bowlingStats[
            matchState.currentBowler
        ].wickets++;

        matchState.overHistory.push(
            "W"
        );

        renderThisOver();

    }

    battingStats[
        matchState.striker
    ].dismissal =
        wicketType;

    fallOfWickets.push(
        matchState.wickets +
        "-" +
        matchState.score
    );

    updateFOW();

    partnershipRuns = 0;

    partnershipBalls = 0;

    updatePartnership();

    batsmenUsed.push(
        newBatsman
    );

    matchState.striker =
        newBatsman;

    document.getElementById(
        "strikerName"
    ).textContent =
        newBatsman + " ★";

    document.getElementById(
        "strikerScore"
    ).textContent =
        "0 (0)";

    document.getElementById(
        "wicketPanel"
    ).style.display =
        "none";

    updateBattingTable();

    updateBowlingTable();

    updateScoreboard();

    saveMatch();

    if (
    matchState.wickets >= 10
) {

    endInnings();

    return;
}

}
function endInnings() {

    if (
        matchState.innings !== 1
    ) {
        return;
    }

    matchState.target =
        matchState.score + 1;

    const strikerSelect =
        document.getElementById(
            "secondStriker"
        );

    const nonStrikerSelect =
        document.getElementById(
            "secondNonStriker"
        );

    const bowlerSelect =
        document.getElementById(
            "secondBowler"
        );

    let battingList = [];

    let bowlingList = [];

    if (
        matchState.bowlingTeam ===
        match.team1
    ) {

        battingList =
            match.team1Players;

        bowlingList =
            match.team2Players;

    } else {

        battingList =
            match.team2Players;

        bowlingList =
            match.team1Players;

    }

    strikerSelect.innerHTML = "";
    nonStrikerSelect.innerHTML = "";
    bowlerSelect.innerHTML = "";

    battingList.forEach(player => {

        strikerSelect.innerHTML +=
            `<option value="${player}">
                ${player}
            </option>`;

        nonStrikerSelect.innerHTML +=
            `<option value="${player}">
                ${player}
            </option>`;
    });

    bowlingList.forEach(player => {

        bowlerSelect.innerHTML +=
            `<option value="${player}">
                ${player}
            </option>`;
    });

    document.getElementById(
        "secondInningsPanel"
    ).style.display =
        "block";
}

function startSecondInnings() {

    const striker =
        document.getElementById(
            "secondStriker"
        ).value;

    const nonStriker =
        document.getElementById(
            "secondNonStriker"
        ).value;

    const bowler =
        document.getElementById(
            "secondBowler"
        ).value;

    if (
        striker === nonStriker
    ) {

        alert(
            "Select different batters"
        );

        return;
    }

    const oldBatting =
        matchState.battingTeam;

    matchState.battingTeam =
        matchState.bowlingTeam;

    matchState.bowlingTeam =
        oldBatting;

    matchState.innings = 2;

    matchState.score = 0;

    matchState.wickets = 0;

    matchState.balls = 0;

    matchState.overHistory = [];

    matchState.striker =
        striker;

    matchState.nonStriker =
        nonStriker;

    matchState.currentBowler =
        bowler;

    document.getElementById(
        "inningsDisplay"
    ).innerHTML =
        "2nd Innings";

    document.getElementById(
        "secondInningsInfo"
    ).style.display =
        "block";

    document.getElementById(
        "secondInningsPanel"
    ).style.display =
        "none";

    document.getElementById(
        "teamBat"
    ).textContent =
        matchState.battingTeam;

    document.getElementById(
        "teamBowl"
    ).textContent =
        matchState.bowlingTeam;

    document.getElementById(
        "strikerName"
    ).textContent =
        striker + " ★";

    document.getElementById(
        "nonStrikerName"
    ).textContent =
        nonStriker;

    updatePlayerScores();

    updateScoreboard();

    updateCurrentBowlerDisplay();

    updateMatchInfo();

    saveMatch();
}

