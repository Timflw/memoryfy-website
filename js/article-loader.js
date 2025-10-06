async function loadArticles(containerId, limit = 0) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id ${containerId} not found.`);
    return;
  }

  try {
    const response = await fetch(`${window.base_path || ''}articles.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let articles = await response.json();
    // filter out unpublished articles (published === false)
    articles = articles.filter(a => a.published !== false);

    if (limit > 0) {
      articles = articles.slice(0, limit);
    }

    if (articles.length === 0) {
      container.innerHTML = '<p>Keine Artikel gefunden.</p>';
      return;
    }

    let articlesHtml = '';
    articles.forEach(article => {
      let lastEditedDate = '';
      if (article.lastEdited) {
        const date = new Date(article.lastEdited);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        lastEditedDate = `Aktualisiert: ${day}.${month}.${year}`;
      }

      articlesHtml += `
        <article class="card">
          <a href="${window.base_path || ''}${article.url}" class="card-image-link">
            <img src="${window.base_path || ''}${article.image}" alt="${article.title}" loading="lazy">
          </a>
          <div class="card-content">
            <div class="meta">
                <span class="category">${article.category}</span>
                ${lastEditedDate ? `<span class="date">${lastEditedDate}</span>` : ''}
            </div>
            <h2>${article.title}</h2>
            <p>${article.description}</p>
            <a class="btn" href="${window.base_path || ''}${article.url}">Jetzt lesen</a>
          </div>
        </article>
      `;
    });

    container.innerHTML = articlesHtml;

  } catch (error) {
    console.error('Could not load articles:', error);
    container.innerHTML = '<p>Artikel konnten nicht geladen werden.</p>';
  }
}
