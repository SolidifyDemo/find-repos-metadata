# find-repos-metadata

This action prints all repos of chosen visibility in organizations for an authenticated user. 

## Inputs

### `token`

**Required** \
The PAT of the user with access to organizations. Make sure to have *admin:enterprise, admin:org, repo, user, workflow* permissions. 

### `visibility`

**Not Required** \
The visiblity of the repos wanted. For example *public, private, etc*. Default `"public"`.

## Outputs

### `repos`

A list of repos in JSON format looking like: 
```JSON
{
  repository: 'REPO_NAME',
  organization: 'ORG_NAME',
  visibility: 'public'
}
```

## Example usage

```yaml
uses: solidifydemo/find-repos-action@main
with:
  token: ${{ secrets.PAT }}
  visibility: 'public'
```
