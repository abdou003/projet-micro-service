var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const tag = require('../models/tag');
const image = require('../models/image');



// houni najamch nab3eth l id 
//ta3 l 'image fel h2 khatr reellement mezel matsabech
// donc najamch na3ref chnya l id bch hata nab3thou fel micro service ta3 node
//donc nekhdmou par name et on suppose rahou unique si nn zidou attribut Ref unique wekhdemou aaalih (ez pz)
router.post('/add/:ref', function(req, res, next) {
    let Object_image = new image( {
        hdbId: req.params.ref
    });
    Object_image.save();

    for(let tagName of req.body.tags){
        tag.findOne({nameTag : tagName}).then(res=>{
            if(res){
                tag.update(
                    { "nameTag": tagName},
                    { "$push": { "images": Object_image._id } },
                    function (err, raw) {
                        if (err) return handleError(err);
                        console.log('The raw response from Mongo was ', raw);
                    }
                 );

                 console.log('found it')
            }
            else{
                let imgs =[]
                imgs.push(Object_image._id)
                let Object_tag =new tag({
                    nameTag : tagName,
                    images :imgs
                })
                Object_tag.save();
                console.log('new tag')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
  res.send("ok") 
});
router.post('/update/:ref', async function(req, res, next) {
    let img = new image({
        hdbId : req.params.ref 
       })
    
    await image.findOne({ hdbId : req.params.ref}).then(res => { 
        if(res)
        res.remove( function (err) {
        if (err) return handleError(err);
        console.log('deleted');
        });
    }).catch(err=>{
        console.log(err)
    })
    
  
    let Object_image = new image( {
        hdbId: req.params.ref
    });
    Object_image.save();

    for(let tagName of req.body.tags){
        await tag.findOne({nameTag : tagName}).then(res=>{
            if(res){
                tag.update(
                    { "nameTag": tagName},
                    { "$push": { "images": Object_image._id } },
                    function (err, raw) {
                        if (err) return handleError(err);
                        console.log('The raw response from Mongo was ', raw);
                    }
                 );

                 console.log('found it')
            }
            else{
                let imgs =[]
                imgs.push(Object_image._id)
                let Object_tag =new tag({
                    nameTag : tagName,
                    images :imgs
                })
                Object_tag.save();
                console.log('new tag')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
  res.send("ok") 


});
router.get('/delete/:id', function (req, res, next) {
   
    tag.deleteOne({ _id: req.params.id }).then(() => {
        console.log('tag deleted')
       res.send('tag deleted')
    }).catch((err) => {
       res.send('error')
    })

});

router.get('/reco/:id',async function(req,res,next){
   
         await tag.aggregate([
            {
                $lookup: {
                    from: "images",
                    localField: "images",
                    foreignField: "_id",
                    as: "image"
                }
            },
            {
                $match: { image: { $elemMatch: { hdbId: Number(req.params.id) } } }
            }
    
        ]).then(data => {
            console.log(data)
            let rec = new Set()
            let j;
            let result=[];
            for(d of data){
                j=1;
                while(j<=5){
                for (i of d.image){
                    rec.add(i.hdbId)
                }
                j++;
            }
            }
            rec.delete(Number(req.params.id))

            console.log('///////////////////////////////')
            rec.forEach(x=>{result.push(x)})
            console.log(result)
            res.send(result)

        }).catch(err => {
            console.log(err)
        });
    
        
    
    

});
module.exports = router;
