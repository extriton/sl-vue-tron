const axios = require('axios')
const News = require('../models/News')

const newsUrl = 'https://api.coinstats.app/public/v1/news/latest?skip=0&limit=30'
const updateInterval = 10 * 60 * 1000

module.exports = {
    runUpdater              : runUpdater
}

function runUpdater(io) {
    update(io)
    setInterval(() => { update(io) }, updateInterval)
}

async function update(io) {

    console.log('Update News feed')
    const apiNewsPromise = axios.get(newsUrl)
    const dbNewsPromise = News.find().sort({ feedDate: -1 }).limit(1)

    const apiNews = (await apiNewsPromise).data.news
    const dbNews = await dbNewsPromise

    let lastDbNewsDate = 0
    if (dbNews.length > 0) {
        lastDbNewsDate = dbNews[0].feedDate
    }
    
    let newItemExist = false
    for (let i = 0; i < apiNews.length; i++) {
        if (apiNews[i].feedDate > lastDbNewsDate && apiNews[i].source.indexOf('Reddit') === -1 && apiNews[i].link !== '') {
            const news = new News({
                id              : apiNews[i].id,
                searchKeyWords  : apiNews[i].searchKeyWords,
                feedDate        : apiNews[i].feedDate,
                source          : apiNews[i].source,
                sourceLink      : apiNews[i].sourceLink,
                title           : apiNews[i].title,
                description     : apiNews[i].description,
                link            : apiNews[i].link,
                imgURL          : apiNews[i].imgURL
            })
            
            if (!apiNews[i].icon) {
                news.icon = apiNews[i].imgURL
            } else {
                news.icon = apiNews[i].icon
            }

            news.innerLink = getInnerLink(news.link)
            if (!news.innerLink) news.innerLink = news.id

            await news.save()
            newItemExist = true
        }

        if (newItemExist) {
            io.sockets.emit('refreshNews')
        }
    }

}

function getInnerLink (link) {
    let SPos, QPos, res

    QPos = link.indexOf('/?')
    if (QPos === -1) {
        QPos = link.indexOf('?')
    }
    if (QPos === -1) {
        res = link
    } else {
        res = link.substr(0, QPos)
    }
  
    SPos = res.lastIndexOf('/')
    if (SPos === res.length - 1) {
        res = res.substr(0, res.length - 1)
        SPos = res.lastIndexOf('/')
    }

    res = res.substr(SPos + 1)
    return res
}
