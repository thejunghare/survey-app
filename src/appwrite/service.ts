import { ID, Account, Client , Databases,Storage, Query } from 'appwrite'
import { toast } from "./toast";

const client = new Client();

const APPWRITE_ENDPOINT: string = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID: string = '6648c699000032e4623c';

type CreateUserAccount = {
  email: string;
  password: string;
  name: string
}

type LoginUserAccount = {
  email: string;
  password: string;
}

class AppwriteService {
  account;

  constructor() {
    client
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID)

    this.account = new Account(client)
  }

  //create a new record of user inside appwrite

  async createAccount({ email, password, name }: CreateUserAccount) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      )
      if (userAccount) {
        //TODO: create login feature
        return this.login({ email, password })
      } else {
        return userAccount
      }
    } catch (error) {
      toast(String(error))
      console.log("Appwrite service :: createAccount() :: " + error);

    }
  }

  async login({ email, password }: LoginUserAccount) {
    try {
      return await this.account.createEmailPasswordSession(email, password)
    } catch (error) {
      toast(String(error))
      console.log("Appwrite service :: loginAccount() :: " + error);

    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get()
    } catch (error) {
      console.log("Appwrite service :: getCurrentAccount() :: " + error);
    }
  }

  async logout() {
    try {
      return await this.account.deleteSession('current')
    } catch (error) {
      console.log("Appwrite service :: getCurrentAccount() :: " + error);
    }
  }
}

export default AppwriteService;
export const databases = new Databases (client)
//export const query = new Query(client)
const storage = new Storage(client);
