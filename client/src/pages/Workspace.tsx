import React, { useState,useEffect, useRef } from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  MiniMap,
} from "reactflow";
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  ReactFlowInstance,
  XYPosition,
} from "reactflow";
import "reactflow/dist/style.css";
import Layout from "../components/Layout/Layout";

interface AIFlowNodeData {
  label: string;
}

// Sidebar draggable blocks
const nodeTypesList = [
  { type: "llm", label: "LLM" },
  { type: "vector", label: "Vector DB" },
  { type: "extractor", label: "Document Extractor" },
];

// Initial nodes
const initialNodes: Node<AIFlowNodeData>[] = [
  { id: "1", type: "default", data: { label: "Start" }, position: { x: 50, y: 50 } },
  { id: "2", type: "default", data: { label: "Output" }, position: { x: 400, y: 50 } },
];

const initialEdges: Edge[] = [];

export default function Flow() {
  const [nodes, setNodes] = useState<Node<AIFlowNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onNodesChange = (changes: NodeChange[]) =>
    setNodes((nds) => applyNodeChanges(changes, nds));

  const onEdgesChange = (changes: EdgeChange[]) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));

  const onConnect = (connection: Connection) =>
    setEdges((eds) => addEdge(connection, eds));

  // Drag start from sidebar
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, label: string) => {
    event.dataTransfer.setData("application/reactflow", label);
    event.dataTransfer.effectAllowed = "move";
  };

  // Drop onto canvas
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!reactFlowWrapper.current || !reactFlowInstance) return;

    const label = event.dataTransfer.getData("application/reactflow");
    if (!label) return;

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position: XYPosition = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const newNode: Node<AIFlowNodeData> = {
      id: (nodes.length + 1).toString(),
      type: "default",
      position,
      data: { label },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();

  // Handle Delete key globally
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        setNodes((nds) => nds.filter((n) => !n.selected));
        setEdges((eds) => eds.filter((e) => !e.selected));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Layout>
        <div className="text-center text-xl">Create Your Workflow</div>
        <div className="text-center">These are the commands AI will be given</div>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-52 p-2 border-r border-gray-700 bg-gray-900">
          <h3 className="font-bold mb-2 text-[#7cfade]">Workflows</h3>
          {nodeTypesList.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.label)}
              className="p-2 mb-2 border border-gray-600 rounded cursor-grab text-center bg-gray-800 text-[#7cfade]"
            >
              {node.label}
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div ref={reactFlowWrapper} tabIndex={0} className="flex-1 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            onInit={setReactFlowInstance}
            className="w-full h-full"
          >
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </Layout>
  );
}