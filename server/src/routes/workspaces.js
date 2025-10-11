import { Router } from "express";
import { PrismaClient } from '@prisma/client';
import validateBody from "../middlewares/validateBody.js";
import { defaultWorkflow } from "../utils/defaultWorkflow.js";

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
                workflow: defaultWorkflow
            }
        });
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

router.post('/get', validateBody([
    { key: 'userId', type: 'number', required: true }
]), async (req, res) => {
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
                        id: true,
                        name: true,
                        description: true,
                        members: true,
                        workflow: true,
                    }
                }
            }  
        });
        res.status(200).json({ personalWorkspaces, teams: teams.map(t => t.team) });
    } catch(err) {
        console.error("Server Error: ", err);
        res.status(500).json({ error: 'Failed to get Workspaces' + err})
    }
});

router.post('/create-personal-workspace', validateBody([
    { key: 'userId', type: 'number', required: true },
    { key: 'name', type: 'string', required: true },
    { key: 'description', type: 'string' }
]), async (req, res) => {
    try {
        const { userId, name, description } = req.body;
        const workspace = await prisma.personalWorkspace.create({
            data: {
                name,
                description,
                ownerId: userId,
                workflow: defaultWorkflow
            }
        });
        res.status(201).json({ workspace });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create workspace' + error });
    }
});

router.post('/add-team-member', validateBody([
    { key: 'teamId', type: 'number', required: true },
    { key: 'userId', type: 'number', required: true },
]), async(req, res) => {
    try {
        const { teamId, userId } = req.body;
        const teamMember = await prisma.teamMember.create({
            data: {
                teamId,
                userId
            }
        });
        return res.status(200).json({ message: "Member added successfully", teamMember });
    } catch(err) {
        console.error("Server Error: ", err);
        return res.status(500).json({ error: 'Failed to add member' + err})
    }
});

router.post('/save-workflow', validateBody([
    { key: 'workspaceId', type: 'number', required: true },
    { key: 'workflow', type: 'object', required: true },
]), async(req, res) => {
    try {
        const { workspaceId, nodes, edges } = req.body;
        const workspace = await prisma.personalWorkspace.update({
            where: { id: workspaceId },
            data: { workflow }
        });
        return res.status(200).json({ message: "Workflow saved successfully", workspace });
    } catch(err) {
        console.error("Server Error: ", err);
        return res.status(500).json({ error: 'Failed to save workflow' + err})
    }
})

router.post('/save-team-workflow', validateBody([
    { key: 'teamId', type: 'number', required: true },
    { key: 'workflow', type: 'object', required: true },
]), async(req, res) => {
    try {
        const { teamId, nodes, edges } = req.body;
        const workspace = await prisma.team.update({
            where: { id: teamId },
            data: { workflow }
        });
        return res.status(200).json({ message: "Workflow saved successfully", workspace });
    } catch(err) {
        console.error("Server Error: ", err);
        return res.status(500).json({ error: 'Failed to save workflow' + err})
    }
});

router.post('/get-workflow', validateBody([
    { key: 'workspaceId', type: 'number', required: true },
]), async(req, res) => {
    try {
        const { workspaceId } = req.body;
        const workspace = await prisma.personalWorkspace.findUnique({
            where: { id: workspaceId },
            select: { workflow: true }
        });
        return res.status(200).json({ workflow: workspace.workflow });
    } catch(err) {
        console.error("Server Error: ", err);
        return res.status(500).json({ error: 'Failed to get workflow' + err})
    }
});

router.post('get-team-workflow', validateBody([
    { key: 'teamId', type: 'number', required: true },
]), async(req, res) => {
    try {
        const { teamId } = req.body;
        const workspace = await prisma.team.findUnique({
            where: { id: teamId },
            select: { workflow: true }
        });
        return res.status(200).json({ workflow: workspace.workflow });
    } catch(err) {
        console.error("Server Error: ", err);
        return res.status(500).json({ error: 'Failed to get workflow' + err})
    }
});

export default router;