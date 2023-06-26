const core = require('@actions/core')
const github = require('@actions/github')
/* import fs from 'fs' */
const main = async () => {
    try {
        const token = core.getInput('token')
        const visibility = core.getInput('visibility')
    // Octokit.js
    // https://github.com/octokit/core.js#readme
    
    const octokit = new github.getOctokit(token)

    // Enterprise cloud
    const { data: orgs } = await octokit.rest.orgs.listForAuthenticatedUser();

    orgs.forEach(async org => {
        getRepos(org, visibility)
    })

    //Remember to check how many repos there are and if there are more than 100, use pagination
    async function getRepos(org, visibility) {
        const { data: repos } = await octokit.rest.repos.listForOrg({
            org: org.login,
            per_page: 100,
            type: visibility,
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
}