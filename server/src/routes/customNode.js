import {Router} from "express"
import { NodeVM } from "vm2";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = Router();
router.post("/save-code", async (req, res) => {
  const { userId, codeName, code } = req.body;

  // Validate input
  if (!userId || !codeName || !code) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const parsedUserId = parseInt(userId);

    // Find the user
    let user = await prisma.user.findUnique({
      where: { id: parsedUserId },
    });

    // Create the user if not exists
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: parsedUserId,        
          email: `user${parsedUserId}@example.com`, 
          name: `User${parsedUserId}`,
          password: "defaultpassword", 
        },
      });
    }

    // Upsert custom code: create new or overwrite existing
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