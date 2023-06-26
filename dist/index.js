/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 442:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 671:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(442)
const github = __nccwpck_require__(671)
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
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`);
        core.setOutput("repos", JSON.stringify(data))

        return data
    }
    } catch (error) {
        core.setFailed(error.message)
    }
}
})();

module.exports = __webpack_exports__;
/******/ })()
;