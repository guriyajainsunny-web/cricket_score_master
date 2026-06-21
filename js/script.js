// TAB SWITCHING

function showTab(tabId) {

    // Hide all tab contents
    let contents = document.querySelectorAll(".tab-content");

    contents.forEach(content => {
        content.classList.remove("active-content");
    });

    // Remove active tab color
    let tabs = document.querySelectorAll(".tab-btn");

    tabs.forEach(tab => {
        tab.classList.remove("active-tab");
    });

    // Show selected content
    document.getElementById(tabId).classList.add("active-content");

    // Highlight clicked tab
    event.target.classList.add("active-tab");
}

/* LIVE SCORE EFFECT */

setInterval(() => {

    const score = document.querySelector(".score-box h1");

    score.style.transform = "scale(1.08)";

    setTimeout(() => {
        score.style.transform = "scale(1)";
    }, 300);

}, 5000);

/* LIVE BADGE BLINK */

setInterval(() => {

    const live = document.querySelector(".live-badge");

    if (live.style.opacity === "0.5") {
        live.style.opacity = "1";
    } else {
        live.style.opacity = "0.5";
    }

}, 700);

/* TIMELINE HOVER */

const timelineItems = document.querySelectorAll(".timeline-item");

timelineItems.forEach(item => {

    item.addEventListener("mouseenter", () => {

        item.style.transform = "translateY(-4px)";

    });

    item.addEventListener("mouseleave", () => {

        item.style.transform = "translateY(0px)";

    });

});

/* PLAYER CARD HOVER */

const players = document.querySelectorAll(".player-row");

players.forEach(player => {

    player.addEventListener("mouseenter", () => {

        player.style.transform = "scale(1.03)";
        player.style.transition = ".3s";

    });

    player.addEventListener("mouseleave", () => {

        player.style.transform = "scale(1)";

    });

});

function showODITab(id) {

    document
        .querySelectorAll(".odi-content")
        .forEach(tab => {
            tab.classList.remove("active-content");
        });

    document
        .getElementById(id)
        .classList.add("active-content");

}

function showInnings(id) {

    document
        .querySelectorAll(".innings")
        .forEach(tab => {
            tab.classList.remove("active-innings");
        });

    document
        .getElementById(id)
        .classList.add("active-innings");

}
/*----------------------------------------------------------*/
function toggleSeries(event) {
    event.preventDefault();

    document
        .getElementById("seriesMenu")
        .classList.toggle("show");
}


function toggleSquad(event) {
    event.preventDefault();
    document.getElementById("squadMenu")
        .classList.toggle("show");
}


function toggleRANKINGS(event) {
    event.preventDefault();
    document.getElementById("rankingsMenu")
        .classList.toggle("show");
}

// ==========================
// CREATE PLAYING XI INPUTS
// ==========================

const team1Container = document.getElementById("team1Players");
const team2Container = document.getElementById("team2Players");

for (let i = 1; i <= 11; i++) {

    team1Container.innerHTML += `
        <input
            type="text"
            class="team1Player"
            placeholder="Player ${i}">
        <br><br>
    `;

    team2Container.innerHTML += `
        <input
            type="text"
            class="team2Player"
            placeholder="Player ${i}">
        <br><br>
    `;
}

// ==========================
// LIVE TEAM TITLE UPDATE
// ==========================

document.getElementById("team1Name")
    .addEventListener("input", function () {

        document.getElementById("team1Title")
            .textContent =
            this.value.trim() || "Team 1 Playing XI";

    });

document.getElementById("team2Name")
    .addEventListener("input", function () {

        document.getElementById("team2Title")
            .textContent =
            this.value.trim() || "Team 2 Playing XI";

    });

// ==========================
// NEXT BUTTON
// ==========================

document.getElementById("nextBtn")
    .addEventListener("click", createMatch);

// ==========================
// CREATE MATCH
// ==========================

