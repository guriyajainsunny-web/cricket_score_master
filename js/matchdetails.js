let match =

    JSON.parse(

        localStorage.getItem(

            "selectedMatch"

        )

    );

console.log(match);
console.log(match.firstInningsBatting);

document.getElementById(

    "matchTitle"

).textContent =

    match.matchName;

document.getElementById(

    "matchResult"

).textContent =

    match.result;

document.getElementById(

    "potm"

).textContent =

    match.playerOfTheMatch;

document.getElementById(

    "firstScore"

).textContent =

    match.firstInningsScore;

document.getElementById(

    "secondScore"

).textContent =

    match.secondInningsScore;

// ---------- 1st Innings Batting ----------

let firstBattingTable =
    document.querySelector(
        "#firstBatting tbody"
    );

Object.keys(
    match.firstInningsBatting
).forEach(player => {

    let s =
        match.firstInningsBatting[player];

    if (
        s.runs === 0 &&
        s.balls === 0
    ) {
        return;
    }

    let sr =
        s.balls === 0
            ? "0.00"
            : (
                (s.runs / s.balls) * 100
            ).toFixed(2);

    firstBattingTable.innerHTML += `

<tr>

<td>${player}</td>

<td>${s.dismissal}</td>

<td>${s.runs}</td>

<td>${s.balls}</td>

<td>${s.fours}</td>

<td>${s.sixes}</td>

<td>${sr}</td>

</tr>

`;

});

// ---------- 1st Innings Bowling ----------

let firstBowlingTable =
    document.querySelector(
        "#firstBowling tbody"
    );

Object.keys(
    match.firstInningsBowling
).forEach(player => {

    let s =
        match.firstInningsBowling[player];

    if (s.balls === 0) {
        return;
    }

    let overs =
        Math.floor(s.balls / 6) +
        "." +
        (s.balls % 6);

    let eco =
        (s.runs / (s.balls / 6)).toFixed(2);

    firstBowlingTable.innerHTML += `

<tr>

<td>${player}</td>

<td>${overs}</td>

<td>${s.runs}</td>

<td>${s.wickets}</td>

<td>${eco}</td>

</tr>

`;

});

// ---------- 2nd Innings Batting ----------

let secondBattingTable =
    document.querySelector(
        "#secondBatting tbody"
    );

Object.keys(
    match.secondInningsBatting
).forEach(player => {

    let s =
        match.secondInningsBatting[player];

    if (
        s.runs === 0 &&
        s.balls === 0
    ) {
        return;
    }

    let sr =
        s.balls === 0
            ? "0.00"
            : (
                (s.runs / s.balls) * 100
            ).toFixed(2);

    secondBattingTable.innerHTML += `

<tr>

<td>${player}</td>

<td>${s.dismissal}</td>

<td>${s.runs}</td>

<td>${s.balls}</td>

<td>${s.fours}</td>

<td>${s.sixes}</td>

<td>${sr}</td>

</tr>

`;

});

// ---------- 2nd Innings Bowling ----------

let secondBowlingTable =
    document.querySelector(
        "#secondBowling tbody"
    );

Object.keys(
    match.secondInningsBowling
).forEach(player => {

    let s =
        match.secondInningsBowling[player];

    if (s.balls === 0) {
        return;
    }

    let overs =
        Math.floor(s.balls / 6) +
        "." +
        (s.balls % 6);

    let eco =
        (s.runs / (s.balls / 6)).toFixed(2);

    secondBowlingTable.innerHTML += `

<tr>

<td>${player}</td>

<td>${overs}</td>

<td>${s.runs}</td>

<td>${s.wickets}</td>

<td>${eco}</td>

</tr>

`;

});