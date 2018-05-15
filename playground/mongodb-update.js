const {MongoClient,ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,client)=>{
    if(err){
        console.log("unable to connect");
    }else{
        console.log("connected");
        const db = client.db("TodoApp");
        
        // db.collection("Todos").find({text:"Something to do"}).toArray()
        //     .then((docs)=>{
        //         console.log(`Todos ${JSON.stringify(docs,undefined,2)}`);
        //     },(err)=>{
        //         console.log("Cannot find",err);
        //     });
        db.collection("Todos").findOneAndUpdate(
            {_id: new ObjectID("5afad05687c4943b901ba421")},
            {
                $set:{
                    completed:true
                }
            },{
                returnOriginal:false
            })
            .then((result)=>{
                console.log(`Todos ${JSON.stringify(result,undefined,2)}`);
            },(err)=>{
                console.log("Cannot find",err);
            });
    }
    client.close();
});