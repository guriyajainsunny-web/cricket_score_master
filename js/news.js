fetch("/api/news")
  .then((response) => response.json())
  .then((data) => {

    const container = document.getElementById("newsContainer");

    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = `
        <div class="info-card">
          <h2>No Cricket News Available.</h2>
        </div>
      `;
      return;
    }

    container.innerHTML = "";

    data.articles.forEach((article) => {

      container.innerHTML += `
        <div class="newsCard">

          <img
            src="${article.image || 'assets/news.jpg'}"
            onerror="this.src='assets/news.jpg'">

          <h3>${article.title}</h3>

          <p>${article.description || "No Description Available"}</p>

          <div class="newsInfo">
            <span>📰 ${article.source.name}</span>
            <span>📅 ${new Date(article.publishedAt).toLocaleDateString()}</span>
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
      </div>
    `;

  });