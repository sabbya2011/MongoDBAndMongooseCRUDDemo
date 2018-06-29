const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const {ObjectID} = require("mongodb");

const {mongoose} = require("./db/mongoose");
const {Todo} = require("./models/todo");
const {User} = require("./models/user");

const {authenticateUser} = require("./middleware/authenticate")

const app = express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
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
                    if(!todos){
                        res.status(404).send("Todo not found");
                    }else{
                        res.send({todos});
                    }
                },
                (err)=>{
                    res.status(400).send(err);
                }
            ).catch(e=>{
                res.status(400).send();
            })
    }
});

app.delete('/todos/:id',(req,res)=>{
    const id = req.params.id;
    if(!ObjectID.isValid(id)){
        res.status(404).send("Todo not found");
    }else{
        Todo.findByIdAndRemove(id)
            .then(
                (todos)=>{
                    if(!todos){
                        res.status(404).send("Todo not found");
                    }else{
                        res.send({todos});
                    }
                },
                (err)=>{
                    res.status(400).send(err);
                }
            ).catch(e=>{
                res.status(400).send();
            })
    }
});

app.patch('/todos/:id',(req,res)=>{
    const id = req.params.id;
    if(!ObjectID.isValid(id)){
        res.status(404).res("Todo not found");
    }else{
        const body = _.pick(req.body,["text","completed"]);

        if(_.isBoolean(body.completed) && body.completed){
            body.completedAt = new Date().getTime();
        }else{
            body.completed = false;
        }
        Todo.findByIdAndUpdate(id,{$set:body},{new:true})
            .then(
                (todos)=>{
                    if(!todos){
                        res.status(404).send("Todo not found");
                    }else{
                        res.send({todos});
                    }
                },
                (err)=>{
                    res.status(400).send(err);
                }
            ).catch(e=>{
                res.status(400).send();
            })
    }
});


app.post('/users',(req,res)=>{
    const body = _.pick(req.body,["email","password"]);
    var user = new User(body);

    user.save().then(()=>{
            return user.generateAuthToken();
        })
        .then(
            (token)=>{res.header("x-auth",token).send(user)}
        )
        .catch(e=>{
            res.status(400).send(e);
        });
});

app.post('/users/login',(req,res)=>{
    const body = _.pick(req.body,["email","password"]);
    User.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header("x-auth",token).send(user);
        });
    })
    .catch(e=>res.status(400).send(e))
});

app.get('/users/me', authenticateUser,(req,res)=>{
    res.send(req.user);
});

app.listen(3000,()=>{
    console.log("Express is listening");
});


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