import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position,
} from 'reactflow';
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  ReactFlowInstance,
  XYPosition,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Layout from '../components/Layout/Layout';
import Dropdown from '@/components/Workspace/Dropdown';
import { UploadBox } from '@/utils/UploadBox';
import Chatbot from '@/components/Workspace/Chatbot';

interface AIFlowNodeData {
  label: string;
  style?: React.CSSProperties;
  type?: string;
  component?: React.ReactNode;
}

type NodeType = {
  type: 'BEGIN' | 'MID' | 'END';
  label: string;
  component: React.ReactElement;
};

const nodeTypesList: NodeType[] = [
  {
    type: 'MID',
    label: 'LLM',
    component: (
      <Dropdown
        label="Select Model"
        options={['gpt-4', 'gpt-3.5-turbo', 'claude-3', 'llama-2-13b', 'mpt-7b', 'falcon-40b']}
      />
    ),
  },
  {
    type: 'MID',
    label: 'Vector DB',
    component: (
      <Dropdown label="Select DB" options={['Faiss', 'pgvector', 'Pinecone', 'Qdrant (Managed)']} />
    ),
  },
  {
    type: 'MID',
    label: 'Schedule',
    component: (
      <div className="flex flex-col gap-1">
        <div className="text-[6px] text-gray-400 font-semibold">
          This will perform the operation at the scheduled time
        </div>
        <input
          type="time"
          placeholder="Enter delay in seconds..."
          className="mt-1 px-3 py-1 text-[6px] w-fit border border-gray-300 rounded-sm"
        />
        <input
          type="date"
          placeholder="Enter scheduled time"
          className="mt-1 px-3 py-1 text-[6px] w-30 border border-gray-300 rounded-sm"
        />
      </div>
    ),
  },
  {
    type: 'END',
    label: 'File to Text',
    component: <div className="text-[6px] text-gray-400 font-semibold">Yea Sure Lol</div>,
  },
  {
    type: 'END',
    label: 'RAG',
    component: (
      <div className="text-[6px] text-gray-400 font-semibold">
        This will retrieve relevant info from the specified vectorDB
      </div>
    ),
  },
  {
    type: 'END',
    label: 'Send Email',
    component: (
      <div className="flex flex-col gap-1">
        <div className="text-[6px] text-gray-400 font-semibold">
          This will send an email to the specified address
        </div>
        <input
          type="text"
          placeholder="Enter email address"
          className="mt-1 px-3 py-1 text-[6px] w-fit border border-gray-300 rounded-sm"
        />
        <input
          type="text"
          placeholder="Enter Subject"
          className="mt-1 px-3 py-1 text-[6px] w-30 border border-gray-300 rounded-sm"
        />
      </div>
    ),
  },
  {
    type: 'BEGIN',
    label: 'Document Extractor',
    component: <UploadBox uploadUrl={`${import.meta.env.BACKEND_URL}/upload`} />,
  },
];

const initialNodes: Node<AIFlowNodeData>[] = [
  { id: '1', type: 'default', data: { label: 'Start' }, position: { x: 50, y: 50 } },
  { id: '2', type: 'default', data: { label: 'Output' }, position: { x: 400, y: 50 } },
];

const initialEdges: Edge[] = [];

const DefaultNode = ({ data }: { data: AIFlowNodeData }) => {
  const bgMap: Record<string, string> = {
    MID: 'bg-blue-400/15',
    END: 'bg-red-400/15',
    BEGIN: 'bg-green-400/15',
  };

  return (
    <div
      style={{ position: 'relative', ...data.style }}
      className={`${bgMap[data.type]} ${data.label == 'Start' || data.label == 'Output' ? 'w-full' : 'w-fit'} backdrop-blur-[1px] font-poppins`}
    >
      {data.label !== 'Start' && <Handle type="target" position={Position.Left} />}
      <div className="text-[8px] mb-2">{data.label}</div>
      <div>{React.isValidElement(data.component) ? data.component : null}</div>
      {data.label !== 'Output' && <Handle type="source" position={Position.Right} />}
    </div>
  );
};

