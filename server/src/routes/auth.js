import { Router } from "express";
import axios from "axios";
import jwt from 'jsonwebtoken'
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = Router();

const CLIENT = process.env.CLIENT;
const SECRET = process.env.SECRET;
const PASS = process.env.PASS;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;



const getToken = (id, name, email, role,)=>{
    return jwt.sign({id,name,email,role,},SECRET);
}

router.get("/google",(req,res)=>{
  try{
    const scope = ['https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile'].join(' ');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT}&redirect_uri=${encodeURIComponent("http://localhost:8000/auth/google/callback")}&scope=${scope}&access_type=offline&prompt=consent`;
    res.redirect(authUrl);
  }
  catch(err){
    console.log(err)
  }
    
})

router.get("/google/callback",async (req,res)=>{
    const code = req.query.code;
    if (!code) {
        return res.status(400).send('No code received');
    }
    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({code,client_id: CLIENT,client_secret: PASS,redirect_uri: GOOGLE_REDIRECT_URI,grant_type: 'authorization_code',}), {headers: {'Content-Type': 'application/x-www-form-urlencoded',},});
        const {access_token} = tokenResponse.data;
        const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {headers: {Authorization: `Bearer ${access_token}`,},});
        const profile = userInfoRes.data;
        const {name,email,sub,} = profile;
        let user = await prisma.user.findUnique({where: {email,},});
        if (!user){
            user = await prisma.user.create({
                data: {
                name,
                email,
                },
            });
        } 
        const token = getToken(user.id, user.name, user.email);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
        res.redirect('http://localhost:5173/');
    }
    catch (err) {
        console.error('OAuth callback error:', err.message);
        res.status(500).send('OAuth failed');
    }
});


router.get('/verify',async (request, response) => {
  try {
    const token = request.cookies.jwt;
    if (!token) return response.status(401).json({ message: 'Not Logged in' });

    const decoded = jwt.verify(token, SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id},
    });
    if (!user) return response.status(401).json({ message: 'Invalid user' });
    response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name:user.name
      },
    });
  } 
  catch {
    return response.status(401).json({
      message: 'Unauthorized',
    });
  }
});

export default router;