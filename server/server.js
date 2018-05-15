const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

const {mongoose} = require("./db/mongoose");
const {Todo} = require("./models/todo");
const {User} = require("./models/user");

const app = express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    console.log(req.body);

    const newTodo = new Todo({
        text:req.body.text,
        completed:req.body.completed,
        completedAt:req.body.completedAt
    });
    newTodo.save().then(
        (docs)=>{
            res.send(docs);
        },
        (err)=>{
            res.status(400).send(err);
        }
    );
});

app.get('/todos',(req,res)=>{
    Todo.find()
        .then(
            (todos)=>{
                res.send({todos});
            },
            (err)=>{
                res.status(400).send(err);
            }
        )
});

app.get('/todos/:id',(req,res)=>{
    const id = req.params.id;
    if(!ObjectID.isValid(id)){
        res.status(404).send("Todo not found");
    }else{
        Todo.findById(id)
            .then(
                (todos)=>{
                    res.send({todos});
                },
                (err)=>{
                    res.status(400).send(err);
                }
            )
    }
});

app.listen(3000,()=>{
    console.log("Express is listening");
})


// const newTodo = new Todo({
//     text:"New Todo",
//     completed:false,
//     completedAt:123
// })
// newTodo.save().then(
//     (res)=>{
//         console.log(JSON.stringify(res,undefined,2));
//     },(err)=>{
//         console.log("cannot save new Todo "+err);
//     }
// );

// const newUser = new User({email:"sabbya2@g.com"});
// newUser.save()
//     .then(
//         (res)=>{
//             console.log(JSON.stringify(res,undefined,2));
//         },(err)=>{
//             console.log("cannot save new User "+err);
//         }  
//     )