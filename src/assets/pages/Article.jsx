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

  return (
    <div>
        <div key={article.id}>
            <h2>{article.title.toUpperCase()}</h2>
            <div>{article.intro}</div>
            <img src={article.image.medium}/>
            <div>{article.body}</div>
            <div>
                {article.tags.map((tag, index) => (<li key={index}>{tag}</li>))}
            </div>
         </div>
    </div>
  )
}

export default Article