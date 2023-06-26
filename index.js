import { Octokit } from "@octokit/core";

const core = require('@actions/core')
const github = require('@actions/github')
/* import fs from 'fs' */

try {
    const token = core.getInput('token')
    const visibility = core.getInput('visibility')
// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
    auth: token,
})

// Enterprise cloud
 const { data: orgs } = await octokit.request('GET /user/orgs',{
    headers: {
        'X-GitHub-Api-Version': '2022-11-28'
    }
})

orgs.forEach(async org => {
    getRepos(org, visibility)
})

//Remember to check how many repos there are and if there are more than 100, use pagination
async function getRepos(org, visibility) {
    const { data: repos } = await octokit.request('GET /orgs/{org}/repos', {
        org: org.login,
        per_page: 100,
        type: visibility,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    })
    var data = repos.map(repo => {
        return {
            repository: repo.name,
            organization: org.login,
            visibility: repo.visibility,
        }
    })
    core.setOutput('repos', JSON.stringify(data))

    return data
}
} catch (error) {
    core.setFailed(error.message)
}
