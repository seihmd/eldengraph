import {
	type KeyboardEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Graph } from "./Graph";
import { useGraph } from "./hooks/use-graph";
import { getRandomNodeValue, query } from "./utils/rdf";

function App() {
	const graph = useGraph();
	const [elements, setElements] = useState([[], []]);
	const [documents, setDocuments] = useState<{
		nodeValue: string;
		docs: string[];
	} | null>(null);

	setTimeout(() => {
		graph.load();
	}, 100);

	return (
		<>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "100vh",
					overflow: "hidden",
				}}
			>
				<div>
					<Header
						onSearch={(q) => {
							setElements(graph.query1Step(q));
						}}
						onRandom={() => {
							setElements(graph.query1Step(getRandomNodeValue()));
						}}
						onClickEscape={() => {
							setDocuments(null);
						}}
					/>
				</div>
				<div style={{ width: "100%" }}>
					<Graph
						nodes={elements[0]}
						links={elements[1]}
						onNodeClick={(nodeIRI) => {
							setDocuments(graph.findDocuments(nodeIRI));
						}}
					/>
				</div>
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

function Header({
	onSearch,
	onRandom,
	onClickEscape,
}: {
	onSearch: (q: string) => void;
	onRandom: () => void;
	onClickEscape: () => void;
}) {
	const [q, setQ] = useState("");
	const ref = useRef(null);

	const escFunction = useCallback((event: KeyboardEvent) => {
		if (event.key === "Escape") {
			onClickEscape();
		}
		if ((event.metaKey || event.ctrlKey) && event.code === "KeyK") {
			if (ref.current) {
				ref.current.focus();
			}
		}
	}, []);

	useEffect(() => {
		document.addEventListener("keydown", escFunction, false);

		return () => {
			document.removeEventListener("keydown", escFunction, false);
		};
	}, [escFunction]);

	return (
		<div className="grid" style={{ marginTop: "20px" }}>
			<h4 style={{ marginLeft: "20px" }}>Eldengraph</h4>
			{/* <Debug /> */}

			<button
				style={{ width: "100px", height: "28px", padding: 0 }}
				onClick={onRandom}
			>
				ランダム
			</button>
			<form>
				<div style={{ display: "flex", columnGap: "5px" }}>
					<input
						ref={ref}
						style={{ height: "20px" }}
						type="search"
						value={q}
						onChange={(e) => setQ(e.target.value)}
						placeholder="Ctl+ K"
					/>

					<button
						style={{ width: "100px", height: "28px", padding: 0 }}
						type="submit"
						disabled={q === ""}
						onClick={(e) => {
							e.preventDefault();
							if (q === "") {
								return;
							}

							onSearch(q);
						}}
					>
						表示
					</button>
				</div>
			</form>
		</div>
	);
}

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
				bottom: 0,
				width: "100%",
				maxHeight: "500px",
				overflow: "scroll",
				background: "black",
				opacity: "0.8",
				color: "white",
				paddingBottom: "30px",
			}}
		>
			<div
				style={{
					position: "fixed",
					right: "20px",
					cursor: "pointer",
					padding: "10px",
				}}
				onClick={onClose}
			>
				☓
			</div>
			<div style={{ display: "flex" }}>
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
			</div>
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
