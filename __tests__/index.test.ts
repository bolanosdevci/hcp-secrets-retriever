import * as core from '@actions/core'
import * as main from '../src/main'
import * as utils from '../src/utils'

import {
  input_impl,
  get_access_tok_impl,
  get_project_secrets_impl
} from './impls'
import { GetAccessTokImpl, GetProjectSecretsImpl } from '../src/types'

const runMock = jest.spyOn(main, 'run').mockImplementation()
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let getAccessTokenMock: jest.SpiedFunction<typeof utils.get_access_token>
let getProjectSecretsMock: jest.SpiedFunction<typeof utils.get_project_secrets>

describe('index', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    getAccessTokenMock = jest
      .spyOn(utils, 'get_access_token')
      .mockImplementation()
    getProjectSecretsMock = jest
      .spyOn(utils, 'get_project_secrets')
      .mockImplementation()
  })

  it('calls run when imported', async () => {
    // happy path, all mocks are succesful
    mocks(input_impl.valid, get_access_tok_impl, get_project_secrets_impl)

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../src/index')

    expect(runMock).toHaveBeenCalled()
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