const styleMap: Record<string, React.CSSProperties> = {
  MID: {
    color: '#fff',
    borderWidth: '7px 1px 1px 1px',
    borderStyle: 'solid',
    borderColor: '#06b6d4',
    borderRadius: 5,
    padding: '10px 20px',
    fontWeight: 'bold',
    boxShadow: '2px 2px 10px rgba(0,0,0,0.3)',
    textAlign: 'center',
  },
  END: {
    color: '#fff',
    borderWidth: '7px 1px 1px 1px',
    borderStyle: 'solid',
    borderColor: '#FF5858',
    borderRadius: 5,
    padding: '10px 15px',
    fontStyle: 'italic',
    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  BEGIN: {
    color: '#fff',
    borderWidth: '7px 1px 1px 1px',
    borderStyle: 'solid',
    borderColor: '#6EFF7F',
    borderRadius: 5,
    padding: '12px 16px',
    fontFamily: 'monospace',
    fontWeight: '500',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  Start: {
    color: '#fff',
    borderWidth: '7px 1px 1px 1px',
    borderStyle: 'solid',
    borderColor: '#06b6d4',
    borderRadius: 5,
    padding: '12px 16px',
    width: 60,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    textAlign: 'center',
  },
  Output: {
    color: '#ffffff',
    borderWidth: '7px 1px 1px 1px',
    borderStyle: 'solid',
    borderColor: '#06b6d4',
    borderRadius: 5,
    width: 60,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  },
};

const getNodeSequence = (nodes: Node<AIFlowNodeData>[], edges: Edge[]) => {
  // Map nodeId -> node
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Map nodeId -> next nodeId
  const adjacency: Record<string, string[]> = {};
  edges.forEach((e) => {
    if (!adjacency[e.source]) adjacency[e.source] = [];
    adjacency[e.source].push(e.target);
  });

  return { nodeMap, adjacency };
};

const traverseNodes = (startId: string, adjacency: Record<string, string[]>, visited = new Set<string>()) => {
  const sequence: string[] = [];
  const dfs = (nodeId: string) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    sequence.push(nodeId);

    const neighbors = adjacency[nodeId] || [];
    neighbors.forEach(dfs);
  };
  dfs(startId);
  return sequence;
};

export default function Flow() {
  const [nodes, setNodes] = useState<Node<AIFlowNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const { nodeMap, adjacency } = getNodeSequence(nodes, edges);
  const sequenceIds = traverseNodes("1", adjacency);
  const sequenceNodes = sequenceIds.map((id) => nodeMap.get(id)?.data.label);
  console.log("Node sequence:", sequenceNodes);

  const nodeTypes = useMemo(() => ({ default: DefaultNode }), []);

  const onNodesChange = (changes: NodeChange[]) =>
    setNodes((nds) => applyNodeChanges(changes, nds));

  const onEdgesChange = (changes: EdgeChange[]) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));

  const onConnect = (connection: Connection) => setEdges((eds) => addEdge(connection, eds));

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, label: string, type: string) => {
    const data = JSON.stringify({ label, type });
    event.dataTransfer.setData('application/reactflow', data);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!reactFlowWrapper.current || !reactFlowInstance) return;

    const reactFlowData = event.dataTransfer.getData('application/reactflow');
    if (!reactFlowData) return;

    const { type, label } = JSON.parse(reactFlowData);
    if (!type || !label) return;

    const nodeTypeItem = nodeTypesList.find((n) => n.label === label && n.type === type);
    if (!nodeTypeItem) return;

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position: XYPosition = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const newNode: Node<AIFlowNodeData> = {
      id: (nodes.length + 1).toString(),
      type: 'default',
      position,
      data: {
        label,
        type,
        style: styleMap[type],
        component: nodeTypeItem.component,
      },
      style: { background: 'transparent', border: '0px' },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
        setNodes((nds) => nds.filter((n) => !n.selected));
        setEdges((eds) => eds.filter((e) => !e.selected));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Layout showFooter={false}>
      <div className="bg-[#2B3340] font-poppins">
        <div className="text-center text-[#D7FFCC] font-semibold text-[40px] pt-10">
          Create Your Workflow
        </div>
        <div className="text-center text-[#D7FFCC] opacity-[0.6] text-[18px] pb-10">
          These are the commands AI will be given
        </div>
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-52 p-2 border-r border-gray-700 bg-gray-900">
            <h3 className="font-bold mb-2 text-[#9DD4B2]">Workflows</h3>
            <div className="flex flex-col gap-2">
              {nodeTypesList.map((node) => (
                <div
                  key={node.label}
                  draggable
                  onDragStart={(e) => onDragStart(e, node.label, node.type)}
                  style={{ position: 'relative', ...styleMap[node.type] }}
                  className={`backdrop-blur-[1px] font-poppins cursor-pointer`}
                >
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
              noDragClassName="nodrag"
            ></ReactFlow>
          </div>
        </div>
        <Chatbot />
      </div>
    </Layout>
  );
}
