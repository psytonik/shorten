const {Router} = require('express');
const Link = require('../model/Link');
const config = require('config');
const shortId = require('shortid')
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

router.post('/generate', authMiddleware, async (req,res) =>{
    try {
        const baseUrl = config.get('baseURI');
        const {from} = req.body;
        const code = shortId.generate();
        const existing = await Link.findOne({from });
        if(existing){
            return res.status(200).json({link:existing});
        }
        const to = baseUrl + "/t/" + code;
        const link = new Link({code,to,from});
        await link.save();
        return res.status(201).json({link});
    }catch (e){
        res.status(500).json({message:e.message})
        console.error(e.message)
    }
});
router.get('/', authMiddleware, async(req,res)=>{
    try {

        const links = await Link.find({owner:req.user.userId});
        return res.json(links)
    }catch (e){
        res.status(500).json({message:e.message})
        console.error(e.message)
    }
});
router.get('/:id',authMiddleware, async(req,res)=>{
    try {
        const link = await Link.findById(req.params.id);
        return res.json(link)
    }catch (e){
        res.status(500).json({message:e.message})
        console.error(e.message)
    }
});
module.exports = router;
