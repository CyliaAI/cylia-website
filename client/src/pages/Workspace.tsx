import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position,
  Controls,
  Background,
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
import { Settings, Save, Play, Download, Trash2, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import PrivateRoute from '@/router/PrivateRoutes';
import EmailForm from '@/components/Workspace/EmailForm';
import UploadBox from '@/components/Workspace/UploadBox';
import SchedulePicker from '@/components/Workspace/SchedulePicker';
import { useGlobalContext } from '@/context/GlobalContext';
import { Navigate, useParams } from 'react-router-dom';
import RAGInput from '@/components/Workspace/RAGInput';

interface AIFlowNodeData {
  label: string;
  style?: React.CSSProperties;
  type?: string;
  component?: React.ReactNode;
  input?: string;
  status?: string;
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
  MID: { 
    color: '#fff', 
    borderWidth: '3px 1px 1px 1px', 
    borderStyle: 'solid', 
    borderColor: '#06b6d4', 
    borderRadius: 8, 
    padding: '12px 20px', 
    fontWeight: 'bold', 
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    textAlign: 'center',
    backdropFilter: 'blur(4px)'
  },
  END: { 
    color: '#fff', 
    borderWidth: '3px 1px 1px 1px', 
    borderStyle: 'solid', 
    borderColor: '#FF5858', 
    borderRadius: 8, 
    padding: '12px 18px', 
    fontStyle: 'italic', 
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    textAlign: 'center',
    backdropFilter: 'blur(4px)'
  },
  BEGIN: { 
    color: '#fff', 
    borderWidth: '3px 1px 1px 1px', 
    borderStyle: 'solid', 
    borderColor: '#6EFF7F', 
    borderRadius: 8, 
    padding: '12px 18px', 
    fontFamily: 'monospace', 
    fontWeight: '600', 
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    textAlign: 'center',
    backdropFilter: 'blur(4px)'
  },
};

const initialNodes: Node<AIFlowNodeData>[] = [
  { id: '1', type: 'default', data: { label: 'Start' }, position: { x: 100, y: 100 } },
  { id: '2', type: 'default', data: { label: 'Output' }, position: { x: 500, y: 100 } },
];

const initialEdges: Edge[] = [];

export default function Flow({ type }: { type: string }) {
  const { id, loading } = useGlobalContext();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isValid, setIsValid] = useState<boolean>(true)
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
  const [exportPop, setExportPop] = useState<boolean>(false);

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

    const flow = { nodes: serializableNodes, edges, id, workspaceId, type };
    const compressed = LZString.compressToBase64(JSON.stringify(flow));
    Cookies.set('myFlow', compressed, { expires: 7 });
  };

  function getNodeByLabel(label: string) {
    return nodes.find((n) => n.data.label === label);
  }

  const saveFlowToDB = (nodes: Node<AIFlowNodeData>[], edges: Edge[]) => {
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

    const workflow = { nodes: serializableNodes, edges }
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/workspaces/save-workflow`, {workspaceId: Number(workspaceId), workflow})
    .then(res => {
      console.log(res);
      toast.success("Workflow has been successfully saved");
    })
    .catch(err => {
      console.error(err);
    })
  }

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
      type: 'BEGIN',
      label: 'Document',
      component: <UploadBox  />,
    },
    {
      type: 'MID',
      label: 'LLM',
      component: <Dropdown label="Select Model" options={['gemini-2.5-flash', 'llama3.2:1b']}/>,
    },
    {
      type: 'MID',
      label: 'ToVectorDB',
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
      component: <div className="text-[6px] text-gray-400 font-semibold">This will convert the inserted document node into text and produce it to the next node</div>,
    },
    {
      type: 'END',
      label: 'RAG',
      component: <RAGInput />,
    },
    {
      type: 'END',
      label: 'SendEmail',
      component: <EmailForm />,
    },
  ];

  const nodeTypeMap: Record<string, NodeType> = {};
  nodeTypesList.forEach((n) => { nodeTypeMap[n.label] = n; });

  const DefaultNode = ({ data }: { data: AIFlowNodeData }) => {
    const bgMap: Record<string, string> = {
      MID: 'bg-cyan-500/5',
      END: 'bg-red-500/5',
      BEGIN: 'bg-green-500/5',
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
            if (label == "Document") {
              setUploaded(true);
            }
          },
        })
      : component;

    return (
      <div
        style={{ position: 'relative', ...data.style }}
        className={`${bgMap[data.type]} ${
          data.label === 'Start' || data.label === 'Output' ? 'w-full min-w-[120px]' : 'w-fit min-w-[140px]'
        } font-poppins`}
      >
        {data.label !== 'Start' && <Handle type="target" position={Position.Left} className="w-3 h-3" />}
        <div className="text-[10px] my-2 font-semibold tracking-wide">{data.label}</div>
        <div>{renderedComponent}</div>
        {data.label !== 'Output' && <Handle type="source" position={Position.Right} className="w-3 h-3" />}
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
    console.log(uploaded)
    if (uploaded) {
      const allFiles = (nodeInputsMap.Document || []).filter(f => f instanceof File);
      formData.append('file', allFiles[0])
    }
    formData.append('flow', JSON.stringify(flowOrder));
    formData.append('data', JSON.stringify({ ...nodeInputsMap, userId: id }))

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

  const handleClear = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setNodeInputValues({});
    toast.success("Canvas cleared!");
  };

  const exportAsText = () => {
    
  }

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
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/workspaces/${type == "personal" ? "get-workflow" : "get-team-workflow"}`, type == "personal" ? {workspaceId: Number(workspaceId)} : {teamId: Number(workspaceId)})
      .then(res => {
        const flow = loadFlowFromCookie();
        if (flow.nodes.length > 0) {
          if (flow.id === id && flow.workspaceId == workspaceId && flow.type === type) {
            setNodes(flow.nodes);
            setEdges(flow.edges);
            toast.success('Previous session flow loaded');
          } else {
            setNodes(res.data.workflow.nodes);
            setEdges(res.data.workflow.edges);
            toast.success('DB flow loaded');
          }
        } else {
          setNodes(res.data.workflow.nodes);
          setEdges(res.data.workflow.edges);
          toast.success('DB flow loaded');
        }
      })
      .catch(err => {
        setIsValid(false);
        console.error(err);
      })
  }, [loading]);

  useEffect(() => {
    const timer = setTimeout(() => saveFlowToCookie(nodes, edges), 1000);
    return () => clearTimeout(timer);
  }, [nodes, edges]);

  return (
    <Layout showFooter={false}>
      {!isValid && <Navigate to="/not-found"/>}
      {exportPop && (
        <div className='min-h-screen w-full fixed bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center'>
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-4">Export Workflow</h2>
            <p className="text-gray-300 mb-6">Download your workflow configuration</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setExportPop(false)}
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={exportAsText}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download as .txt
              </button>
            </div>
          </div>
        </div>
      )}
      <PrivateRoute />
      <div className="bg-gradient-to-br from-[#1a1f2e] via-[#2B3340] to-[#1e2733] font-poppins min-h-screen pt-20">
        <div className="pt-8 pb-6 px-6 border-b border-gray-700/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-[#D7FFCC] font-bold text-4xl mb-2 tracking-tight">
                Create Your Workflow
              </h1>
              <p className="text-[#D7FFCC]/60 text-lg">
                Design AI-powered automation flows with drag-and-drop simplicity
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-blue-500/10 rounded-lg border border-blue-500/20"></div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => saveFlowToDB(nodes, edges)}
                  className="flex items-center gap-2 bg-gray-700/50 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 border border-gray-600/50"
                >
                  <Save size={18} />
                  <span className="hidden sm:inline">Save</span>
                </button>
                <button 
                  onClick={handleClear}
                  className="flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all duration-200 border border-red-500/30"
                >
                  <Trash2 size={18} />
                  <span className="hidden sm:inline">Clear</span>
                </button>
                <button 
                  onClick={() => setExportPop(true)} 
                  className="flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/20 transition-all duration-200 border border-green-500/30"
                >
                  <Download size={18} />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <button className="flex items-center gap-2 bg-gray-700/50 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 border border-gray-600/50">
                  <Settings size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-220px)]">
          <div className="w-64 p-4 border-r border-gray-700/50 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-1 text-[#9DD4B2] flex items-center gap-2">
                <span className="w-1 h-5 bg-[#9DD4B2] rounded-full"></span>
                Workflow Nodes
              </h3>
              <p className="text-xs text-gray-400 ml-3">Drag to canvas to add</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold text-green-400 mb-2 uppercase tracking-wider">Inputs</div>
                {nodeTypesList.filter(n => n.type === 'BEGIN').map((node) => (
                  <div 
                    key={node.label} 
                    draggable 
                    onDragStart={(e) => onDragStart(e, node.label, node.type)} 
                    style={{ position: 'relative', ...styleMap[node.type] }} 
                    className="backdrop-blur-sm font-poppins cursor-move hover:scale-105 transition-transform mb-2"
                  >
                    <div className="text-[10px] font-semibold">{node.label}</div>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-xs font-semibold text-cyan-400 mb-2 uppercase tracking-wider">Processing</div>
                {nodeTypesList.filter(n => n.type === 'MID').map((node) => (
                  <div 
                    key={node.label} 
                    draggable 
                    onDragStart={(e) => onDragStart(e, node.label, node.type)} 
                    style={{ position: 'relative', ...styleMap[node.type] }} 
                    className="backdrop-blur-sm font-poppins cursor-move hover:scale-105 transition-transform mb-2"
                  >
                    <div className="text-[10px] font-semibold">{node.label}</div>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-xs font-semibold text-red-400 mb-2 uppercase tracking-wider">Outputs</div>
                {nodeTypesList.filter(n => n.type === 'END').map((node) => (
                  <div 
                    key={node.label} 
                    draggable 
                    onDragStart={(e) => onDragStart(e, node.label, node.type)} 
                    style={{ position: 'relative', ...styleMap[node.type] }} 
                    className="backdrop-blur-sm font-poppins cursor-move hover:scale-105 transition-transform mb-2"
                  >
                    <div className="text-[10px] font-semibold">{node.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div ref={reactFlowWrapper} tabIndex={0} className="flex-1 h-full relative">
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
              nodeTypes={nodeTypes}
              noDragClassName="nodrag"
              defaultEdgeOptions={{
                animated: true,
                style: { stroke: '#6EFF7F', strokeWidth: 2 }
              }}
            >
              <Controls className="bg-gray-800/90 border border-gray-700 rounded-lg" />
              <MiniMap 
                className="bg-gray-900/90 border border-gray-700 rounded-lg" 
                nodeColor={(node) => {
                  const typeColors = {
                    BEGIN: '#6EFF7F',
                    MID: '#06b6d4',
                    END: '#FF5858'
                  };
                  return typeColors[node.data.type as keyof typeof typeColors] || '#999';
                }}
              />
              <Background color="#4a5568" gap={16} />
            </ReactFlow>
          </div>
        </div>

        <div className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                <span className="font-semibold text-gray-300">{nodes.length}</span> nodes
                <span className="mx-2">•</span>
                <span className="font-semibold text-gray-300">{edges.length}</span> connections
              </div>
            </div>
            
            <button 
              onClick={handleSubmit} 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 font-semibold text-white px-6 py-3 text-lg rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Play size={20} />
              Run Workflow
            </button>
          </div>
        </div>

        <Chatbot />
      </div>
    </Layout>
  );
}