function createMatch() {

    const matchName =
        document.getElementById("matchName")
            .value.trim();

    const team1 =
        document.getElementById("team1Name")
            .value.trim();

    const team2 =
        document.getElementById("team2Name")
            .value.trim();

    const overs =
        document.getElementById("overs")
            .value;

    const error =
        document.getElementById("errorMessage");

    error.textContent = "";

    // ==========================
    // VALIDATION
    // ==========================

    if (matchName.length < 5) {

        error.textContent =
            "Match name must contain at least 5 characters.";

        return;
    }

    if (team1.length < 3) {

        error.textContent =
            "Team 1 name must contain at least 3 characters.";

        return;
    }

    if (team2.length < 3) {

        error.textContent =
            "Team 2 name must contain at least 3 characters.";

        return;
    }

    if (team1.toLowerCase() === team2.toLowerCase()) {

        error.textContent =
            "Both teams cannot have the same name.";

        return;
    }

    if (!overs || Number(overs) < 1) {

        error.textContent =
            "Overs must be at least 1.";

        return;
    }

    // ==========================
    // PLAYER COLLECTION
    // ==========================

    const team1Inputs =
        document.querySelectorAll(".team1Player");

    const team2Inputs =
        document.querySelectorAll(".team2Player");

    const team1Players = [];
    const team2Players = [];

    for (const player of team1Inputs) {

        const value =
            player.value.trim();

        if (value.length < 3) {

            error.textContent =
                "Every Team 1 player must have at least 3 characters.";

            return;
        }

        team1Players.push(value);
    }

    for (const player of team2Inputs) {

        const value =
            player.value.trim();

        if (value.length < 3) {

            error.textContent =
                "Every Team 2 player must have at least 3 characters.";

            return;
        }

        team2Players.push(value);
    }

    // ==========================
    // DUPLICATE CHECK
    // ==========================

    if (new Set(team1Players).size !== 11) {

        error.textContent =
            "Team 1 players must be unique.";

        return;
    }

    if (new Set(team2Players).size !== 11) {

        error.textContent =
            "Team 2 players must be unique.";

        return;
    }

    // ==========================
    // SAVE DATA
    // ==========================

    const matchData = {

        matchName,

        team1,
        team2,

        overs: Number(overs),

        team1Players,
        team2Players,

        createdAt:
            new Date().toISOString()
    };

    localStorage.setItem(
        "matchData",
        JSON.stringify(matchData)
    );

    console.log(matchData);

    // ==========================
    // GO TO STEP 2
    // ==========================

    document.getElementById("step1")
        .style.display = "none";

    document.getElementById("step2")
        .style.display = "block";
    loadStep2()
}
/*nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuukkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa */
// ==========================
// STEP 2 VARIABLES
// ==========================

let team1Captain = "";
let team1WK = "";

let team2Captain = "";
let team2WK = "";

let battingTeam = "";
let bowlingTeam = "";

let striker = "";
let nonStriker = "";

let firstBowler = "";

// ==========================
// LOAD STEP 2
// ==========================

function loadStep2() {

    const matchData =
        JSON.parse(
            localStorage.getItem("matchData")
        );

    // TEAM 1 CAPTAIN

    document.getElementById(
        "team1Captain"
    ).innerHTML = createSelect(
        "team1CaptainSelect",
        matchData.team1Players
    );

    // TEAM 1 WK

    document.getElementById(
        "team1WK"
    ).innerHTML = createSelect(
        "team1WKSelect",
        matchData.team1Players
    );

    // TEAM 2 CAPTAIN

    document.getElementById(
        "team2Captain"
    ).innerHTML = createSelect(
        "team2CaptainSelect",
        matchData.team2Players
    );

    // TEAM 2 WK

    document.getElementById(
        "team2WK"
    ).innerHTML = createSelect(
        "team2WKSelect",
        matchData.team2Players
    );

    // BATTING TEAM

    document.getElementById(
        "battingTeamBtns"
    ).innerHTML = `

        <select id="battingTeamSelect">

            <option value="">
                Select Batting Team
            </option>

            <option value="${matchData.team1}">
                ${matchData.team1}
            </option>

            <option value="${matchData.team2}">
                ${matchData.team2}
            </option>

        </select>
    `;

    document
        .getElementById(
            "battingTeamSelect"
        )
        .addEventListener(
            "change",
            loadBattingOptions
        );
}

