const core = require("@actions/core");
const github = require("@actions/github");

const main = async () => {
  try {
    const token = core.getInput("token");
    const visibility = core.getInput("visibility");

    const octokit = new github.getOctokit(token);

    const { data: orgs } = await octokit.rest.orgs.listForAuthenticatedUser();
    const allRepos = [];
    var count = 0;
    orgs.forEach(async (org) => {
      await getRepos(org, visibility, allRepos);
    });
    //Remember to check how many repos there are and if there are more than 100, use pagination
    async function getRepos(org, visibility, allRepos) {
      const { data: repos } = await octokit.rest.repos.listForOrg({
        org: org.login,
        per_page: 100,
        type: visibility,
      });
      var data = repos.map((repo) => {
        return {
          repository: repo.name,
          organization: org.login,
          visibility: repo.visibility,
        };
      });
      allRepos.push(data);
      count++;
      if (count == orgs.length) {
        core.setOutput("repos", JSON.stringify(allRepos));
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
};
main();
