const API_KEY = "d53eca88d08ad3017cfa2101c8a85636";

const URL =
`https://gnews.io/api/v4/search?q=cricket&lang=en&max=10&apikey=${API_KEY}`;

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