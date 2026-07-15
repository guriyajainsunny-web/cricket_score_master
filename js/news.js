fetch("/api/news")
    .then((response) => response.json())
    .then((data) => {
        const container = document.getElementById("newsContainer");

        if (!data.data || data.data.length === 0) {
            container.innerHTML = `
        <div class="info-card">
          <h2>No Cricket News Available.</h2>
        </div>
      `;
            return;
        }

        container.innerHTML = "";

        const titles = new Set();
        const uniqueArticles = [];

        data.data.forEach((article) => {
            const title = article.title.trim().toLowerCase();

            if (!titles.has(title)) {
                titles.add(title);
                uniqueArticles.push(article);
            }
        });

        uniqueArticles.slice(0, 12).forEach((article) => {
            container.innerHTML += `
        <div class="newsCard">

          <img
            src="${article.image_url || "assets/news.jpg"}"
            onerror="this.src='assets/news.jpg'">

          <h3>${article.title}</h3>

          <p>
            ${article.description || "No Description Available"}
          </p>

          <div class="newsInfo">
            <span>📰 ${article.source || "Unknown"}</span>
            <span>📅 ${new Date(article.published_at).toLocaleDateString()}</span>
          </div>

          <a href="${article.url}" target="_blank">
            <button>READ MORE</button>
          </a>

        </div>
      `;
        });
    })
    .catch(() => {
        document.getElementById("newsContainer").innerHTML = `
      <div class="info-card">
        <h2>❌ Unable to load Cricket News</h2>
        <p>Please try again later.</p>
      </div>
    `;
    });