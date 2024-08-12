import ForceGraph2D from "react-force-graph-2d";
import { useGraph } from "./hooks/use-graph";

type Props = {
	nodes: Node[];
	links: Link[];
	onNodeClick: (nodeIRI: string) => void;
};

interface Node {
	id: string;
	text: string;
	label: string;
}

interface Link {
	source: string;
	target: string;
}

export function Graph({ nodes, links, onNodeClick }: Props) {
	const { findDocuments } = useGraph();

	return (
		<ForceGraph2D
			backgroundColor={"black"}
			graphData={{ nodes, links }}
			linkDirectionalArrowLength={1}
			linkDirectionalArrowRelPos={1}
			linkCurvature={0.1}
			nodeId="id"
			nodeAutoColorBy="label"
			nodeCanvasObjectMode={() => "after"}
			nodeCanvasObject={(node, ctx, globalScale) => {
				const fontSize = 12 / globalScale;
				ctx.font = `${fontSize}px Sans-Serif`;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillStyle = "white";
				ctx.fillText(node.text, node.x, node.y + 10);
			}}
			nodeVal={(node) => {
				return node.label === "Document" ? 0.01 : 5;
			}}
			linkAutoColorBy="1"
			linkCanvasObjectMode={() => "after"}
			linkCanvasObject={(rel, ctx, globalScale) => {
				const { x: srcX, y: srcY } = rel.source;
				const { x: tgtX, y: tgtY } = rel.target;

				const fontSize = 10 / globalScale;
				ctx.font = `${fontSize}px Sans-Serif`;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillStyle = "white";

				const textX = (srcX + tgtX) / 2;
				const textY = (srcY + tgtY) / 2 + (srcY < tgtY ? -5 : 5);

				ctx.fillText(rel.text, textX, textY);
			}}
			onNodeClick={(node) => {
				if (node.label === "Document") {
					return;
				}
				onNodeClick(node.id);
			}}
		/>
	);
}
