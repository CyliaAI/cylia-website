import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position,
  Controls,
  MiniMap,
} from 'reactflow';
import type { Node, Edge, NodeChange, EdgeChange, Connection, ReactFlowInstance, XYPosition } from 'reactflow';
import Cookies from 'js-cookie';
import axios from 'axios';
import LZString from 'lz-string';
import 'reactflow/dist/style.css';
import Layout from '../components/Layout/Layout';
import Dropdown from '@/components/Workspace/Dropdown';
import Chatbot from '@/components/Workspace/Chatbot';
import { Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import PrivateRoute from '@/router/PrivateRoutes';
import EmailForm from '@/components/Workspace/EmailForm';
import UploadBox from '@/utils/UploadBox';
import SchedulePicker from '@/components/Workspace/SchedulePicker';

interface AIFlowNodeData {
  label: string;
  style?: React.CSSProperties;
  type?: string;
  component?: React.ReactNode;
}

interface NodeInputValues {
  [label: string]: any[];
}

type NodeType = {
  type: 'BEGIN' | 'MID' | 'END';
  label: string;
  component: React.ReactElement;
};

const styleMap: Record<string, React.CSSProperties> = {
  MID: { color: '#fff', borderWidth: '7px 1px 1px 1px', borderStyle: 'solid', borderColor: '#06b6d4', borderRadius: 5, padding: '10px 20px', fontWeight: 'bold', boxShadow: '2px 2px 10px rgba(0,0,0,0.3)', textAlign: 'center' },
  END: { color: '#fff', borderWidth: '7px 1px 1px 1px', borderStyle: 'solid', borderColor: '#FF5858', borderRadius: 5, padding: '10px 15px', fontStyle: 'italic', boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2)', textAlign: 'center' },
  BEGIN: { color: '#fff', borderWidth: '7px 1px 1px 1px', borderStyle: 'solid', borderColor: '#6EFF7F', borderRadius: 5, padding: '12px 16px', fontFamily: 'monospace', fontWeight: '500', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)', textAlign: 'center' },
};

const initialNodes: Node<AIFlowNodeData>[] = [
  { id: '1', type: 'default', data: { label: 'Start' }, position: { x: 50, y: 50 } },
  { id: '2', type: 'default', data: { label: 'Output' }, position: { x: 400, y: 50 } },
];

const initialEdges: Edge[] = [];

export default function Flow() {
  const [nodes, setNodes] = useState<Node<AIFlowNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [nodeInputValues, setNodeInputValues] = useState<NodeInputValues>({});
  const [flowOrder, setFlowOrder] = useState<string[]>([]);
  const [nodeInputsMap, setNodeInputsMap] = useState<Record<string, any[]>>({});
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onNodesChange = (changes: NodeChange[]) => setNodes(nds => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes: EdgeChange[]) => setEdges(eds => applyEdgeChanges(changes, eds));
  const onConnect = (connection: Connection) => setEdges(eds => addEdge(connection, eds));

  const [uploaded, setUploaded] = useState(false)
  const [file, setFile] = useState();

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, label: string, type: string) => {
    const data = JSON.stringify({ label, type });
    event.dataTransfer.setData('application/reactflow', data);
    event.dataTransfer.effectAllowed = 'move';
  };

  const saveFlowToCookie = (nodes: Node<AIFlowNodeData>[], edges: Edge[]) => {
    const serializableNodes = nodes.map(({ id, type, position, data, style }) => ({
      id,
      type,
      position,
      style,
      data: {
        label: data.label,
        type: data.type,
        style: data.style,
      },
    }));

    const flow = { nodes: serializableNodes, edges };
    const compressed = LZString.compressToBase64(JSON.stringify(flow));
    Cookies.set('myFlow', compressed, { expires: 7 });
  };


  const loadFlowFromCookie = () => {
    const compressed = Cookies.get('myFlow');
    if (!compressed) return { nodes: [], edges: [] };
    try {
      const json = LZString.decompressFromBase64(compressed);
      return JSON.parse(json);
    } catch (err) {
      console.error('Failed to load flow', err);
      return { nodes: [], edges: [] };
    }
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!reactFlowWrapper.current || !reactFlowInstance) return;

    const reactFlowData = event.dataTransfer.getData('application/reactflow');
    if (!reactFlowData) return;

    const { type, label } = JSON.parse(reactFlowData);
    if (!type || !label) return;

    const nodeTypeItem = nodeTypesList.find(n => n.label === label && n.type === type);
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
        component: React.cloneElement(nodeTypeItem.component),
      },
      style: { background: 'transparent', border: '0px' },
    };

    setNodes(nds => nds.concat(newNode));
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();

  const nodeTypesList: NodeType[] = [
    {
      type: 'MID',
      label: 'LLM',
      component: <Dropdown label="Select Model" options={['gpt-4', 'gpt-3.5-turbo', 'claude-3', 'llama-2-13b', 'mpt-7b', 'falcon-40b']}/>,
    },
    {
      type: 'MID',
      label: 'VectorDB',
      component: <Dropdown label="Select DB" options={['Faiss', 'pgvector', 'Pinecone', 'Qdrant (Managed)']} />,
    },
    {
      type: 'MID',
      label: 'Schedule',
      component: <SchedulePicker />,
    },
    {
      type: 'END',
      label: 'FiletoText',
      component: <div className="text-[6px] text-gray-400 font-semibold">Yea Sure Lol</div>,
    },
    {
      type: 'END',
      label: 'RAG',
      component: <div className="text-[6px] text-gray-400 font-semibold">This will retrieve relevant info from the specified vectorDB</div>,
    },
    {
      type: 'END',
      label: 'SendEmail',
      component: <EmailForm />,
    },
    {
      type: 'BEGIN',
      label: 'Document',
      component: <UploadBox  />,
    },
  ];

  const nodeTypeMap: Record<string, NodeType> = {};
  nodeTypesList.forEach((n) => { nodeTypeMap[n.label] = n; });

  const handleExport = () => {
    console.log("Flow Order:", flowOrder);
    console.log("Node Inputs:", nodeInputsMap);
  }

  const DefaultNode = ({ data }: { data: AIFlowNodeData }) => {
    const bgMap: Record<string, string> = {
      MID: 'bg-blue-400/15',
      END: 'bg-red-400/15',
      BEGIN: 'bg-green-400/15',
    };

    const component = nodeTypeMap[data.label]?.component ?? null;

    const renderedComponent = React.isValidElement(component)
      ? React.cloneElement(component as React.ReactElement<any>, {
          nodeLabel: data.label,
          onValueChange: (label: string, value: any) => {
            setNodeInputValues((prev) => ({
              ...prev,
              [label]: [...(prev[label] || []), value],
            }));
            if (data.label == "Document"){
              setUploaded(true)
              setFile(value)
            }
          },
        })
      : component;

    return (
      <div
        style={{ position: 'relative', ...data.style }}
        className={`${bgMap[data.type]} ${
          data.label === 'Start' || data.label === 'Output' ? 'w-full' : 'w-fit'
        } backdrop-blur-[1px] font-poppins`}
      >
        {data.label !== 'Start' && <Handle type="target" position={Position.Left} />}
        <div className="text-[8px] mb-2">{data.label}</div>
        <div>{renderedComponent}</div>
        {data.label !== 'Output' && <Handle type="source" position={Position.Right} />}
      </div>
    );
  };

  const nodeTypes = useMemo(() => ({ default: DefaultNode }), []);

  function getFlowOrder(nodes: Node<AIFlowNodeData>[], edges: Edge[]): string[] {
    const adj: Record<string, string[]> = {};
    const indegree: Record<string, number> = {};

    nodes.forEach((n) => {
      adj[n.id] = [];
      indegree[n.id] = 0;
    });

    edges.forEach((e) => {
      if (adj[e.source]) adj[e.source].push(e.target);
      if (indegree[e.target] !== undefined) indegree[e.target]++;
    });

    const queue = Object.keys(indegree).filter((id) => indegree[id] === 0);
    const order: string[] = [];

    while (queue.length) {
      const current = queue.shift()!;
      order.push(current);

      for (const next of adj[current]) {
        indegree[next]--;
        if (indegree[next] === 0) queue.push(next);
      }
    }

    nodes.forEach((n) => {
      if (!order.includes(n.id)) order.push(n.id);
    });

    const orderWithLabels = order.map((id) => {
      const node = nodes.find((n) => n.id === id);
      return node?.data?.label ?? id;
    });

    return orderWithLabels;
  }

  const handleSubmit = () => {
    console.log("Flow Order:", flowOrder);
    console.log("Node Inputs:", nodeInputsMap);
    const formData = new FormData();
    if (uploaded) {
      const allFiles = (nodeInputsMap.Document || []).filter(f => f instanceof File);
      formData.append('file', allFiles[0])
    }
    formData.append('flow', JSON.stringify(flowOrder));
    formData.append('data', JSON.stringify(nodeInputsMap))

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/task/run-flow`, formData, {
      headers: {"Content-Type": "multipart/form-data"}
    })
    .then(response => {
      console.log('Flow submitted successfully:', response.data);
    })
    .catch(error => {
      console.error('Error submitting flow:', error);
    });
    toast.success("Flow submitted! Check console for details.");
  };

  useEffect(() => {
    const order = getFlowOrder(nodes, edges);
    setFlowOrder(order);
  }, [nodes, edges]);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
        setNodes(nds => nds.filter(n => !n.selected));
        setEdges(eds => eds.filter(e => !e.selected));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!nodes || !edges) return;

    const order = getFlowOrder(nodes, edges);
    setFlowOrder(order);

    const orderedInputs: Record<string, any[]> = {};
    order.forEach((label) => {
      if (nodeInputValues[label]) {
        orderedInputs[label] = nodeInputValues[label];
      }
    });

    setNodeInputsMap(orderedInputs);
  }, [nodes, edges, nodeInputValues]);


  useEffect(() => {
    const flow = loadFlowFromCookie();
    if (flow.nodes.length > 0) {
      setNodes(flow.nodes);
      setEdges(flow.edges);
      toast.success('Previous session flow loaded');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => saveFlowToCookie(nodes, edges), 1000);
    return () => clearTimeout(timer);
  }, [nodes, edges]);

  return (
    <Layout showFooter={false}>
      <PrivateRoute />
      <div className="bg-[#2B3340] font-poppins min-h-screen">
        <div className="text-center text-[#D7FFCC] font-semibold text-[40px] pt-6">Create Your Workflow</div>
        <div className="text-center text-[#D7FFCC] opacity-[0.6] text-[18px] pb-2">These are the commands AI will be given</div>

        <div className="flex justify-end px-4 py-2 gap-3">
          <button onClick={handleExport} className="border-[#D7FFCC] text-[#D7FFCC] border px-3 py-1 rounded-full hover:bg-[#D7FFCC] hover:text-black transition-all duration-200">Export</button>
          <button className="text-[#D7FFCC] cursor-pointer"><Settings size={30} /></button>
        </div>

        <div className="flex h-screen">
          <div className="w-52 p-2 border-r border-gray-700 bg-gray-900">
            <h3 className="font-bold mb-2 text-[#9DD4B2]">Workflows</h3>
            <div className="flex flex-col gap-2">
              {nodeTypesList.map((node) => (
                <div key={node.label} draggable onDragStart={(e) => onDragStart(e, node.label, node.type)} style={{ position: 'relative', ...styleMap[node.type] }} className="backdrop-blur-[1px] font-poppins cursor-pointer">
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
              className="w-full h-full bg-[url('/bg.svg')] bg-center bg-[length:40%]"
              nodeTypes={nodeTypes}
              noDragClassName="nodrag"
            >
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
        </div>
        <button onClick={handleSubmit} className="border-blue-950 bg-blue-600 font-semibold text-white border px-3 py-1 text-xl rounded-md hover:bg-blue-500 transition-all duration-200 cursor-pointer">
            Submit
        </button>
        <Chatbot />
      </div>
    </Layout>
  );
}
