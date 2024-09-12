import * as core from '@actions/core'
import * as main from '../src/main'
import * as utils from '../src/utils'
import { GetAccessTokImpl, GetProjectSecretsImpl } from '../src/types'

import {
  input_impl,
  get_access_tok_impl,
  get_project_secrets_impl
} from './impls'

const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let debugMock: jest.SpiedFunction<typeof core.debug>
let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let getAccessTokenMock: jest.SpiedFunction<typeof utils.get_access_token>
let getProjectSecretsMock: jest.SpiedFunction<typeof utils.get_project_secrets>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    getAccessTokenMock = jest
      .spyOn(utils, 'get_access_token')
      .mockImplementation()
    getProjectSecretsMock = jest
      .spyOn(utils, 'get_project_secrets')
      .mockImplementation()
  })

  it('should return secrets', async () => {
    mocks(input_impl.valid, get_access_tok_impl, get_project_secrets_impl)

    await main.run()
    expect(runMock).toHaveReturned()

    expect(debugMock).toHaveBeenNthCalledWith(
      1,
      JSON.stringify({
        client_id: '****4321',
        client_secret: '****2345',
        organization_id: '****4582',
        project_id: '****8564',
        project_name: '****name'
      })
    )

    expect(errorMock).not.toHaveBeenCalled()
  })

  it('sets a failed status', async () => {
    mocks(input_impl.invalid, get_access_tok_impl, get_project_secrets_impl)

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'entry: hcp_client_id value is empty'
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  const mocks = (
    inputImpl: (name: string) => string,
    getAccessTokImpl: GetAccessTokImpl,
    getProjectSecretsImpl: GetProjectSecretsImpl
  ): void => {
    getInputMock.mockImplementation(inputImpl)
    getAccessTokenMock.mockImplementation(getAccessTokImpl)
    getProjectSecretsMock.mockImplementation(getProjectSecretsImpl)
  }
})
