import { getInput, debug, setFailed } from '@actions/core'
import { writeFileSync } from 'fs'

import {
  mask_entry,
  validate_entry,
  get_access_token,
  get_project_secrets
} from './utils'

export async function run(): Promise<void> {
  try {
    const client_id: string = getInput('hcp_client_id')
    const client_secret: string = getInput('hcp_client_secret')
    const organization_id: string = getInput('hcp_organization_id')
    const project_id: string = getInput('hcp_project_id')
    const project_name: string = getInput('hcp_project_name')

    debug(
      JSON.stringify({
        client_id: mask_entry(client_id),
        client_secret: mask_entry(client_secret),
        organization_id: mask_entry(organization_id),
        project_id: mask_entry(project_id),
        project_name: mask_entry(project_name)
      })
    )

    validate_entry('hcp_client_id', client_id)
    validate_entry('hcp_client_secret', client_secret)
    validate_entry('hcp_organization_id', organization_id)
    validate_entry('hcp_project_id', project_name)
    validate_entry('hcp_project_name', project_name)

    const access_token = await get_access_token(client_id, client_secret)

    console.log('f: token', access_token)
    if (access_token) {
      debug(`access_token: ${mask_entry(access_token)}`)
      const secrets = await get_project_secrets(
        organization_id,
        project_id,
        project_name,
        access_token
      )

      if (secrets && secrets.length > 0) {
        const secrets_masked = secrets
          .map(it => `${mask_entry(it.name)}: ${mask_entry(it.version.value)}`)
          .join(',')
        const reduced_secrets = secrets.map(it => ({
          key: it.name.toString(),
          value: it.version.value.toString()
        }))

        debug(`hcp_secrets: ${secrets_masked}`)

        try {
          writeFileSync('hcp_secrets.json', JSON.stringify(reduced_secrets))
        } catch (err) {
          debug(`error writing secrets file: ${err}`)
          throw new Error('error writting secrets file')
        }
      }
    } else {
      throw new Error('access_token could not been retrieved')
    }
  } catch (error) {
    console.log('f: error', error)
    // Fail the workflow run if an error occurs
    if (error instanceof Error) setFailed(error.message)
  }
}
