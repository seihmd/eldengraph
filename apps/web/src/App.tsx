import { useState } from "react";
import { Graph } from "./Graph";
import { useGraph } from "./hooks/use-graph";
import { query } from "./utils/rdf";

function App() {
	const graph = useGraph();
	const [q, setQ] = useState("");
	const [elements, setElements] = useState([[], []]);
	const [documents, setDocuments] = useState<{
		nodeValue: string;
		docs: string[];
	} | null>(null);

	setTimeout(() => {
		graph.load();
	}, 500);

	return (
		<>
			<div className="grid">
				<h4>Eldengraph</h4>
				{/* <Debug /> */}
				<form>
					<div style={{ display: "flex", columnGap: "5px" }}>
						<input
							type="search"
							value={q}
							onChange={(e) => setQ(e.target.value)}
						/>

						<button
							style={{ width: "100px" }}
							type="submit"
							disabled={q === ""}
							onClick={(e) => {
								e.preventDefault();
								if (q === "") {
									return;
								}

								setElements(graph.query1Step(q));
							}}
						>
							表示
						</button>
					</div>
				</form>
			</div>

			<div style={{ width: "100%", height: "60vh" }}>
				<Graph
					nodes={elements[0]}
					links={elements[1]}
					onNodeClick={(nodeIRI) => {
						setDocuments(graph.findDocuments(nodeIRI));
					}}
				/>
			</div>
			<Documents
				documents={documents}
				onTitleClick={(title) => {
					setElements(graph.query1Step(title));
				}}
				onClose={() => {
					setDocuments(null);
				}}
			/>
		</>
	);
}

export default App;

function Documents({
	documents,
	onTitleClick,
	onClose,
}: {
	documents: { nodeValue: string; docs: string[] };
	onTitleClick: (title: string) => void;
	onClose: () => void;
}) {
	if (!documents) {
		return;
	}

	const { nodeValue, docs } = documents;

	return (
		<article
			style={{
				position: "fixed",
				width: "100%",
				maxHeight: "200px",
				overflow: "scroll",
				background: "black",
				opacity: "0.8",
				color: "white",
				paddingBottom: "30px",
			}}
		>
			<div
				style={{ position: "fixed", right: "20px", cursor: "pointer" }}
				onClick={onClose}
			>
				☓
			</div>
			<h3
				style={{
					cursor: "pointer",
					textDecoration: "underline",
					color: "#00ffe0",
				}}
				onClick={() => {
					onTitleClick(nodeValue);
				}}
			>
				{nodeValue}
			</h3>
			{docs.map((doc, i) => {
				const [subject, text] = doc.split(":");

				return (
					<div key={i}>
						<h4>{subject.replaceAll(`"`, "")}</h4>
						<blockquote>{text.replaceAll(`"`, "")}</blockquote>
					</div>
				);
			})}
		</article>
	);
}

function Debug() {
	const [q, setQ] = useState("");

	return (
		<div>
			<textarea value={q} onChange={(e) => setQ(e.target.value)} />
			<button
				onClick={() => {
					const result = query(q);
					console.log({ result });
				}}
			/>
		</div>
	);
}