// ==========================
// CREATE SELECT
// ==========================

function createSelect(id, players) {

    return `

        <select id="${id}">

            <option value="">
                Select
            </option>

            ${players.map(player => `
                <option value="${player}">
                    ${player}
                </option>
            `).join("")}

        </select>

    `;
}

// ==========================
// LOAD STRIKER / BOWLER
// ==========================

function loadBattingOptions() {

    const matchData =
        JSON.parse(
            localStorage.getItem("matchData")
        );

    battingTeam =
        document.getElementById(
            "battingTeamSelect"
        ).value;

    if (!battingTeam) {
        return;
    }

    bowlingTeam =

        battingTeam === matchData.team1

            ? matchData.team2

            : matchData.team1;

    const battingPlayers =

        battingTeam === matchData.team1

            ? matchData.team1Players

            : matchData.team2Players;

    const bowlingPlayers =

        bowlingTeam === matchData.team1

            ? matchData.team1Players

            : matchData.team2Players;

    document.getElementById(
        "strikerDiv"
    ).innerHTML =
        createSelect(
            "strikerSelect",
            battingPlayers
        );

    document.getElementById(
        "nonStrikerDiv"
    ).innerHTML =
        createSelect(
            "nonStrikerSelect",
            battingPlayers
        );

    document.getElementById(
        "bowlerDiv"
    ).innerHTML =
        createSelect(
            "bowlerSelect",
            bowlingPlayers
        );
}

//dsfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
document
    .getElementById("finalBtn")
    .addEventListener(
        "click",
        startMatch
    );

function startMatch() {

    const error =
        document.getElementById(
            "step2Error"
        );

    error.textContent = "";

    team1Captain =
        document.getElementById(
            "team1CaptainSelect"
        ).value;

    team1WK =
        document.getElementById(
            "team1WKSelect"
        ).value;

    team2Captain =
        document.getElementById(
            "team2CaptainSelect"
        ).value;

    team2WK =
        document.getElementById(
            "team2WKSelect"
        ).value;

    striker =
        document.getElementById(
            "strikerSelect"
        )?.value || "";

    nonStriker =
        document.getElementById(
            "nonStrikerSelect"
        )?.value || "";

    firstBowler =
        document.getElementById(
            "bowlerSelect"
        )?.value || "";

    if (!team1Captain) {
        error.textContent =
            "Select Team 1 Captain";
        return;
    }

    if (!team1WK) {
        error.textContent =
            "Select Team 1 Wicket Keeper";
        return;
    }

    if (!team2Captain) {
        error.textContent =
            "Select Team 2 Captain";
        return;
    }

    if (!team2WK) {
        error.textContent =
            "Select Team 2 Wicket Keeper";
        return;
    }

    if (!battingTeam) {
        error.textContent =
            "Select Batting Team";
        return;
    }

    if (!striker) {
        error.textContent =
            "Select Striker";
        return;
    }

    if (!nonStriker) {
        error.textContent =
            "Select Non-Striker";
        return;
    }

    if (striker === nonStriker) {
        error.textContent =
            "Striker and Non-Striker must be different";
        return;
    }

    if (!firstBowler) {
        error.textContent =
            "Select First Bowler";
        return;
    }

    const matchData =
        JSON.parse(
            localStorage.getItem(
                "matchData"
            )
        );

    const matchConfig = {

        ...matchData,

        team1Captain,
        team1WK,

        team2Captain,
        team2WK,

        battingTeam,
        bowlingTeam,

        striker,
        nonStriker,

        firstBowler,

        score: 0,
        wickets: 0,
        balls: 0
    };

    localStorage.setItem(
        "matchConfig",
        JSON.stringify(
            matchConfig
        )
    );

    window.location.href = "livescorer.html";
}

