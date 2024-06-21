const express = require("express")
const path = require("path")
const app = express()
const port = process.env.PORT || 5000
 const hbs=require("hbs")
 const collection=require("./mongodb")
 
const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
 
app.use(express.json());
app.set("view engine","hbs");
app.set("views",tempelatePath);
app.use(express.urlencoded({extended:false}))



app.get('/', (req, res) => {
    res.render("login")
})

app.get('/signup', (req, res) => {
    res.render("signup")
})




app.post('/signup', async (req, res) => {

    const data = {
        
        userName: req.body.userName,
        email:req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        
    }

    

    const checking = await collection.findOne({ email: req.body.email})

    console.log(checking);

   try{

    if(checking==null){
        
       
        if(data.password!=data.confirmPassword){
            res.send("password does not match")
        }
        else{
            await collection.insertMany([data])
        res.status(201).render("home", {
        naming: req.body.email
        })
    
        }
        
        
    }
    else{
        res.send("user details already exists")
     }
     

    }
   catch(e){
    res.send(e)
   }
      
     
})

// app.post('/signup', async (req, res) => {
    
  
//     const data = {
//         name: req.body.name,
//         password: req.body.password
//     }

//      await collection.insertMany([data]);

//      res.send(`${req.body.name}`);

// })


app.post('/login', async (req, res) => {

    try {
        const check = await collection.findOne({ email: req.body.email })

        if (check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.email}+${req.body.password}` })
        }

        else {
            res.send("incorrect password")
        }


    } 
    
    catch{

        res.send("account does not exist")
        

    }


}) 

app.listen(port, () => {
    console.log('port connected');
})