import { connect } from "mongoose"


export default class DbConnection {
  constructor(urlstring : string) {
    this.mongooseDbConnection(urlstring)
    .then((e)=>{
      // console.log(e)      
      console.log("connected to db")      
    })
    .catch((e) => {
      console.log("failed to connect to db")
      console.log(e)
    })
  }

  public mongooseDbConnection = async (urlstring: string) => {
    // Connecting to MongoDB 
    return await connect(urlstring);
  }

}
