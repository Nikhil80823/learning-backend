require('dotenv').config()
const express = require('express')

const app = express()
const port = process.env.PORT || 3000
const githubData = {
  "login": "Nikhil80823",
  "id": 200191980,
  "node_id": "U_kgDOC-6v7A",
  "avatar_url": "https://avatars.githubusercontent.com/u/200191980?v=4",
  "gravatar_id": "",
  "url": "https://api.github.com/users/Nikhil80823",
  "html_url": "https://github.com/Nikhil80823",
  "followers_url": "https://api.github.com/users/Nikhil80823/followers",
  "following_url": "https://api.github.com/users/Nikhil80823/following{/other_user}",
  "gists_url": "https://api.github.com/users/Nikhil80823/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/Nikhil80823/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/Nikhil80823/subscriptions",
  "organizations_url": "https://api.github.com/users/Nikhil80823/orgs",
  "repos_url": "https://api.github.com/users/Nikhil80823/repos",
  "events_url": "https://api.github.com/users/Nikhil80823/events{/privacy}",
  "received_events_url": "https://api.github.com/users/Nikhil80823/received_events",
  "type": "User",
  "user_view_type": "public",
  "site_admin": false,
  "name": "Nikhil Bhadwal",
  "company": null,
  "blog": "",
  "location": null,
  "email": null,
  "hireable": null,
  "bio": null,
  "twitter_username": null,
  "public_repos": 8,
  "public_gists": 0,
  "followers": 0,
  "following": 1,
  "created_at": "2025-02-21T07:25:22Z",
  "updated_at": "2026-01-04T03:54:32Z"
}

app.get('/', (req, res) => {
  res.send("Hello World")
})
app.get('/twitter', (req, res) => {
  res.send('Nikhildotcom ')
})
app.get ('/login', (req,res) =>{
  res.send('<h1>Please Login at Nikhil Bhadwal</h1>')
})
app.get('/youtube',(req,res) =>{
  res.send(`<a href = "https://www.youtube.com/">Youtube</a>`)
})

app.get('/github', (req,res) => {
  res.json(githubData)
})


app.listen(port,() =>{
  console.log(`Example app listening on port ${port}`)
})