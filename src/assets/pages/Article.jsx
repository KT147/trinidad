import { useState } from "react";
import { useEffect } from "react";
import './article.css'


function Article() {
    const [article, setArticle] = useState(null)

    useEffect(() => {
        fetch("https://proovitoo.twn.ee/api/list/972d2b8a")
        .then(res=> res.json())
        .then(json=> setArticle(json))
    }, [])

    const LoadingScreen = () => {
        return (
          <div className="loading-screen">
            <div className="loader"></div>
          </div>
        )
      }
    if (!article) {
        return <LoadingScreen />
    }


  return (
    <div className="article">
        <div key={article.id}>
            <h2 className="article-title">{article.title.toUpperCase()}</h2>
            <div className="article-intro" dangerouslySetInnerHTML={{ __html:(article.intro) }} />
            <div className="image-container">
                <img className="article-image" src={article.image.medium}/>
                <img className="article-image-under" src={article.image.medium}/>
                <span className="article-image-title">{article.image.title}</span>
            </div>
            <div className="article-body" dangerouslySetInnerHTML={{ __html: (article.body) }} />
            <div className="article-tags">
              {article.tags.map((tag, index) => (<div key={index}>{tag}</div>))}
            </div>
         </div>
    </div>
  )
}

export default Article