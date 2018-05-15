const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,client)=>{
    if(err){
        console.log("unable to connect");
    }else{
        console.log("connected");
        const db = client.db("TodoApp");
        // db.collection("Todos").insertOne(
        //     {
        //         text:"Something else to do",
        //         completed:false
        //     },(err,result)=>{
        //         if(err){
        //             console.log("unable to insert",err);
        //         }else{
        //             console.log(JSON.stringify(result.ops,undefined,2));
        //         }
        //     }
        // )
        db.collection("Users").insertOne(
            {
                name:"Sabbyasachi",
                age:26,
                location:"Karnataka, Bangalore"
            },(err,result)=>{
                if(err){
                    console.log("Not able to insert a User",err);
                }else{
                    console.log(JSON.stringify(result.ops,undefined,2));
                }
            }
        )
    }
    client.close();
});