function updateBattingTable(){

    const table=
        innings===1
        ? document.querySelector("#innings1BattingTable tbody")
        : document.querySelector("#battingTable tbody");

    table.innerHTML="";

    Object.keys(battingStats).forEach(player=>{

        const s=battingStats[player];

        if(s.runs===0 && s.balls===0){
            return;
        }

        let sr=
            s.balls===0
            ? 0
            : ((s.runs/s.balls)*100).toFixed(2);

        table.innerHTML+=`
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

function updateBowlingTable(){

    const table=
        innings===1
        ? document.querySelector("#innings1BowlingTable tbody")
        : document.querySelector("#bowlingTable tbody");

    table.innerHTML="";

    Object.keys(bowlingStats).forEach(player=>{

        const s=bowlingStats[player];

        if(s.balls===0 && s.runs===0){
            return;
        }

        let overs=
            Math.floor(s.balls/6)+"."+
            (s.balls%6);

        let eco=
            s.balls===0
            ? "0.00"
            : (s.runs/(s.balls/6)).toFixed(2);

        table.innerHTML+=`
        <tr>
            <td>${player}</td>
            <td>${overs}</td>
            <td>${s.runs}</td>
            <td>${s.wickets}</td>
            <td>${eco}</td>
        </tr>`;
    });

}

function wicket(){

    if(inningsEnded||scoringLocked){
        return;
    }

    scoringLocked=true;

    document.getElementById("wicketPanel")
        .style.display="block";

    const fielderSelect=
        document.getElementById("fielderSelect");

    const newBatsmanSelect=
        document.getElementById("newBatsmanSelect");

    fielderSelect.innerHTML="";
    newBatsmanSelect.innerHTML="";

    const fielders=
        bowlingTeam===matchConfig.team1
        ? matchConfig.team1Players
        : matchConfig.team2Players;

    fielders.forEach(player=>{

        fielderSelect.innerHTML+=
        `<option value="${player}">
            ${player}
        </option>`;

    });

    const batters=
        battingTeam===matchConfig.team1
        ? matchConfig.team1Players
        : matchConfig.team2Players;

    batters.forEach(player=>{

        if(
            player!==striker &&
            player!==nonStriker &&
            battingStats[player].balls===0
        ){

            newBatsmanSelect.innerHTML+=
            `<option value="${player}">
                ${player}
            </option>`;
        }

    });

}

function wicketTypeChanged(){

    const type=
        document.getElementById("wicketType").value;

    if(
        type==="Bowled" ||
        type==="LBW"
    ){

        document.getElementById("fielderSelect")
            .style.display="none";

    }else{

        document.getElementById("fielderSelect")
            .style.display="block";

    }

}

function confirmWicket(){

    const type=
        document.getElementById("wicketType").value;

    const fielder=
        document.getElementById("fielderSelect").value;

    const newBatsman=
        document.getElementById("newBatsmanSelect").value;

    if(!type || !newBatsman){
        alert("Complete wicket details");
        return;
    }

    wickets++;
    legalBalls++;

    bowlingStats[currentBowler].balls++;
    bowlingStats[currentBowler].wickets++;

    let dismissal="";

    if(type==="Caught"){
        dismissal=
            "c "+fielder+
            " b "+currentBowler;
    }

    if(type==="Bowled"){
        dismissal=
            "b "+currentBowler;
    }

    if(type==="LBW"){
        dismissal=
            "lbw b "+currentBowler;
    }

    if(type==="Run Out"){
        dismissal=
            "run out ("+fielder+")";
    }

    if(type==="Stumped"){
        dismissal=
            "st "+fielder+
            " b "+currentBowler;
    }

    battingStats[striker].balls++;
    battingStats[striker].dismissal=
        dismissal;

    addCommentary(
        getOvers()+
        " : WICKET - "+
        striker
    );

    striker=newBatsman;

    document.getElementById("strikerName")
        .textContent=
        striker+" ★";

    document.getElementById("wicketPanel")
        .style.display="none";

    scoringLocked=false;

    updateScoreboard();
    updateBattingTable();
    updateBowlingTable();

}
