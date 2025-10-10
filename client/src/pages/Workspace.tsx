import React, { useState,useEffect, useRef, useMemo } from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  MiniMap,
  Handle,
  Position,
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
  style?: React.CSSProperties;
}

const nodeTypesList = [
  { type: "llm", label: "LLM" },
  { type: "vector", label: "Vector DB" },
  { type: "extractor", label: "Document Extractor" },
];

const initialNodes: Node<AIFlowNodeData>[] = [
  { id: "1", type: "default", data: { label: "Start" }, position: { x: 50, y: 50 } },
  { id: "2", type: "default", data: { label: "Output" }, position: { x: 400, y: 50 } },
];

const initialEdges: Edge[] = [];

const DefaultNode = ({ data }: { data: AIFlowNodeData }) => {

  const bgMap: Record<string, string> = {
      "LLM": "bg-blue-400/15",
      "Vector DB": "bg-red-400/15",
      "Document Extractor": "bg-green-400/15",
  }
  
  return (
    <div style={{ position: "relative", ...data.style }} className={`${bgMap[data.label]} backdrop-blur-[1px] font-poppins`}>
      <Handle type="target" position={Position.Left} />
      <div className="text-[8px]">{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const styleMap: Record<string, React.CSSProperties> = {
      LLM: {
        color: "#fff",
        borderWidth: "7px 1px 1px 1px",
        borderStyle: "solid",
        borderColor: "#06b6d4",
        borderRadius: 5,
        padding: "10px 20px",
        fontWeight: "bold",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
        textAlign: "center",
      },
      "Vector DB": {
        color: "#fff",
        borderWidth: "7px 1px 1px 1px",
        borderStyle: "solid",
        borderColor: "#FF5858",
        borderRadius: 5,
        padding: "10px 15px",
        fontStyle: "italic",
        boxShadow: "inset 0 0 5px rgba(0,0,0,0.2)",
        textAlign: "center",
      },
      "Document Extractor": {
        color: "#fff",
        borderWidth: "7px 1px 1px 1px",
        borderStyle: "solid",
        borderColor: "#6EFF7F",
        borderRadius: 5,
        padding: "12px 16px",
        fontFamily: "monospace",
        fontWeight: "500",
        boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
        textAlign: "center",
      },
      Start: {
        color: "#fff",
        borderWidth: "7px 1px 1px 1px",
        borderStyle: "solid",
        borderColor: "#06b6d4",
        borderRadius: 5,
        width: 60,
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      },
      Output: {
        color: "#ffffff",
        borderWidth: "7px 1px 1px 1px",
        borderStyle: "solid",
        borderColor: "#06b6d4",
        borderRadius: 5,
        width: 60,
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      },
    };

export default function Flow() {
  const [nodes, setNodes] = useState<Node<AIFlowNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const nodeTypes = {
    default: DefaultNode,
  };

  const onNodesChange = (changes: NodeChange[]) =>
    setNodes((nds) => applyNodeChanges(changes, nds));

  const onEdgesChange = (changes: EdgeChange[]) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));

  const onConnect = (connection: Connection) =>
    setEdges((eds) => addEdge(connection, eds));

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, label: string) => {
    event.dataTransfer.setData("application/reactflow", label);
    event.dataTransfer.effectAllowed = "move";
  };

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
      data: { label,
      style: styleMap[label] || {
        background: "#fff",
        color: "#000",
        border: "1px solid #555",
        padding: 10,
      }},
      style: {
        background: "transparent",
        border: "0px",
      }
    };


    setNodes((nds) => nds.concat(newNode));
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();

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
    <Layout showFooter={false}>
      <div className="bg-[#2B3340] font-poppins">
      <div className="text-center text-[#D7FFCC] font-semibold text-[40px] pt-10">Create Your Workflow</div>
      <div className="text-center text-[#D7FFCC] opacity-[0.6] text-[18px] pb-10">These are the commands AI will be given</div>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-52 p-2 border-r border-gray-700 bg-gray-900">
          <h3 className="font-bold mb-2 text-[#9DD4B2]">Workflows</h3>
          <div className="flex flex-col gap-2">
            {nodeTypesList.map((node) => (
              <div key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.label)}
              style={{ position: "relative", ...styleMap[node.label] }} 
              className={`backdrop-blur-[1px] font-poppins cursor-pointer`}>
                <div className="text-[8px]">{node.label}</div>
              </div>
            ))}
          </div>
        </div>

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
            className="w-full h-full 
            bg-[url('/bg.svg')] 
            bg-center bg-[length:40%]"
            nodeTypes={nodeTypes}
          >
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </div>
      </div>
    </Layout>
  );
}