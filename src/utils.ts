import { HttpClient } from '@actions/http-client'
import {
  HCP_Secret,
  HCP_OAUTHTokenResponse,
  HCP_ProjectSecretsResponse,
  GetAccessTokImpl,
  GetProjectSecretsImpl
} from './types'

export const validate_entry = (
  key: string,
  value: string | null | undefined
): void => {
  if (value === null) {
    throw new Error(`entry: ${key} value is null`)
  }

  if (value === undefined) {
    throw new Error(`entry: ${key} value is undefined`)
  }

  if (value === '') {
    throw new Error(`entry: ${key} value is empty`)
  }
}

export const mask_entry = (value: string): string => {
  if (value?.length > 4) {
    const last_chars = value.substr(value.length - 4, value.length)
    return '****' + last_chars
  }
  return '****'
}

export const get_access_token: GetAccessTokImpl = async (
  client_id: string,
  client_secret: string
) => {
  let auth_token: string | undefined = undefined
  const client = new HttpClient('hcp_oath_token')

  const response = await client.postJson<HCP_OAUTHTokenResponse>(
    'https://auth.idp.hashicorp.com/oauth2/token',
    {
      client_id: client_id,
      client_secret: client_secret,
      grant_type: 'client_credentials',
      audience: 'https://api.hashicorp.cloud'
    },
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  )

  const { statusCode, result } = response
  if (statusCode === 200 && result?.access_token != undefined) {
    auth_token = result.access_token
  } else {
    throw new Error('unable to retrieve oauth token')
  }

  return auth_token
}

export const get_project_secrets: GetProjectSecretsImpl = async (
  organization_id: string,
  project_id: string,
  project_name: string,
  access_token: string
) => {
  let secrets: HCP_Secret[] | undefined = undefined
  const client = new HttpClient('hcp_project_secrets_open')
  const response = await client.getJson<HCP_ProjectSecretsResponse>(
    `https://api.cloud.hashicorp.com/secrets/2023-06-13/organizations/${organization_id}/projects/${project_id}/apps/${project_name}/open`,
    {
      Authorization: `Bearer ${access_token}`
    }
  )
  const { statusCode, result } = response

  if (statusCode === 200 && result?.secrets) {
    if (result.secrets.length === 0) {
      throw new Error('project found but empty')
    }

    secrets = result.secrets
  } else {
    throw new Error('unable to retrieve project secrets')
  }

  return secrets
}
