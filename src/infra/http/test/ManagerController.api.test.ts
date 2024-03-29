import axios from 'axios';

async function login(organizationId?) {
    const randomUser = Math.random().toString(36).slice(-10);
    const randomUser1 = Math.random().toString(36).slice(-10);
    const dataPostOrganization = {
      organization: {
          name: 'CAED Cacoal'
      },
      manager: {
          name: randomUser,
          password: '12345678',
          type: 'Servidor da CAED',
      }
  }
    const inputLogin = {
      user : dataPostOrganization.manager.name,
      password: dataPostOrganization.manager.password
    }
    const inputPostManager = {
      name: randomUser1,
      password: dataPostOrganization.manager.password,
      type: dataPostOrganization.manager.type
    }
    const organizationPost = await axios.post('https://sosa-repo-main.vercel.app/Organization',
    dataPostOrganization);
    const AxiosOutput = await axios.post(
      'https://sosa-repo-main.vercel.app/Admin',
      inputLogin
    );
    const managerPost = await axios.post(
      'https://sosa-repo-main.vercel.app/Admin/' + organizationId, inputPostManager,
      {
        headers: {authorization: AxiosOutput.data.token}
      },
    )
    const ObjectLogin = {
      manager: {
        name: organizationPost.data.name,
        password: dataPostOrganization.manager.password,
        type: organizationPost.data.type,
        id: organizationPost.data.id,
        organizationId: organizationPost.data.organizationId
      },
      token : AxiosOutput.data.token
    }
    return ObjectLogin
}

async function loginInApi() {
  const newLogin = await login()
  const inputLogin = {
      name: newLogin.manager.name,
      password: newLogin.manager.password,
  }
  const getToken = await axios.post("https://cafeteria-flow-control-backend.vercel.app/manager", inputLogin)
  const objectLogin = {
    name: inputLogin.name,
    password: inputLogin.password,
    token: getToken.data.token
  }
  return objectLogin
}

test("Deve testar o GetOne", async () => {
    const newLogin = await login()
    const newLoginInApi = await loginInApi()
    const getOne = await axios.get("https://cafeteria-flow-control-backend.vercel.app/manager" + '/' + newLogin.manager.name,
    {
      headers: {authorization: newLoginInApi.token}
    })
    expect(getOne.data).toBeDefined()
}, 15000)

test("Deve testar o Login", async() => {
    const newLogin = await login()
    const inputLogin = {
        name: newLogin.manager.name,
        password: newLogin.manager.password,
    }
    const getToken = await axios.post("https://cafeteria-flow-control-backend.vercel.app/manager", inputLogin)
    expect(getToken.data.token).toBeDefined()
}, 15000)