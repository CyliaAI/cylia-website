import { Router } from "express";
import { PrismaClient } from '@prisma/client';
import validateBody from "../middlewares/validateBody.js";

const prisma = new PrismaClient();

const router = Router();

router.post('/create-team', validateBody([
    { key: 'userId', type: 'number', required: true },
    { key: 'name', type: 'string', required: true },
    { key: 'description', type: 'string' }
]), async (req, res) => {
    try {
        const { userId, name, description } = req.body;
        const team = await prisma.team.create({
            data: {
                name,
                description,
                ownerId: userId,
            }
        });
        //No description in schema
        const teamWithUser = await prisma.teamMember.create({
            data: {
                teamId: team.id,
                userId: userId,
            }
        })

        res.status(201).json({ team });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create team' });
    }
});

router.post('/get', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ message: "No User Found"});
        
        const personalWorkspaces = await prisma.personalWorkspace.findMany({
            where: {
                ownerId: userId
            }
        })
        
        const teams = await prisma.teamMember.findMany({
            where: {
                userId,
            },
            select: {
                team: {
                    select: {
                        name: true,
                        description: true,
                        members: true,
                    }
                }
            }  
        });
        res.status(200).json({ personalWorkspaces, teams: teams.map(t => t.team) });
    } catch(err) {
        console.error("Server Error: ", err);
        res.status(500).json({ error: 'Failed to get Workspaces' + err})
    }
})

export default router;