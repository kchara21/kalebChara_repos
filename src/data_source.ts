import { DataSource } from "typeorm";
import { URL } from "url";


const dbUrl = new URL(process.env.DATABASE_URL!);
const routingId = dbUrl.searchParams.get("options");
dbUrl.searchParams.delete("options");

export const AppDataSource = new DataSource({
  type: "cockroachdb",
  url: dbUrl.toString(),
  ssl: true,
  synchronize:true,
  entities:[
    "src/entities/**/*.ts"],
  extra: {
    options: routingId
  },
});


AppDataSource.initialize()
.then((res) => {
   console.log('db connected');
})
.catch((error) => console.log(error))
