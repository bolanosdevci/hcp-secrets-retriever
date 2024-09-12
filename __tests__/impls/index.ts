import {
  GetAccessTokImpl,
  GetProjectSecretsImpl,
  HCP_Secret,
  HCP_User
} from '../../src//types'

const created_by: HCP_User = {
  name: 'cbolanos',
  type: 'user_type',
  email: 'cbolanos@foo.com'
}

const created_by_id = '1'
const created_at = '1/1/1000'

export const input_impl = {
  valid: (name: string) => {
    switch (name) {
      case 'hcp_client_id':
        return '54321'
      case 'hcp_client_secret':
        return '12345'
      case 'hcp_organization_id':
        return '64582'
      case 'hcp_project_id':
        return '28564'
      case 'hcp_project_name':
        return 'project_name'

      default:
        return ''
    }
  },
  invalid: (name: string) => {
    switch (name) {
      case 'HCP_CLIENT_ID':
        return ''
      default:
        return ''
    }
  }
}

export const get_access_tok_impl: GetAccessTokImpl = async (
  client_id: string,
  client_secret: string
) => {
  switch (client_id) {
    default:
      return `valid_token_${client_secret}`
  }
}

export const get_project_secrets_impl: GetProjectSecretsImpl = async (
  organization_id: string,
  project_id: string,
  project_name: string,
  access_token: string
) => {
  switch (organization_id) {
    default:
      return [
        // It doesnt mater I'm returning the same values as kv, this is only for unit test to avoid calling the hpc secrets api
        generate_secret('project_name', project_name),
        generate_secret('project_id', project_id),
        generate_secret('access_token', access_token)
      ]
  }
}

const generate_secret = (key: string, value: string): HCP_Secret => {
  return {
    name: key,
    version: {
      version: '1',
      type: 'kv',
      value,
      created_by_id,
      created_by,
      created_at
    },
    created_at,
    created_by_id,
    created_by
  }
}
