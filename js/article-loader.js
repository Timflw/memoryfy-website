async function loadArticles(containerId, limit = 0) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id ${containerId} not found.`);
        return;
    }

    try {
        const response = await fetch('/articles.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let articles = await response.json();

        if (limit > 0) {
            articles = articles.slice(0, limit);
        }

        if (articles.length === 0) {
            container.innerHTML = '<p>Keine Artikel gefunden.</p>';
            return;
        }

        let articlesHtml = '';
        articles.forEach(article => {
            articlesHtml += `
        <article class="card">
          <div class="meta">${article.category}</div>
          <h2><a href="${article.link}">${article.title}</a></h2>
          <p>${article.description}</p>
          <a class="btn" href="${article.link}">Jetzt lesen</a>
        </article>
      `;
        });

        container.innerHTML = articlesHtml;

    } catch (error) {
        console.error('Could not load articles:', error);
        container.innerHTML = '<p>Artikel konnten nicht geladen werden.</p>';
    }
}
