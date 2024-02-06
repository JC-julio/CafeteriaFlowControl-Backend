import axios from "axios";
import LogoutMongooseRepository from "../repositories/LogoutMongooseRepository"
import mongoose from "mongoose";
import { config } from 'dotenv';
config();

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
        type: organizationPost.data.type,
        id: organizationPost.data.id,
        organizationId: organizationPost.data.organizationId
      },
      token : AxiosOutput.data.token
    }
    return ObjectLogin
}

test("Deve testar o save do logout e o GetOne para verificá-lo", async() => {
  await mongoose.connect(process.env.connectionString as string);
  const newLogin = await login()
  const repoLogout = new LogoutMongooseRepository()
  await repoLogout.save(newLogin.token)
  const getToken = await repoLogout.GetOne(newLogin.token)
  expect(getToken).toBeDefined()
  await mongoose.connection.close();

}, 15000)