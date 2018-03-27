const express = require('express')
const bodyParser = require('body-parser')
const cryptoJs = require('crypto-js')
const hbs = require('hbs')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','hbs')

const port = process.env.PORT || 3030
//Change test to false for production
const test = true
//Production salt and key get it from payumoney
const SALT = ""
const MERCHANT_KEY = ""
//test salt and key get it from payumoney
const TEST_SALT = "eCwWELxi"
const TEST_KEY = "gtKFFx"
// hashSequence "key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10";

//function to generate random txnid , 21 characters
function genTxnid(){
  const d = new Date()
  let gentxnid = cryptoJs.SHA256(Math.floor((Math.random()*10)+1).toString()+d.getTime().toString())
  return 'v'+gentxnid.toString().substr(0,20)
}
//get hash as json request 
app.post('/hash',(req,res)=>{
  console.log(req.body);
  let hashSequence = "key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10"
  hashSequence = hashSequence.split('|')
  let hash= ''

  if(!("txnid" in req.body)){
    req.body.txnid = genTxnid()
  }
  if(test){
      req.body.key = TEST_KEY

  }
  else {
      req.body.key = MERCHANT_KEY
  }
  hashSequence.map((val)=>{
    if(val in req.body)
      hash += req.body[val]
    else
      hash += ''
    hash +='|'
  })
  if(test){
    hash+=TEST_SALT
    req.body.salt=TEST_SALT
  }
  else{
    hash+=SALT
    req.body.salt=SALT
  }


  hash = cryptoJs.SHA512(hash).toString()

  res.send({body:req.body,hash})

})
app.get('/payumoneyform',(req,res)=>{

  res.render('payumoneyForm.hbs',{
    key:'',
    hash:'',
    txnid:'',
    action:''
  })
})

app.post('/payumoneyform',(req,res)=>{

  let hashSequence = "key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10"
  hashSequence = hashSequence.split('|')
  let hash= ''

  if(!("txnid" in req.body)){
    req.body.txnid = genTxnid()
  }
  else{
    if(req.body["txnid"] === '')
      req.body.txnid = genTxnid()
  }
  if(test){
      req.body.key = TEST_KEY

  }
  else {
      req.body.key = MERCHANT_KEY
  }
  hashSequence.map((val)=>{
    if(val in req.body)
      hash += req.body[val]
    else
      hash += ''
    hash +='|'
  })
  if(test){
    hash+=TEST_SALT
    req.body.salt=TEST_SALT
  }
  else{
    hash+=SALT
    req.body.salt=SALT
  }


  hash = cryptoJs.SHA512(hash).toString()
  console.log(req.body);
  res.render('payumoneyForm.hbs',{
    key:req.body.key,
    hash:hash,
    txnid:req.body.txnid,
    action:"https://test.payu.in/_payment",
    amount:req.body.amount,
    firstname:req.body.firstname,
    email:req.body.email,
    phone:req.body.phone,
    productinfo:req.body.productinfo,
    surl:req.body.surl,
    furl:req.body.furl,
    lastname:req.body.lastname,
    curl:req.body.curl,
    address1:req.body.address2,
    city:req.body.city,
    state:req.body.state,
    country:req.body.country,
    zipcode:req.body.zipcode,
    udf1:req.body.udf1,
    udf2:req.body.udf2,
    udf3:req.body.udf3,
    udf4:req.body.udf4,
    udf5:req.body.udf5,
    pg:req.body.pg,
  })
})
app.listen(port,()=>{
  console.log(`Server Started at port ${port}`);
})
