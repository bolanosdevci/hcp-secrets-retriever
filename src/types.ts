export interface HCP_Version {
  version: string
  type: string
  created_at: string
  value: string
  created_by: HCP_User
  created_by_id: string
}

export interface HCP_User {
  name: string
  type: string
  email: string
}

export interface HCP_Secret {
  name: string
  version: HCP_Version
  created_at: string
  created_by: HCP_User
  created_by_id: string
}

export interface HCP_OAUTHTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

export interface HCP_ProjectSecretsResponse {
  secrets: HCP_Secret[] | null
}

export type InputImpl = (name: string) => string

export type GetAccessTokImpl = (
  client_id: string,
  client_secret: string
) => Promise<string | undefined>

export type GetProjectSecretsImpl = (
  organization_id: string,
  project_id: string,
  project_name: string,
  access_token: string
) => Promise<HCP_Secret[] | undefined>
