import { useState } from "react";
import { useEffect } from "react";


function Article() {
    const [article, setArticle] = useState(null)

    useEffect(() => {
        fetch("https://proovitoo.twn.ee/api/list/972d2b8a")
        .then(res=> res.json())
        .then(json=> setArticle(json))
    }, []);

    if (!article) {
        return <div>Loading...</div>;
    }

    const formatBodyText = (text) => {
        return text.split('<p>').join('<br><br>').split('</p>').join('<br>')
    };

  return (
    <div className="article">
        <div key={article.id}>
            <h2 className="article-title">{article.title.toUpperCase()}</h2>
            <div className="article-intro" dangerouslySetInnerHTML={{ __html: formatBodyText(article.intro) }} />
            <div className="image-container"><img className="article-image" src={article.image.medium}/></div>
            <div className="image-container"><img className="article-image-under" src={article.image.medium}/></div>
            <div className="article-image-title">{article.image.title}</div>
            <div className="article-body" dangerouslySetInnerHTML={{ __html: formatBodyText(article.body) }} />
            <div className="article-tags">
                {article.tags.map((tag, index) => (<div key={index}>{tag}</div>))}
            </div>
         </div>
    </div>
  )
}

export default Article