import type { NamedNode } from "oxigraph";
import {
    asIRI,
    loadRDF,
    query,
    relIRI,
} from "../utils/rdf";

export function useGraph() {
    return {
        load: () => {
            loadRDF();
        },
        query1Step: (q: string) => {
            const result = query(
                `SELECT ?n ?r ?n2 ?value ?label ?value2 ?label2 WHERE { 
                    ?n ?r ?n2.
                    ?n ${asIRI("value")} ?value .
                    ?n ${asIRI("label")} ?label .
                    ?n2 ${asIRI("value")} ?value2 .
                    ?n2 ${asIRI("label")} ?label2 .
                    FILTER regex(?value, "${q}") .
                } LIMIT 100`,
            );

            return getElements(result);
        },
        findDocuments: (nodeId: string) => {
            const nodeResult = query(
                `SELECT ?value WHERE {
                    <${nodeId}> ${asIRI("value")} ?value.
                }`,
            );

            const nodeValue = nodeResult[0].get("value")?.value;

            const result = query(
                `SELECT ?doc ?props ?label WHERE {
                    <${nodeId}> ${asIRI("label")} ?label.
                    ?doc ${relIRI("MENTIONS")} <${nodeId}>.
                    ?doc ${asIRI("value")} ?props
                }`,
            );

            const docs = [];
            for (const binding of result) {
                const doc = binding.get("props")?.value;

                docs.push(doc);
            }

            return { nodeValue, docs };
        },
    };
}

function getElements(result: Map<string, NamedNode>[]) {
    const nodes = new Map();
    const edges = new Map();

    for (const binding of result) {
        const n = binding.get("n")?.value;
        const value = binding.get("value")?.value;
        const label = binding.get("label")?.value;

        const r = binding.get("r")?.value;

        const n2 = binding.get("n2")?.value;
        const value2 = binding.get("value2")?.value;
        const label2 = binding.get("label2")?.value;

        nodes.set(n, {
            id: n,
            text:
                label === "Document"
                    ? "📄" + value?.split(":")[0].replaceAll('"', "")
                    : value,
            label: label?.split(",").find((l) => l !== "__Entity__"),
        });

        nodes.set(n2, {
            id: n2,
            text: value2,
            label: label2?.split(",").find((l) => l !== "__Entity__"),
        });

        const linkText = r?.replace("http://_/r/", "");

        edges.set(`${n}-${n2}`, {
            source: n,
            target: n2,
            text: linkText === "MENTIONS" ? "" : linkText,
        });
    }

    return [[...nodes.values()], [...edges.values()]];
}
