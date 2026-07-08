const API_KEY = "9e4f7c4ed5f043e48b7a5229ad711f9d";
const URL =
    `https://newsapi.org/v2/everything?q=("cricket" OR "ICC" OR "IPL" OR "ODI" OR "Test cricket" OR "T20" OR "virat kohli" OR "ms dhoni" OR "rohit sharma" OR "Indian cricket team" OR "australian cricket team" OR "women's cricket team" OR "cricket stadium"OR "chris gayle" OR "jacob bethell" OR "england cricket team" OR "odi worldcup" OR "vaibhav suryavanshi" OR "BBL" OR "SACHIN TENDULKAR")&language=en&sortBy=publishedAt&searchIn=title&apiKey=${API_KEY}`;

fetch(URL)

    .then(function (response) {

        return response.json();

    })

    .then(function (data) {

        if (
            !data.articles ||
            data.articles.length === 0
        ) {

            document.getElementById(
                "newsContainer"
            ).innerHTML = `

             <div class="info-card">

<h2>

No Cricket News Available.

</h2>

</div>

`;

            return;

        }

        let container =
            document.getElementById(
                "newsContainer"
            );

        container.innerHTML = `

<div class="info-card">

<h2>

🏏 Loading Latest Cricket News...

</h2>

</div>

`;

        container.innerHTML = "";

        let uniqueArticles = [];

        let titles = new Set();

        data.articles.forEach(function (article) {

            let title =
                article.title
                    .trim()
                    .toLowerCase();

            if (!titles.has(title)) {

                titles.add(title);

                uniqueArticles.push(article);

            }

        });

        uniqueArticles
            .slice(0, 12)
            .forEach(function (article) {

                container.innerHTML += `

<div class="newsCard">

<img
src="${article.urlToImage}"

onerror="this.src='assets/news.jpg'">

<h3>

${article.title}

</h3>

<p>

${article.description || "No Description Available"}

</p>

<div class="newsInfo">

<span>

📰 ${article.source.name}

</span>

<span>

📅 ${new Date(article.publishedAt).toLocaleDateString()}

</span>

</div>

<a

href="${article.url}"

target="_blank">

<button>

READ MORE

</button>

</a>

</div>

`;

            });

    })

    .catch(function (error) {

        document.getElementById(
            "newsContainer"
        ).innerHTML = `

<div class="info-card">

<h2>

❌ Unable to load Cricket News

</h2>

<p>

Please check your internet connection
or try again later.

</p>

</div>

`;

    });