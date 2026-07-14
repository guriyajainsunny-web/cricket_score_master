let database =
    JSON.parse(
        localStorage.getItem(
            "matchDatabase"
        )
    ) || [];

loadHistory();

function loadHistory(data = database) {

    let table =
        document.querySelector(
            "#historyTable tbody"
        );

    table.innerHTML = "";

    data.forEach(function (match, index) {

        table.innerHTML += `

<tr>

<td>${match.matchName}</td>

<td>${match.team1}</td>

<td>${match.team2}</td>

<td>${match.result}</td>

<td>${match.firstInningsScore}</td>

<td>${match.secondInningsScore}</td>

<td>${match.playerOfTheMatch}</td>

<td>${match.topBatter}</td>

<td>${match.topBowler}</td>

<td>

<button onclick="viewMatch(${index})">

VIEW

</button>

</td>

<td>

<button onclick="deleteMatch(${index})">

DELETE

</button>

</td>

</tr>

`;

    });

}

function deleteMatch(index) {

    if (confirm("Are you sure you want to delete this match?")) {

        database.splice(index, 1);

        localStorage.setItem(

            "matchDatabase",

            JSON.stringify(database)

        );

        loadHistory();

    }

}

function viewMatch(index) {

    localStorage.setItem(

        "selectedMatch",

        JSON.stringify(database[index])

    );

    window.location.href =
        "matchdetails.html";

}
function searchMatches() {

    let search =
        document.getElementById(
            "searchBox"
        ).value
            .toLowerCase()
            .trim();

    if (search === "") {

        loadHistory();

        return;

    }

    let filteredMatches =
        database.filter(function (match) {

            // Search Match Name
            if (match.matchName.toLowerCase().includes(search))
                return true;

            // Search Team Names
            if (match.team1.toLowerCase().includes(search))
                return true;

            if (match.team2.toLowerCase().includes(search))
                return true;

            // Search Result
            if (match.result.toLowerCase().includes(search))
                return true;

            // Search POTM
            if (match.playerOfTheMatch.toLowerCase().includes(search))
                return true;

            // Search Top Batter
            if (match.topBatter.toLowerCase().includes(search))
                return true;

            // Search Top Bowler
            if (match.topBowler.toLowerCase().includes(search))
                return true;

            // Search ALL 1st Innings Batters
            if (
                Object.keys(
                    match.firstInningsBatting
                ).some(player =>
                    player.toLowerCase().includes(search)
                )
            )
                return true;

            // Search ALL 2nd Innings Batters
            if (
                Object.keys(
                    match.secondInningsBatting
                ).some(player =>
                    player.toLowerCase().includes(search)
                )
            )
                return true;

            // Search ALL 1st Innings Bowlers
            if (
                Object.keys(
                    match.firstInningsBowling
                ).some(player =>
                    player.toLowerCase().includes(search)
                )
            )
                return true;

            // Search ALL 2nd Innings Bowlers
            if (
                Object.keys(
                    match.secondInningsBowling
                ).some(player =>
                    player.toLowerCase().includes(search)
                )
            )
                return true;

            return false;

        });

    loadHistory(filteredMatches);

}