import {Router} from "express"
import { NodeVM } from "vm2";
import { PrismaClient } from "@prisma/client";
import validateBody from "../middlewares/validateBody.js";

const prisma = new PrismaClient();

const router = Router();

router.post("/save-code", validateBody([
  { key: "userId", type: "number", required: true },
  { key: "codeName", type: "string", required: true },
  { key: "code", type: "string", required: true },
]), async (req, res) => {
  try {
    const { userId, codeName, code } = req.body;
    const parsedUserId = parseInt(userId);

    // Find the User
    let user = await prisma.user.findUnique({
      where: { id: parsedUserId },
    });

    // Create the User if not Exists
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Upsert Custom Code
    const customCode = await prisma.customCode.upsert({
      where: {
        userId_codeName: {
          userId: user.id,
          codeName,
        },
      },
      update: {
        code, // overwrite existing code
      },
      create: {
        userId: user.id,
        codeName,
        code,
      },
    });

    res.json({ success: true, customCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save code" });
  }
});


router.post("/run-code", async (req, res) => {
  const { userId, codeName, input } = req.body;
  console.log(req.body)
  if (!userId || !codeName) {
    return res.status(400).json({ error: "userId and codeName are required" });
  }

  try {
    // Fetch code from database
    const customCode = await prisma.customCode.findFirst({
      where: {
        userId: parseInt(userId),
        codeName,
      },
    });
    
    if (!customCode) {
      return res.status(404).json({ error: "Code not found for this user" });
    }
    
    const code = customCode.code;

    // Create a VM sandbox
    const vm = new NodeVM({
      console: "off",   // disable console.log
      sandbox: {},
      timeout: 1000,    // max execution 1 second
      eval: false,
      wasm: false,
    });

    const wrappedCode = `
  module.exports = (input) => {
    ${code}
  };
`;

const userFunc = vm.run(wrappedCode);
console.log("inside custom")
const output = userFunc(input);
console.log(output)
    res.json({ output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router