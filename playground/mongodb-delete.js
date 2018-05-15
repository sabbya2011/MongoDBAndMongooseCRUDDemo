const {MongoClient,ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,client)=>{
    if(err){
        console.log("unable to connect");
    }else{
        console.log("connected");
        const db = client.db("TodoApp");
        
       
        db.collection("Todos").deleteMany({active:true})
            .then((result)=>{
                console.log(`Todos ${result}`);
            },(err)=>{
                console.log("Cannot find",err);
            });

        db.collection("Todos").deleteOne({active:true})
            .then((result)=>{
                console.log(`Todos ${result}`);
            },(err)=>{
                console.log("Cannot find",err);
            });
        db.collection("Todos").findOneAndDelete({active:true})
            .then((result)=>{
                console.log(`Todos ${result}`);
            },(err)=>{
                console.log("Cannot find",err);
            });
    }
    client.close();
});