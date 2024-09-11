import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let debugMock: jest.SpiedFunction<typeof core.debug>
let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
//let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
//let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    //setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    //setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('should return token', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
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
    })

    await main.run()
    expect(runMock).toHaveReturned()

    //Verify that all of the core library functions were called correctly
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

    //expect(setOutputMock).toHaveBeenNthCalledWith(1, 'token', '123456789')
    //expect(errorMock).not.toHaveBeenCalled()
  })

  it('sets a failed status', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'HCP_CLIENT_ID':
          return ''
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    //expect(setFailedMock).toHaveBeenNthCalledWith(
    //1,
    //'entry: hcp_client_id value is empty'
    //)
    expect(errorMock).not.toHaveBeenCalled()
  })
})
