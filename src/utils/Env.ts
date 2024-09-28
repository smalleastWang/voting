import { Address } from 'viem'

// export interface IEnv {
//   PORT: string
//   ADDRESS: string
//   API_DOMAIN: string
//   API_KEY: string
//   API_SECRET: string
//   JWT: string
// }

class Env {
  private static instance: Env;

  public port: number;
  public baseUrl: string;
  public votingAddress: Address;
  public apiDomain: string;
  public apiKey: string;
  public apiSecret: string;
  public jwt: string;
  public imgDomain: string;
  public cosSecretId: string;
  public cosSecretKey: string;
  
  private constructor() {
    const envJson = import.meta.env
    this.port = envJson.VOTING_PORT
    this.baseUrl = envJson.VOTING_BASE
    this.votingAddress = envJson.VOTING_ADDRESS
    this.apiDomain = envJson.VOTING_API_DOMAIN
    this.apiKey = envJson.VOTING_API_KEY
    this.apiSecret = envJson.VOTING_API_SECRET
    this.jwt = envJson.VOTING_JWT
    this.imgDomain = envJson.VOTING_IMG_DOMAIN
    this.cosSecretId = envJson.VOTING_COS_SECRETID
    this.cosSecretKey = envJson.VOTING_COS_SECRETKEY
  }

  public static getInstance() {
    if (!Env.instance) {
      Env.instance = new Env();
    }
    return Env.instance;
  }
}
export default Env.getInstance();