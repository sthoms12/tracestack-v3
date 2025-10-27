import { Session } from "@shared/types";
import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Connection, Edge, Node } from 'react-flow';
import 'react-flow/dist/style.css';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useDebounce } from "react-use";
import { toast } from "sonner";
import { Button } from "../ui/button";
const initialNodes: Node[] = [
  { id: '1', position: { x: 250, y: 5 }, data: { label: 'Problem Statement' } },
];
export default function SessionBrainstormView({ session }: { session: Session }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(session.brainstormData?.nodes || initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(session.brainstormData?.edges || []);
  const queryClient = useQueryClient();
  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const updateBrainstormMutation = useMutation({
    mutationFn: (data: { nodes: Node[], edges: Edge[] }) => api(`/api/sessions/${session.id}/brainstorm`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', session.id] });
      toast.success("Brainstorm saved");
    },
    onError: (error) => {
      toast.error(`Failed to save brainstorm: ${error.message}`);
    },
  });
  const handleSave = useCallback(() => {
    updateBrainstormMutation.mutate({ nodes, edges });
  }, [nodes, edges, updateBrainstormMutation]);
  useDebounce(handleSave, 2000, [nodes, edges]);
  useEffect(() => {
    if (session.brainstormData) {
      setNodes(session.brainstormData.nodes || initialNodes);
      setEdges(session.brainstormData.edges || []);
    }
  }, [session.brainstormData, setNodes, setEdges]);
  const addNode = () => {
    const newNodeId = (nodes.length + 1).toString();
    const newNode = {
      id: newNodeId,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `New Node ${newNodeId}` },
    };
    setNodes((nds) => nds.concat(newNode));
  };
  return (
    <div style={{ height: '600px' }} className="border rounded-lg relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
      <div className="absolute top-4 right-4 z-10 space-x-2">
        <Button onClick={addNode}>Add Node</Button>
      </div>
    </div>
  );
}