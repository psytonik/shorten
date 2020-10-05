const {Router} = require('express');
const Link = require('../model/Link');
const router = Router();

router.get('/:code',async (req,res)=>{
    try {
        const link = await Link.findOne({code: req.params.code});
        if(link){
            link.clicks++;
            await link.save();
            return res.redirect(link.from)
        }
        res.status(404).json({message:'Link not found'})
    }catch (e){
        res.status(500).json({message:e.message})
        console.error(e.message)
    }
})

module.exports = router;
